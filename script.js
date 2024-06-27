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
    } else {
        Swal.fire({
            icon: 'success',
            html: `
            <h2 class="tituloSweet">¡Completado!</h2>
            <br>
            <p class="pFormulario">Gracias por contactarse con nosotros, en breve le responderemos</p>`,
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