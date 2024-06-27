# import random
# import csv

# # Lista de localidades de ejemplo
# localidades = [
#     "Buenos Aires",
#     "Córdoba",
#     "Rosario",
#     "Mendoza",
#     "La Plata",
#     "Mar del Plata",
#     "San Miguel de Tucumán",
#     "Salta",
#     "Santa Fe",
#     "San Juan",
#     "Santa Cruz",
#     "Tierra del Fuego",
#     "Neuquen",
#     "Rio Negro",
#     "Chubut"
# ]

# # Función para generar direcciones aleatorias
# def generar_direccion():
#     numero = random.randint(100, 999)
#     calle = random.choice(["Calle", "Avenida", "Pasaje", "Boulevard"])
#     nombre = random.choice(["San Martín", "Belgrano", "Rivadavia", "Independencia"])
#     return f"{calle} {nombre} {numero}"

# # Generar 100 filas de datos
# datos = []
# for _ in range(100):
#     localidad = random.choice(localidades)
#     nombre = f"Union {localidad}"
#     direccion = generar_direccion()
#     datos.append([nombre, direccion])

# # Escribir los datos en un archivo CSV
# with open('direcciones_argentinas.csv', 'w', newline='', encoding='utf-8') as file:
#     writer = csv.writer(file)
#     writer.writerow(["Name", "Address"])  # Encabezados de las columnas
#     writer.writerows(datos)

clientes = []

def agregar_pedido()