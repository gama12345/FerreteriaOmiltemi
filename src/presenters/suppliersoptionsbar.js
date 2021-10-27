import '../ui/styles/suppliers/optionsbar.css'
import { showError } from './alerts';

const setOptionsBar = (page = "recordsSuppliers") => {
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
    const btnRecords = document.getElementById("recordsSuppliers");
    btnRecords.addEventListener('click', () => location.href = "../suppliers/view.html" );
    const btnRegisterNew = document.getElementById("registerSuppliers");
    btnRegisterNew.addEventListener('click', () => location.href = "../suppliers/registernew.html" );
}

export { setOptionsBar }