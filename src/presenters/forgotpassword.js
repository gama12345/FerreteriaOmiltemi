import '../ui/styles/forgotpassword.css'
import { submitRecoveryLink } from '../use-cases/generateResetPassLink'
import { isValidEmail } from './dataValidation'
import { showMsg, showError } from './alerts'
import { backToLogin, goDashboard } from './navigation'
import { isSessionStarted } from '../entities/session'

const btnBack = document.getElementById("btnBackLogin");
btnBack.addEventListener('click', () => backToLogin());
const btnRecovery = document.getElementById("btnRecovery");
btnRecovery.addEventListener('click', () => validateUserEmail());

//Checks session status
if(isSessionStarted()) goDashboard();

//Email link to reset password
const validateUserEmail = () => {
    let email = document.getElementById("email");
    if(isValidEmail(email.value)){
      submitRecoveryLink(email.value)
        .then(res =>{
          if(res.value) {
            showMsg("Enlace generado", res.msg);
            email.value = "";
          }else{
            showError("Ha ocurrido un error", res.msg);          
          }
        }); 
    }else{
      showError("Email no válido", "La dirección de correo electrónico ingresada tiene un formato incorrecto");
    }
}