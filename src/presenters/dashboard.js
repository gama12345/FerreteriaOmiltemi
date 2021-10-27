import { setNavbar } from "./navbar"
import '../ui/styles/dashboard.css'
import { getUserName } from "../entities/dbUsers"
import { showError } from "./alerts"
import { isSessionStarted } from "../entities/session"
import { backToLogin } from "./navigation"

const userId = localStorage.getItem("userId");

//Checks if user is authenticated
if(!isSessionStarted()) backToLogin();
//Importing navbar
setNavbar();
//Setting user data
showUserName();

async function showUserName(){
    const userName = await getUserName(userId);
    const title = document.getElementById("titledashboard");
    if(userName) {
        title.innerHTML = "Hola "+userName 
    }else{ 
        showError("Error en base de datos",
                "No se ha podido recuperar el nombre del usuario { null }");
        title.innerHTML = "undefined";
    }
}