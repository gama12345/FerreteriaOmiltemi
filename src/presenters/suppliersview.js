import { setNavbar } from "./navbar"
import { setOptionsBar } from "./suppliersoptionsbar"
import '../ui/styles/suppliers/view.css'
import '../ui/styles/autocomplete.css'
import { isSessionStarted } from "../entities/session"
import { backToLogin } from "./navigation"
import { showConfirm, showError, showMsg } from "./alerts"
import { autocomplete } from "./autocomplete"
import { deleteSupplier, getAllNamesSuppliers, getSupplierById, updateSupplier } from "../entities/dbSuppliers"
import { validateDataSupplier } from "./dataValidation"


//Checks if user is authenticated
if(!isSessionStarted()) backToLogin();
//Importing navbar
setNavbar();
//Importing options bar
setOptionsBar();
//Getting users data
setAutocomplete();

//Constants
const inputNameCompany = document.getElementById("nameCompanySupplier"); 
const inputEmailCompany = document.getElementById("emailCompanySupplier"); 
const inputPhoneCompany = document.getElementById("phoneCompanySupplier"); 
const inputNameContact = document.getElementById("nameContactSupplier"); 
const inputEmailContact = document.getElementById("emailContactSupplier"); 
const inputPhoneContact = document.getElementById("phoneContactSupplier"); 
const inputAddress = document.getElementById("addressCompanySupplier"); 
const inputRegDate = document.getElementById("registrationDateSupplier"); 
const inputLastPurchaseDate = document.getElementById("lastPurchaseDateSupplier"); 

//Variables
let selectedSupplierId = null;

//Events
const formButtons = document.getElementById("formButtons");

const btnEdit = document.getElementById("btnEditSupplier");
btnEdit.addEventListener('click', () => {
    selectedSupplierId ? showFormButtons() : showError("Proveedor indefinido",
                                        "Para editar un registro, primero seleccione un proveedor de la búsqueda.");
});

const btnSave = document.getElementById("btnSaveSupplier");
btnSave.addEventListener('click', onSaveSupplier);
const btnCancel = document.getElementById("btnCancelEditSupplier");
btnCancel.addEventListener('click', () => showEditButton());
/*const btnDelete = document.getElementById("btnDeleteSupplier");
btnDelete.addEventListener('click', onDeleteSupplier);*/

function showFormButtons(){
    btnEdit.style.display = 'none';
    formButtons.style.display = 'flex';
    setFieldsStatus(true);
}

function showEditButton(){
    btnEdit.style.display = 'block';
    formButtons.style.display = 'none';
    setFieldsStatus(false);
}

async function setAutocomplete(){
    const searchInput = document.getElementById("searchSupplier");
    const suppliersList = await getAllNamesSuppliers();
    autocomplete(searchInput, suppliersList, setSupplierData);
}

const setSupplierData = async (id = null) => {
    if(id){
        const supplierData = await getSupplierById(id);
        inputNameCompany.value = supplierData.name_company;
        inputEmailCompany.value = supplierData.email_company;
        inputPhoneCompany.value = supplierData.phone_company;
        inputNameContact.value = supplierData.name_contact;
        inputEmailContact.value = supplierData.email_contact;
        inputPhoneContact.value = supplierData.phone_contact;
        inputAddress.value = supplierData.address;
        inputRegDate.value = supplierData.registration_date;
        inputLastPurchaseDate.value = supplierData.last_purchase_date;
        selectedSupplierId = id;
    }
}

const setFieldsStatus = (status) =>{
    const fields = document.getElementsByClassName("form-field");    
    for(let i=0; i<fields.length; i++){ status ? fields[i].removeAttribute("disabled") : 
                                                    fields[i].setAttribute("disabled", true) }
}

const cleanFields = () => {
    inputNameCompany.value = "";
    inputEmailCompany.value = "";
    inputPhoneCompany.value = "";
    inputNameContact.value = "";
    inputEmailContact.value = "";
    inputPhoneContact.value = "";
    inputAddress.value = "";
    inputRegDate.value = "";
    inputLastPurchaseDate.value = "";
}

async function onSaveSupplier(){    
    let res = validateDataSupplier(inputNameCompany.value, inputEmailCompany.value, inputPhoneCompany.value,
                    inputNameContact.value, inputEmailContact.value, inputPhoneContact.value, inputAddress.value);
    if(res.result){
        res = await updateSupplier(selectedSupplierId, inputNameCompany.value, inputEmailCompany.value, 
                inputPhoneCompany.value, inputNameContact.value, inputEmailContact.value, inputPhoneContact.value,
                inputAddress.value);
        showMsg("Proveedor actualizado", "Se han guardado los cambios correctamente.", "../suppliers/view.html");
        cleanFields();
        setFieldsStatus(false);
        selectedSupplierId = null;
    }
    else showError("Error al actualizar proveedor", res.msg);
}

async function onDeleteSupplier(){
    const res = await showConfirm("Eliminar proveedor", "¿Está seguro de que quiere eliminar "
                        +"este proveedor? Sus datos no podrán ser recuperados.", "Eliminar");
    if(res){
        await deleteSupplier(selectedSupplierId);
        showMsg("Proveedor eliminado", "Se ha eliminado el proveedor correctamente.", "../suppliers/view.html");
        cleanFields();
        selectedSupplierId = null;
    }
}