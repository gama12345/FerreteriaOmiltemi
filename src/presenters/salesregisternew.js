import { setNavbar } from "./navbar"
import { setOptionsBar } from "./salesoptionsbar"
import { isSessionStarted } from "../entities/session"
import { backToLogin } from "./navigation"
import { autocomplete } from "./autocomplete"
import '../ui/styles/sales/registernew.css'
import '../ui/styles/autocomplete.css'
import { getAllNamesProducts, getProductById } from "../entities/dbProducts"
import { showInput, showError, showMsg } from "./alerts"
import { getAllNamesClients } from "../entities/dbClients"
import { registeringSale } from "../use-cases/registrationSale"
import { getDiscount } from "../entities/dbDiscounts"
import jsPDF from "jspdf"
import { logoImgURI } from "./logoImageURI"

//Checks if user is authenticated
if(!isSessionStarted()) backToLogin();
//Importing navbar
setNavbar();
//Importing options bar
setOptionsBar();
//Getting products data
let selectedClient = null;
let searchInput, searchClient;
let total = 0.00;
let discount = 0.00;
setAutocomplete();

//Constants
const table = document.getElementById("productsTable");
const elementDiscount = document.getElementById("discount");
const elementTotal = document.getElementById("total");
const notRegisteredClient = document.getElementById("notRegisteredClient");
notRegisteredClient.addEventListener('change', () => onCheckingClient(notRegisteredClient.checked));
const btnRegister = document.getElementById("btnRegisterSale");
btnRegister.addEventListener('click', () => onRegisterSale());
const addedProducts = [];
let iconRemoveList;

function onCheckingClient(checked){
    if(checked){
        selectedClient = null;
        searchClient.value = "";
        searchClient.setAttribute('disabled', true);
    }else searchClient.removeAttribute('disabled')
}

async function setAutocomplete(){
    searchInput = document.getElementById("searchProduct");
    const productsList = await getAllNamesProducts();
    autocomplete(searchInput, productsList, id => onAddingProduct(id));

    searchClient = document.getElementById("inputClient");
    const clientsList = await getAllNamesClients();
    autocomplete(searchClient, clientsList, id => selectedClient = id);
}

const onAddingProduct = async (productId) => {
    if(!productListed(productId)){
        const product = await getProductById(productId);
        const res = await showInput("Agregar producto", `Ingrese la cantidad de unidades a agregar. 
                                    Producto: ${product.name}.
                                    Unidad: ${product.sales_unit}`, product.stock);
        if(res.isConfirmed){
            const subtotal = (parseInt(res.value) * parseFloat(product.price));
            searchInput.value = "";
            table.innerHTML += 
            `<tr class="row">
                <td class="icon-cell" title="Remover"><img id="${productId}" class="remove-icon" data-html2canvas-ignore/></td>
                <td>${product.name}</td>
                <td class="sales-unit">${product.sales_unit}</td>
                <td>${res.value}</td>
                <td>${product.price}</td>
                <td>${subtotal}</td>
            </tr>`;
            const response = await getDiscount(product.discount);
            let calculated = 0.00;
            if(response) calculated = calculateDiscount(response, res.value, product.price);
            const newProduct = {id: productId, price: product.price, quantity: res.value, name: product.name,
                                discountId: product.discount, discount: calculated};
            addProductData(newProduct);
            iconRemoveList = document.getElementsByClassName("remove-icon");
            addEventIcons();
        }
    }else showError("Producto en lista", "Ya se ha agregado este producto a la venta.");
}

function calculateDiscount(discount, units, price){
    if(units >= discount.min_unit){
        const applyTimes = Math.floor(units/discount.min_unit);
        const discountValue = (discount.percentage*0.01)*price;
        return Math.ceil(applyTimes*discount.min_unit*discountValue);
    }else showMsg("Descuento", `Producto con descuento: ${discount.description}`)
    return 0.00;
}

function addProductData(newProduct){
    addedProducts.push(newProduct);
    discount += newProduct.discount;
    const subtotal = (parseInt(newProduct.quantity) * parseFloat(newProduct.price));
    total += parseFloat(subtotal) - newProduct.discount;
    elementDiscount.innerHTML = `$ ${discount.toFixed(2)}`;
    elementTotal.innerHTML = `$ ${total.toFixed(2)}`;
}

function addEventIcons(){
    for(let i=0; i<iconRemoveList.length; i++){
        const product = getProductFromList(iconRemoveList[i].id);
        iconRemoveList.item(i).addEventListener('click', () => onRemovingProduct(iconRemoveList[i], product));
    }
}

function onRemovingProduct(element, product){
    if(element){
        const row = element.parentNode.parentNode;
        row.parentNode.removeChild(row);
        for(let i=0; i<addedProducts.length; i++){ 
            if(addedProducts[i].id == product.id){
                addedProducts.splice(i, 1);
                break;
            }
        }
        const subtotal = (parseInt(product.quantity) * parseFloat(product.price));
        discount -= product.discount;
        total -= (parseFloat(subtotal) - product.discount);
        elementDiscount.innerHTML = `$ ${discount.toFixed(2)}`;
        elementTotal.innerHTML = `$ ${total.toFixed(2)}`;
        iconRemoveList = document.getElementsByClassName("remove-icon");
        addEventIcons();
    }
}

function productListed(id){
    for(let i=0; i<addedProducts.length; i++){ 
        if(addedProducts[i].id == id) return true;
    }
    return false;
}

function getProductFromList(id){
    for(let i=0; i<addedProducts.length; i++){ 
        if(addedProducts[i].id == id) return addedProducts[i];
    }
}

async function onRegisterSale(){
    const res = await registeringSale(selectedClient, notRegisteredClient, addedProducts, total, discount);
    if(res.result){
        await generatePdf(res.saleNum, res.client, res.date);
        showMsg("Venta registrada", "Se ha registrado correctamente la venta", '../sales/registernew.html');

    }else if(res.msg) showError(res.err, res.msg);
}

async function generatePdf(folio, cliente, fecha){
    var doc = new jsPDF('p', 'mm', [150, 100])
    //Logo
    doc.addImage(logoImgURI, 'JPEG', 5, 10, 28, 10)
    //Title
    doc.setFontSize(12)
    doc.text('Ferretería Omiltemi', 65, 13, 'center')
    //Address
    doc.setFontSize(8)
    doc.text(65, 17, 'Amelitos II, #23, 39059', 'center')
    doc.text(65, 20, 'Chilpancingo de los Bravo, Gro.', 'center')
    //Info
    doc.text(`Fecha: ${fecha}`, 10, 28)
    doc.text(`Folio: ${folio}`, 10, 32)
    doc.text(`Cliente: ${cliente}`, 10, 36)

    //Products
    doc.html(document.getElementById("ticketElements"), {callback: function(doc){ doc.save('ticket.pdf') }, x: 5, y: 44, width: 90, windowWidth: 500, html2canvas: {allowTaint: true}})    
}