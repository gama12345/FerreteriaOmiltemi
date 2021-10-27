import '../ui/styles/stock/optionsbar.css'
import { showError } from './alerts';

const setOptionsBar = (page = "recordsProducts") => {
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
    const btnRecords = document.getElementById("recordsProducts");
    btnRecords.addEventListener('click', () => location.href = "../stock/view.html" );
    const btnRegisterNew = document.getElementById("registerProducts");
    btnRegisterNew.addEventListener('click', () => location.href = "../stock/registerproduct.html" );
}

export { setOptionsBar }