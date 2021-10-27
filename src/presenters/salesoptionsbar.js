import '../ui/styles/sales/optionsbar.css'
import { showError } from './alerts';

const setOptionsBar = (page = "registerSale") => {
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
    const btnRecords = document.getElementById("registerSale");
    btnRecords.addEventListener('click', () => location.href = "../sales/registernew.html" );
    const btnRegisterNew = document.getElementById("recordsSales");
    btnRegisterNew.addEventListener('click', () => location.href = "../sales/view.html" );
}

export { setOptionsBar }