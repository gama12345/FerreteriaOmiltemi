import { setNavbar } from "./navbar"
import { setOptionsBar } from "./usersoptionsbar"
import { isSessionStarted } from "../entities/session"
import { backToLogin } from "./navigation"
import '../ui/styles/users/registernew.css'
import { registrationUser } from "../use-cases/registrationUser"
import { showError, showMsg } from "./alerts"

//Checks if user is authenticated
if(!isSessionStarted()) backToLogin();
//Importing navbar
setNavbar();
//Importing options bar
setOptionsBar("registerUsers");

//Constants
const inputName = document.getElementById("name"); 
const inputLastName = document.getElementById("lastName"); 
const selectRole = document.getElementById("role"); 
const inputEmail = document.getElementById("email"); 
const inputPhone = document.getElementById("phone"); 
const inputPass = document.getElementById("password"); 
const inputConfirmPass = document.getElementById("confirmPassword"); 

//Events
const btnRegister = document.getElementById("btnRegisterUser");
btnRegister.addEventListener('click', verifyData);

async function verifyData(){
    let res = await registrationUser(inputName.value, inputLastName.value, selectRole.value,
                inputEmail.value, inputPhone.value, inputPass.value, inputConfirmPass.value);
    if(res.result){
        showMsg("Usuario registrado", "Se ha registrado al usuario correctamente.", "../users/registernew.html");
    }
    else showError("Error al registrar usuario", res.msg);
}