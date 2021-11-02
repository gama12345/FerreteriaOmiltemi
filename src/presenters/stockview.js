import { setNavbar } from "./navbar"
import { setOptionsBar } from "./stockoptionsbar"
import '../ui/styles/stock/view.css'
import { isSessionStarted } from "../entities/session"
import { backToLogin } from "./navigation"
import { getProductCount, getProducts, deleteProduct } from "../entities/dbProducts"
import { showInput, showMsg, showConfirm } from "./alerts"
import { updatingProductStock } from "../use-cases/updateProductStock"


//Checks if user is authenticated
if(!isSessionStarted()) backToLogin();
//Importing navbar
setNavbar();
//Importing options bar
setOptionsBar();
//Getting products records
onGettingProducts();

//Events
const elements = document.getElementsByClassName("edit-icon");
const onEditing = function() {
    var attribute = this.getAttribute("id");
    alert(attribute);
};
for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', onEditing, false);
}

//Variables
const arrowGoStart = document.getElementById("arrowGoStart");
arrowGoStart.addEventListener('click', () => onClickPage(1));
const arrowGoPrevious = document.getElementById("arrowGoPrevious");
arrowGoPrevious.addEventListener('click', () =>  onClickPage(currentPage-1));
const arrowGoNext = document.getElementById("arrowGoNext");
arrowGoNext.addEventListener('click', () => onClickPage(currentPage+1));
const arrowGoLast = document.getElementById("arrowGoLast");
arrowGoLast.addEventListener('click', () => onClickPage(numPages));
const selectFilter = document.getElementById("filter");
selectFilter.addEventListener('change', () => onClickPage(1));
let iconAddList = document.getElementsByClassName("add-icon");
let iconEditList = document.getElementsByClassName("edit-icon");
let iconDeleteList = document.getElementsByClassName("delete-icon");
let currentPage = 1;
let numPages = 1;
let lastVisible = null;

async function onGettingProducts(){
    const records = await getProductCount();
    const count = parseInt(records.count);
    numPages = Math.ceil(count/10);
    populateTable();
    updateHeaderTitle();
    updateArrows();
}

async function populateTable(order = undefined, type = undefined){
    const productsList = await getProducts(lastVisible, order, type);
    lastVisible = productsList[productsList.length-1];
    const table = document.getElementById("productsTable");
    clearTable(table);
    productsList.forEach(product => {
        table.innerHTML += 
        `<tr class="row">
            <td>${product.data().name}</td>
            <td class="brand">${product.data().brand}</td>
            <td>$ ${product.data().price}</td>
            <td class="category">${product.data().category}</td>
            <td>${product.data().stock}</td>
            <td class="icon-cell" title="Agregar" ><img class="add-icon" id="${product.id}" 
                    data-name="${product.data().name}" data-salesUnit="${product.data().sales_unit}"
                    data-supplier="${product.data().supplier}"/></td>
            <td class="icon-cell" title="Editar" ><img class="edit-icon" id="${product.id}" 
                    data-name="${product.data().name}" data-salesUnit="${product.data().sales_unit}"
                    data-supplier="${product.data().supplier}"/></td>
            <td class="icon-cell" title="Eliminar" ><img class="delete-icon" id="${product.id}" 
                    data-name="${product.data().name}" data-salesUnit="${product.data().sales_unit}"
                    data-supplier="${product.data().supplier}"/></td>
        </tr>`; 
    });
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
    let order = selectFilter.value;
    let type = undefined;
    if(order == "min_stock"){ type="asc" }
    if(order == "max_stock"){ type="desc" }
    if(order != "name") order = "stock";
    if(currentPage == 1) lastVisible = null;
    populateTable(order,type);
    updateHeaderTitle();
    updateArrows();
}

function clearTable(table){
    table.innerHTML = 
    `<tr>
        <th id="col-name">Nombre</th>
        <th id="col-brand" class="brand">Marca</th>
        <th id="col-supplier">Precio</th>
        <th id="col-category" class="category">Categoria</th>
        <th id="col-stock" colspan="4">Existencias</th>
    </tr>`;
}

function addEventIcons(){
    for(let i=0; i<iconAddList.length; i++){
        iconAddList.item(i).addEventListener('click', () => addToStock(iconAddList[i]));
    }
    for(let i=0; i<iconEditList.length; i++){
        iconEditList.item(i).addEventListener('click', () => location.href = `../stock/editproduct.html?id=${iconEditList[i].id}`);
    }
    for(let i=0; i<iconDeleteList.length; i++){
        iconDeleteList.item(i).addEventListener('click', () => onDeletingProduct(iconDeleteList[i]));
    }
}

const addToStock = async (element) => {
    const name = element.getAttribute("data-name");
    const salesUnit = element.getAttribute("data-salesUnit");
    const res = await showInput("Resurtir producto", `Ingrese el número de existencias a añadir. 
                                Producto: ${name}.
                                Unidad: ${salesUnit}`);
    if(res.isConfirmed){
        const supplier = element.getAttribute("data-supplier");
        await updatingProductStock(element.id, res.value, supplier);
        showMsg("Producto actualizado", "Se han agregado las existencias correctamente.", '../stock/view.html');
    }
}

const onDeletingProduct = async (element) => {
    const productId = element.id;    
    const res = await showConfirm("Eliminar producto", "¿Está seguro de que quiere eliminar "
                        +"este producto? Sus datos no podrán ser recuperados.", "Eliminar");
    if(res){
        await deleteProduct(productId);
        showMsg("Producto eliminado", "Se ha eliminado el producto correctamente.", "../stock/view.html");
    }
}