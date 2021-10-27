import { setNavbar } from "./navbar"
import '../ui/styles/users/account.css'
import { isSessionStarted } from "../entities/session"
import { backToLogin } from "./navigation"
import { getUserById } from "../entities/dbUsers"
import { updatingAccount } from "../use-cases/updateAccount"
import { showError, showMsg } from "./alerts"
import { Buffer } from 'buffer'

//Constants
const userId = localStorage.getItem("userId");

//Checks if user is authenticated
if(!isSessionStarted()) backToLogin();
//Importing navbar
setNavbar();
//Getting user's data
getAccountData();

//Constants
const inputName = document.getElementById("name"); 
const inputLastName = document.getElementById("lastName"); 
const selectRole = document.getElementById("role"); 
const inputEmail = document.getElementById("email"); 
const inputPhone = document.getElementById("phone"); 
const inputPassword = document.getElementById("password"); 
const inputRegDate = document.getElementById("registrationDate"); 
const selectStatus = document.getElementById("status");

//Events
const formButtons = document.getElementById("formButtons");
const btnEdit = document.getElementById("btnEditAccount");
btnEdit.addEventListener('click', () => { showFormButtons() });
const btnSave = document.getElementById("btnSaveAccount");
btnSave.addEventListener('click', verifyAccountData);
const btnCancel = document.getElementById("btnCancelEditAccount");
btnCancel.addEventListener('click', () => showEditButton());


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

const setFieldsStatus = (status) =>{
    const fields = document.getElementsByClassName("form-field");    
    const userRole = localStorage.getItem("userRole");
    for(let i=0; i<fields.length; i++){ 
        status && ((fields[i].tagName != 'SELECT') || (userRole == 'owner'))
                    ? fields[i].removeAttribute("disabled") :  fields[i].setAttribute("disabled", true); 
    }
}

async function getAccountData() {
    const user = await getUserById(userId);
    const pass = Buffer.from(user.password, "base64"); 
    inputName.value = user.name;
    inputLastName.value = user.last_name;
    inputEmail.value = user.email;
    inputPassword.value = pass;
    inputPhone.value = user.phone;
    inputRegDate.value = user.registration_date;
    selectRole.value = user.role;
    selectStatus.value = user.status;
}

async function verifyAccountData(){
    let res = await updatingAccount(userId, inputName.value, inputLastName.value, selectRole.value,
                inputEmail.value, inputPhone.value, selectStatus.value, inputPassword.value);
    if(res.result){
        showMsg("Datos actualizados", "Sus datos se han actualizado correctamente.", "../users/account.html");
    }
    else showError("Error al actualizar cuenta", res.msg);
}