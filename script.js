// Mostrar Menu Responsivo
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
// Mostrar Menu Responsivo

// Mostrar elementos al scrollear
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
// Mostrar elementos al scrollear

// Desplegar FAQ
const faqs = document.querySelectorAll(".faq")

faqs.forEach(faq => {
    faq.addEventListener("click", () => {
        faq.classList.toggle("active")
    })
})
// Desplegar FAQ

// Validacion formulario tarifas
let sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const validateOrg = document.getElementById("validateOrg").value;
    const validateDest = document.getElementById("validateDest").value;
    const payment1 = document.getElementById("payment1").checked;
    const payment2 = document.getElementById("payment2").checked;
    const payMethod = document.getElementById("payMethod").value;

    if (validateOrg === "" || validateDest === "" || payMethod === "" || (!payment1 && !payment2)) {
        Swal.fire({
            icon: 'error',
            html: `
            <h2 class="tituloSweet">¡Hubo un error!</h2>
            <br>
            <p class="pFormulario">Debes completar todos los campos</p>`,
            color: '#1b0366',
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: {
                popup: 'tamañoAlertSweet',
            }
        });
    }
});
// Validacion formulario tarifas

async function calcularCosto() {
    // Obtener valores del formulario
    const origen = document.getElementsByName('origen')[0].value;
    const destino = document.getElementsByName('destino')[0].value;
    const peso = parseFloat(document.getElementsByName('kg')[0].value);
    const cantPaquetes = parseInt(document.getElementsByName('cantidadpaquetes')[0].value);

    // Valores fijos
    const precioCombustible = 1000.00; // Precio promedio de combustible en pesos argentinos

    // Geocodificación para obtener coordenadas usando Nominatim
    const coordsOrigen = await obtenerCoordenadas(origen);
    const coordsDestino = await obtenerCoordenadas(destino);

    if (!coordsOrigen || !coordsDestino) {
        document.getElementById('resultado').innerText = 'Error al obtener coordenadas';
        return;
    };

    // Calcular la distancia usando OSRM
    const distancia = await calcularDistancia(coordsOrigen, coordsDestino);

    // Calcular costos
    const costoCombustible = distancia * precioCombustible * 0.1; // Ejemplo: 0.1 litros por km 
    const costoPeajes = 1000; // Suponiendo que tienes una función para esto
    const costoTotal = (peso * cantPaquetes) + costoCombustible + costoPeajes;

    // Mostrar el resultado
    Swal.fire({
        icon: 'success',
        html: `
            <h2 class="tituloSweet">¡Completado!</h2>
            <br>
            <p>El costo estimado de envío es: ${costoTotal.toFixed(2)} pesos</p>`,
        color: '#1b0366',
        showConfirmButton: true,
        customClass: {
            popup: 'tamañoAlertSweet',
        }
    });
};

async function obtenerCoordenadas(direccion) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`);
    const data = await response.json();
    if (data.length > 0) {
        return { lat: data[0].lat, lon: data[0].lon };
    } else {
        return null;
    };
};

async function calcularDistancia(origen, destino) {
    const response = await fetch(`http://router.project-osrm.org/route/v1/driving/${origen.lon},${origen.lat};${destino.lon},${destino.lat}?overview=false`);
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
        return data.routes[0].distance / 1000; // Convertir a km
    } else {
        return null;
    };
};

function calcularPeajes(distancia) {
    const costoPorPeaje = 1000; // Ejemplo: 100 pesos por peaje
    const numPeajes = Math.ceil(distancia / 50); // Ejemplo: un peaje cada 150 km
    return numPeajes * costoPorPeaje;
};