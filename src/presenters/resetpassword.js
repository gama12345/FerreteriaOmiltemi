import '../ui/styles/resetpassword.css'
import { isValidPassword } from './dataValidation'
import { showMsg, showError } from './alerts'
import { backToLogin, goDashboard } from './navigation'
import { setNewPassword, getUserIdByEmail } from '../entities/dbUsers'
import { deleteTokenByUserEmail, getResetPassToken, } from '../entities/dbTokens'
import { isSessionStarted } from '../entities/session'

//Checks session status
if(isSessionStarted()) goDashboard();

//Checking url parameters
const urlParams = window.location.search;
if(urlParams.length == 0) backToLogin();

const params = new URLSearchParams(urlParams);
const token = params.get("token");
const userEmail = params.get("user");

//Verify token and user email
validateParams(token, userEmail);

async function validateParams(token, userEmail){    
    const docSnap = await getResetPassToken(token);
    if (docSnap.exists()) {
        if(docSnap.data().user != userEmail){
            showError("Token no válido", "Error en la validación del enlace. " 
                        +"Solicite reestablecer su contraseña nuevamente.", "../index.html");
        }
    } 
    else showError("Token no válido", "Este enlace ha expirado", "../index.html");    
}

//Events
const btnConfirm = document.getElementById("btnConfirm");
btnConfirm.addEventListener('click', () => validateNewPass());

const validateNewPass = async () => {
    const newPassInput = document.getElementById("pass");
    const confirmPassInput = document.getElementById("confirmPass");
    if(newPassInput.value == confirmPassInput.value){
        if(isValidPassword(newPassInput.value)){
            const id = await getUserIdByEmail(userEmail)
            if(id != null ){
                setNewPassword(id, newPassInput.value)
                    .then(async () => {
                        await deleteTokenByUserEmail(userEmail);
                        showMsg("Contraseña actualizada", "Se ha restablecido su contraseña  correctamente",
                        "../index.html")
                    })
                    .catch(err => showError("Error en servidor", "Ha ocurrido el siguiente error al "
                                +"intentar actualizar su contraseña: "+err));                      
            }
        }
        else showError("Error en contraseña", "La nueva contraseña debe tener al menos 6 caracteres "
                        +"incluyendo una mayúsucula, un número y un caracter especial.")
    }
    else showError("Error en contraseña", "La nueva contraseña no coincide con su confirmación.");
}