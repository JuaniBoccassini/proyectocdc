// *************************************************Mostrar menu responsivo************************************************* \\
const toggleBtn = document.querySelector(".toggle-btn")
const toggleBtnIcon = document.querySelector(".toggle-btn i")
const responsiveMenu = document.querySelector(".responsive-menu")

toggleBtn.onclick = function(){
  responsiveMenu.classList.toggle("open")
  const isOpen = responsiveMenu.classList.contains("open")

  toggleBtnIcon.classList = isOpen
  ? "fa-solid fa-xmark"
  : "fa-solid fa-bars"
}
// *************************************************Mostrar menu responsivo************************************************* \\


// *************************************************Mostrar elementos al scrollear************************************************* \\
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.add('show')
        } else {
            entry.target.classList.remove('show')
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));
// *************************************************Mostrar elementos al scrollear************************************************* \\


// *************************************************Desplegar FAQ************************************************* \\
const faqs = document.querySelectorAll(".faq")

faqs.forEach(faq => {
    faq.addEventListener("click", () => {
        faq.classList.toggle("active")
    })
})
// *************************************************Desplegar FAQ************************************************* \\


// *************************************************Formulario Envios************************************************* \\
async function calcularEnvio(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const origen = document.querySelector('input[name="origen"]').value;
    const destino = document.querySelector('input[name="destino"]').value;
    const codigoPostalOrigen = document.querySelector('input[name="cpOrigen"]').value;
    const codigoPostalDestino = document.querySelector('input[name="cpDestino"]').value;
    const cantPaquetes = parseInt(document.querySelector('input[name="cantPaquetes"]').value);
    const peso = parseFloat(document.querySelector('input[name="peso"]').value);
    const pago = document.querySelector('input[name="pago"]:checked').value;
    const metodoDePago = document.querySelector('select[name="metodoDePago"]').value;

    if (!origen || !destino || !codigoPostalOrigen || !codigoPostalDestino || !cantPaquetes || !peso || !pago || !metodoDePago) {
        Swal.fire({
          icon: 'error',
          html: `<h2 class="tituloSweet">¡Error!</h2><br><p class="pFormulario">Todos los campos son obligatorios</p>`,
          color: '#1b0366',
          timer: 5000,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: { popup: 'tamañoAlertSweet' }
        });
        return;
    }

    if (codigoPostalOrigen.length > 5 || codigoPostalDestino.length > 5) {
        Swal.fire({
          icon: 'error',
          html: `<h2 class="tituloSweet">¡Error!</h2><br><p class="pFormulario">El código postal debe tener máximo 5 caracteres</p>`,
          color: '#1b0366',
          timer: 5000,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: { popup: 'tamañoAlertSweet' }
        });
        return;
    }

    // Valores fijos
    const precioCombustible = 1000.00; // Precio promedio de combustible en pesos argentinos

    try {
        // Geocodificación para obtener coordenadas usando Nominatim
        const coordsOrigen = await obtenerCoordenadas(origen);
        const coordsDestino = await obtenerCoordenadas(destino);

        if (!coordsOrigen ||!coordsDestino) {
        Swal.fire({
            icon: 'error',
            html: `<h2 class="tituloSweet">¡Error!</h2><br><p class="pFormulario">Error al obtener coordenadas</p>`,
            color: '#1b0366',
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: { popup: 'tamañoAlertSweet' }
        });
        return;
        }

        // Calcular la distancia usando OSRM
        const distancia = await calcularDistancia(coordsOrigen, coordsDestino);
        if (distancia === null) {
        Swal.fire({
            icon: 'error',
            html: `<h2 class="tituloSweet">¡Error!</h2><br><p class="pFormulario">Error al calcular la distancia</p>`,
            color: '#1b0366',
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: { popup: 'tamañoAlertSweet' }
        });
        return;
        }

        // Calcular costos
        const costoCombustible = distancia * precioCombustible * 0.1; // Ejemplo: 0.1 litros por km
        const costoPeajes = calcularPeajes(distancia);
        const costoTotal = (peso * cantPaquetes) + costoCombustible + costoPeajes;

        // Generar código único de envío aleatorio
        const codigoEnvio = generarCodigoEnvio();

        // Mostrar el resultado
        Swal.fire({
        icon: 'success',
        html: `<h2 class="tituloSweet">¡Completado!</h2>
        <br>
        <p>El costo de envío es:<br> ${costoTotal.toFixed(2)} pesos
        <br>
        <br>Código de envío: ${codigoEnvio}</p>`,
        color: '#1b0366',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        customClass: { popup: 'tamañoAlertSweet' }
        });
    } catch (error) {
        Swal.fire({
        icon: 'error',
        html: `<h2 class="tituloSweet">¡Error!</h2>
        <br>
        <p class="pFormulario">Ocurrió un error al calcular el costo</p>`,
        color: '#1b0366',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: { popup: 'tamañoAlertSweet' }
        });
        console.error('Error:', error);
    }
}

function generarCodigoEnvio() {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numeros = "0123456789";
      
    let codigoEnvio = "";
      
    // Generar 3 letras aleatorias
    for (let i = 0; i < 3; i++) {
        codigoEnvio += letras.charAt(Math.floor(Math.random() * letras.length));
    }
      
    // Generar 3 números aleatorios
    for (let i = 0; i < 3; i++) {
        codigoEnvio += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
      
    return codigoEnvio;
} 
// *************************************************Formulario Envios************************************************* \\


// *************************************************Formulario Cotizacion************************************************* \\
async function calcularTarifa(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const origen = document.getElementById('validateOrg').value;
    const destino = document.getElementById('validateDest').value;
    const peso = parseFloat(document.getElementById('peso').value);
    const cantPaquetes = parseInt(document.getElementById('cantPaquetes').value);
    
    // Valores fijos
    const precioCombustible = 1000.00; // Precio promedio de combustible en pesos argentinos

    try {
        // Geocodificación para obtener coordenadas usando Nominatim
        const coordsOrigen = await obtenerCoordenadas(origen);
        const coordsDestino = await obtenerCoordenadas(destino);

        if (!coordsOrigen || !coordsDestino) {
            Swal.fire({
                icon: 'error',
                html: `<h2 class="tituloSweet">¡Error!</h2><br><p class="pFormulario">Error al obtener coordenadas</p>`,
                color: '#1b0366',
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                customClass: { popup: 'tamañoAlertSweet' }
            });
            return;
        }

        // Calcular la distancia usando OSRM
        const distancia = await calcularDistancia(coordsOrigen, coordsDestino);
        if (distancia === null) {
            Swal.fire({
                icon: 'error',
                html: `<h2 class="tituloSweet">¡Error!</h2><br><p class="pFormulario">Error al calcular la distancia</p>`,
                color: '#1b0366',
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                customClass: { popup: 'tamañoAlertSweet' }
            });
            return;
        }

        // Calcular costos
        const costoCombustible = distancia * precioCombustible * 0.1; // Ejemplo: 0.1 litros por km 
        const costoPeajes = calcularPeajes(distancia);
        const costoTotal = (peso * cantPaquetes) + costoCombustible + costoPeajes;

        // Mostrar el resultado
        Swal.fire({
            icon: 'success',
            html: `<h2 class="tituloSweet">¡Completado!</h2><br><p>El costo estimado de envío es:<br> ${costoTotal.toFixed(2)} pesos</p>`,
            color: '#1b0366',
            showConfirmButton: true,
            customClass: { popup: 'tamañoAlertSweet' }
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            html: `<h2 class="tituloSweet">¡Error!</h2><br><p class="pFormulario">Ocurrió un error al calcular el costo</p>`,
            color: '#1b0366',
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: { popup: 'tamañoAlertSweet' }
        });
        console.error('Error:', error);
    }
}

async function obtenerCoordenadas(direccion) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}&countrycodes=AR&limit=1`);
        const data = await response.json();
        if (data.length > 0) {
            return { lat: data[0].lat, lon: data[0].lon };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al obtener coordenadas:', error);
        return null;
    }
}

async function calcularDistancia(origen, destino) {
    try {
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${origen.lon},${origen.lat};${destino.lon},${destino.lat}?overview=false`);
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
            return data.routes[0].distance / 1000; // Convertir a km
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al calcular la distancia:', error);
        return null;
    }
}

function calcularPeajes(distancia) {
    const costoPorPeaje = 1000; // Ejemplo: 1000 pesos por peaje
    const numPeajes = Math.ceil(distancia / 150); // Ejemplo: un peaje cada 150 km
    return numPeajes * costoPorPeaje;
}
// *************************************************Formulario Cotizacion************************************************* \\