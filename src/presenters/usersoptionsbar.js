import '../ui/styles/users/optionsbar.css'
import { showError } from './alerts';

const setOptionsBar = (page = "recordsUsers") => {
    const barLocation = './optionsbar.html';
    fetch(barLocation)
    .then(res => res.text())
    .then(text => {
        let newelem = document.getElementById("optionsBar");
        newelem.innerHTML = text;
        const activePage = document.getElementById(page);
        activePage ? activePage.classList.add("active") : 
                        showError("Error opción no existe", `La opción ${page} no es una opción válida.`);
        addOptionsBarEvents();
    })
}

function addOptionsBarEvents(){
    const btnRecords = document.getElementById("recordsUsers");
    btnRecords.addEventListener('click', () => location.href = "../users/view.html" );
    const btnRegisterNew = document.getElementById("registerUsers");
    btnRegisterNew.addEventListener('click', () => location.href = "../users/registernew.html" );
}

export { setOptionsBar }