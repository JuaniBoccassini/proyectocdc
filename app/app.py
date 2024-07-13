from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import mysql.connector.errorcode
from werkzeug.utils import secure_filename

import os
import time

#-------------------------------------------------------

app = Flask(__name__)
CORS(app) #Habilita CORS para todas las rutas

class Shipment:
    
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host = host,
            user = user,
            password = password,)
        
        self.cursor = self.conn.cursor()
        
        # Se intenta seleccionar la base de datos
        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:  # Si la base de datos no existe, se la crea
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err
            
            self.cursor.execute("""CREATE TABLE IF NOT EXISTS envios (
                (tracking_number INT AUTO_INCREMENT PRIMARY KEY,
                            sender VARCHAR(255) NOT NULL,
                            receiver VARCHAR(255) NOT NULL,
                            origin VARCHAR(255) NOT NULL,
                            destination VARCHAR(255) NOT NULL,
                            status VARCHAR(255) NOT NULL,
                            shipping_date VARCHAR(255), 
                            delivery_date VARCHAR(255))"""
            )
            self.conn.commit()
            
            
        # Se cierra el cursor inicial y se abre uno nuevo con el parametro dictionary=True
            self.cursor.close()
            self.cursor = self.conn.cursor(dictionary=True)
            
            
    
 #Funcion que añade un envio a la lista

    def agregar_envio(self, sender, receiver, origin, destination, status, shipping_date, delivery_date):
        sql = "INSERT INTO envios (sender, receiver, origin, destination, status, shipping_date, delivery_date) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        valores = (sender, receiver, origin, destination, status, shipping_date, delivery_date)
        
        self.cursor.execute(sql,valores)
        self.conn.commit()
        return self.cursor.lastrowid
           


#Funcion que devuelve los datos de un envio

    def consultar_envio(self, tracking_number):
        self.cursor.execute(f"SELECT * FROM envios WHERE tracking_number = {tracking_number}")
        return self.cursor.fetchone()
    
    
    
#Funcion que modifica un envio

    def modificar_envio(self, tracking_number,new_status):
        sql = "UPDATE envios SET status = %s, WHERE tracking_number = %s "
        valores = (new_status, tracking_number)
        
        self.cursor.execute(sql,valores)
        self.conn.commit()
        return self.cursor.rowcount > 0  #Indica cuantos registros se modificaron
          
     
    

#Funcion que muestra los envios por codigo de seguimiento

    def mostrar_envio(self, tracking_number):
        envio = self.consultar_envio(tracking_number)
        if envio:
            print("*" * 50)
            print(f'Numero de seguimiento...: {envio["tracking_number"]}')
            print(f'Remitente...............: {envio["sender"]}')
            print(f'Destinatario............: {envio["receiver"]}')
            print(f'Origen..................: {envio["origin"]}')
            print(f'Destino.................: {envio["destination"]}')
            print(f'Estado del envio........: {envio["status"]}')
            print(f"Fecha de envio..........: {envio["shipping_date"]}")
            print(f"Fecha de entrega........: {envio["delivery_date"]}")
            print("*" * 50)


#Funcion que enlista los envios

    def listar_envios(self):
        self.cursor.execute("SELECT * FROM envios")
        envios = self.cursor.fetchall()
        return envios
    

#Funcion que elimina un envio 

    def eliminar_envio(self, tracking_number):
        self.cursor.execute(f"DELETE FROM envios WHERE tracking_number = {tracking_number}")
        self.conn.commit()
        return self.cursor.rowcount > 0
    
    
    
    
#-----------------------------------------------
# PROGRAMA
#-----------------------------------------------

#Instancia de la clase Shipment
shipment = Shipment(host="localhost", user="root", password="", database="unionDB")

#Carpeta para Imagenes
ruta_destino = "./static/imagenes/"


#Rutas de la API

@app.route("/envios", methods=["GET"])
def listar_envios():
    envios = shipment.listar_envios()
    return jsonify(envios)

@app.route("/envios/<int:tracking_number>", methods = ["GET"])
def mostrar_envio(tracking_number):
    envio = shipment.consultar_envio(tracking_number)
    if envio:
        return jsonify(envio)
    else:
        return "Producto no encontrado", 404

@app.route("/envios", methods = ["POST"])
def agregar_envio():
    #Recojo datos del formulario:
    sender = request.form["sender"]
    receiver = request.form["receiver"]
    origin = request.form["origin"]
    destination = request.form["destination"]
    status = request.form["status"]
    shipping_date = request.form["shipping_date"]
    delivery_date = request.form["delivery_date"]
    
    nuevo_codigo = shipment.agregar_envio(sender, receiver, origin, destination, status, shipping_date, delivery_date)
    if nuevo_codigo:
        return jsonify({"mensaje": "Envio agregado correctamente.", "codigo":nuevo_codigo}), 201
    else:
        return jsonify({"mensaje": "Error al agregar envio."}), 500
    
@app.route("/envios/<int:tracking_number>", methods = ["PUT"])
def modificar_envio(tracking_number):
    #Recupero los nuevos datos del formulario:
    new_status = request.form.get("status")
    
    if shipment.modificar_envio(tracking_number, new_status):
        return jsonify({"mensaje": "Producto modificado"}), 200
    else:
        return jsonify({"mensaje": "Producto no encontrado"}), 403

@app.route("/envios/<int:tracking_number>", methods = ["DELETE"])
def eliminar_envio(tracking_number):
    envio = shipment.consultar_envio(tracking_number)
    if shipment.eliminar_envio(tracking_number):
        return jsonify({"mensaje": "Producto eliminado"}), 200
    else:
        return jsonify({"mensaje": "Producto no encontrado"}), 404
        




if __name__ == "__main__":
    app.run(debug=True)
    
    