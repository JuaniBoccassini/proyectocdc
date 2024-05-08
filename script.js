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

/*Slider Logos*/
const scrollers = document.querySelectorAll(".scroller")

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addAnimation();
}

function addAnimation(){
    scrollers.forEach(scroller => {
        scroller.setAttribute("data-animated", true);
    });
}
/*Slider Logos*/

// const list = document.querySelectorAll(".nav-list li");
// const nav = document.querySelector(".navigation");

// list.forEach((item) => {
//   item.addEventListener("click", function (e) {
//     list.forEach((li) => li.classList.remove("active"));
//     e.currentTarget.classList.add("active");
//   });
// });