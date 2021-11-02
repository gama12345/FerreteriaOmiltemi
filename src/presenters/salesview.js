import { setNavbar } from "./navbar"
import { setOptionsBar } from "./salesoptionsbar"
import { isSessionStarted } from "../entities/session"
import { backToLogin } from "./navigation"
import '../ui/styles/sales/view.css'
import { getCount, getSales } from "../entities/dbSales"
import { getClientById } from "../entities/dbClients"
import { getProductById } from "../entities/dbProducts"
import { cancellingSale } from "../use-cases/cancellingSale"
import { showError, showMsg } from "./alerts"

//Checks if user is authenticated
if(!isSessionStarted()) backToLogin();
//Importing navbar
setNavbar();
//Importing options bar
setOptionsBar("recordsSales");
//Getting sales
onGettingSales();

//Variables
let currentPage = 1;
let numPages = 1;
let lastVisible = null;
let iconCancelList = document.getElementsByClassName("cancel-icon");

//Events
const arrowGoStart = document.getElementById("arrowGoStart");
arrowGoStart.addEventListener('click', () => onClickPage(1));
const arrowGoPrevious = document.getElementById("arrowGoPrevious");
arrowGoPrevious.addEventListener('click', () =>  onClickPage(currentPage-1));
const arrowGoNext = document.getElementById("arrowGoNext");
arrowGoNext.addEventListener('click', () => onClickPage(currentPage+1));
const arrowGoLast = document.getElementById("arrowGoLast");
arrowGoLast.addEventListener('click', () => onClickPage(numPages));

async function onGettingSales(){
    const records = await getCount();
    const count = records.count;
    numPages = Math.ceil(count/10);
    populateTable("today");
    updateHeaderTitle();
    updateArrows();
}

async function populateTable(){
    let today = new Date();
    const list = await getSales(lastVisible);
    lastVisible = list[list.length-1];
    const table = document.getElementById("salesTable");
    clearTable(table);
    for(let i=0; i<list.length; i++){
        let clientName = list[i].data().client;
        let client = await getClientById(list[i].data().client);
        if(client) clientName = client.name+" "+client.last_name;        
        const arrayProducts  = Object.entries(list[i].data().products)
        let listedProducts = "";
        for(const product of arrayProducts) {
            const productRes = await getProductById(product[0]);
            listedProducts += `${product[1].quantity} ${productRes.short_name}<br>`
        }
        let cancelOption = '';
        const d = today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear()
        if(list[i].data().date == d){
            cancelOption = `<img class="cancel-icon" id="${list[i].id}"/>`;
        }
        table.innerHTML += 
        `<tr class="row">
            <td class="icon-cell" title="Cancelar venta" >${cancelOption}</td>
            <td >${list[i].data().sale_number}</td>
            <td>${list[i].data().date}</td>
            <td>${clientName}</td>
            <td>${listedProducts}</td>
        </tr>`; 
    }
    addEventIcons();
}

function updateHeaderTitle(){ 
    document.getElementById("headerTitle").innerHTML = `Pág. ${currentPage} de ${numPages}`;
    document.getElementById("currentPage").innerHTML = currentPage;
}

function updateArrows(){
    let arrowDisplay = ['visible','visible','visible','visible'];
    if(numPages == 1){
        arrowDisplay = ['hidden', 'hidden', 'hidden', 'hidden'];
    }else if(currentPage == numPages)  arrowDisplay = ['visible', 'visible', 'hidden', 'hidden'];
    else if(currentPage == 1) arrowDisplay = ['hidden', 'hidden', 'visible', 'visible'];
    arrowGoStart.style.visibility = arrowDisplay[0];
    arrowGoPrevious.style.visibility = arrowDisplay[1];
    arrowGoNext.style.visibility = arrowDisplay[2];
    arrowGoLast.style.visibility = arrowDisplay[3];
} 

const onClickPage = val => {
    currentPage = val;
    if(currentPage == 1) lastVisible = null;
    populateTable();
    updateHeaderTitle();
    updateArrows();
}

function addEventIcons(){
    for(let i=0; i<iconCancelList.length; i++){
        iconCancelList.item(i).addEventListener('click', () => onCancellingSale(iconCancelList[i]));
    }
}

function clearTable(table){
    table.innerHTML = 
    `<tr>
        <th colspan="2">Folio</th>
        <th >Fecha</th>
        <th >Cliente</th>
        <th >Productos</th>
    </tr>`;
}

async function onCancellingSale(element){
    const saleId = element.id;
    let res = await cancellingSale(saleId);
    if(res.result){
        showMsg("Registro cancelado", "Se ha cancelado el registro de venta correctamente", '../sales/view.html')
    }else if(res.msg) showError("Error en cancelación", res.msg)
}
