/*Mostrar Menu Responsivo*/ 
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
/*Mostrar Menu Responsivo*/

/*Mostrar elementos al scrollear*/
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
/*Mostrar elementos al scrollear*/

/*Desplegar FAQ*/
const faqs = document.querySelectorAll(".faq")

faqs.forEach(faq => {
    faq.addEventListener("click", () => {
        faq.classList.toggle("active")
    })
})
/*Desplegar FAQ*/

/*Validacion formulario tarifas*/
let btnEnviarForm = document.querySelector("#btnEnviarForm")
btnEnviarForm.addEventListener("click", (event) => {
    event.preventDefault();
    let origen = document.querySelector("#origen").value 
    let cporigen = document.querySelector("#cporigen").value
    let destino = document.querySelector("#destino").value
    let cpdestino = document.querySelector("#cpdestino").value
    let cantbultos = document.querySelector("#cantbultos").value
    let kg = document.querySelector("#kg").value
    // Verificar radio buttons
    let pago1 = document.querySelector("#pago1").checked;
    let pago2 = document.querySelector("#pago2").checked;
    /* select */
    let metodoDePago = document.querySelector("#metodoDePago").value;

    if(origen == "" || cporigen == "" || destino == "" || cpdestino == "" || cantbultos == "" || kg == "" || (!pago1 && !pago2) || metodoDePago === ""){
        Swal.fire({
            icon: 'error',
            html: `
            <h2 class= "tituloSweet">¡Hubo un error!</h2>
            <br>
            <p class= "pFormulario">Debes completar todos los campos</p>`,
            color: '#1b0366',
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton:false,
            customClass: {
                popup: 'tamañoAlertSweet',
            }
        })
    } else{
        Swal.fire({
            icon: 'success',
            html: `
            <h2 class= "tituloSweet">¡Completado!</h2>
            <br>
            <p class= "pFormulario">Gracias por contactarse cn nosotros en breve le responderemos</p>`,
            color: '#1b0366',
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton:false,
            customClass: {
                popup: 'tamañoAlertSweet',
            }
        })
    }
})
/*Validacion formulario tarifas*/