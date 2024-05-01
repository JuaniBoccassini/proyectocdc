/*Mostrar Menu Responsivo*/ 
function showSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'flex'
}
function hideSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'none'
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


const list = document.querySelectorAll(".nav-list li");
const nav = document.querySelector(".navigation");

list.forEach((item) => {
  item.addEventListener("click", function (e) {
    list.forEach((li) => li.classList.remove("active"));
    e.currentTarget.classList.add("active");
  });
});