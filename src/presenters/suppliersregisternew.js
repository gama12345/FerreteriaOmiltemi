import { setNavbar } from "./navbar"
import { setOptionsBar } from "./suppliersoptionsbar"
import { isSessionStarted } from "../entities/session"
import { backToLogin } from "./navigation"
import '../ui/styles/users/registernew.css'
import { registrationUser } from "../use-cases/registrationUser"
import { showError, showMsg } from "./alerts"
import { registrationSupplier } from "../use-cases/registrationSupplier"

//Checks if user is authenticated
if(!isSessionStarted()) backToLogin();
//Importing navbar
setNavbar();
//Importing options bar
setOptionsBar("registerSuppliers");

//Constants
const inputNameCompany = document.getElementById("nameCompany"); 
const inputEmailCompany = document.getElementById("emailCompany"); 
const inputPhoneCompany = document.getElementById("phoneCompany"); 
const inputNameContact = document.getElementById("nameContact"); 
const inputEmailContact = document.getElementById("emailContact"); 
const inputPhoneContact = document.getElementById("phoneContact"); 
const inputAddress = document.getElementById("addressCompany"); 

//Events
const btnRegister = document.getElementById("btnRegisterSupplier");
btnRegister.addEventListener('click', verifyData);

async function verifyData(){    
    let res = await registrationSupplier(inputNameCompany.value, inputEmailCompany.value, inputPhoneCompany.value,
                inputNameContact.value, inputEmailContact.value, inputPhoneContact.value, inputAddress.value);
    if(res.result){
        showMsg("Proveedor registrado", "Se ha registrado al proveedor correctamente.", "../suppliers/registernew.html");
    }
    else showError("Error al registrar proveedor", res.msg);
    
}