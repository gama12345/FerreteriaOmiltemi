import './ui/styles/index.css'
import { getRole, validateUserLogin } from './entities/dbUsers';
import { createNewSession, isSessionStarted } from './entities/session';
import { goDashboard } from './presenters/navigation';
import { showError } from './presenters/alerts';


const btnLogin = document.getElementById("btnLogin");
btnLogin.addEventListener('click', () => validateUserAccess());

//Checks if user is authenticated
if(isSessionStarted()) goDashboard();

const validateUserAccess = async () => {
    const userEmail = document.getElementById("email");
    const userPass = document.getElementById("password");
    const idUser = await validateUserLogin(userEmail.value, userPass.value);
    let roleUser;
    if(idUser) roleUser = await getRole(idUser);
    if(roleUser){
        createNewSession(idUser, roleUser);
        goDashboard();
    }
    else showError("Error al iniciar sesión", "El email o contraseña de usuario es incorrecto.");
}
