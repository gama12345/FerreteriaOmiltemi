import '../ui/styles/navbar.css'
import { backToLogin } from './navigation';

const logout = () => {
    localStorage.clear();
    backToLogin();
}

function addEvents(){
    const btnLogout = document.getElementById("logout");
    btnLogout.addEventListener('click', () => logout());
}

const setNavbar = () => {
    const navbarLocation = getNavBarLocation();
    fetch(navbarLocation)
    .then(res => res.text())
    .then(text => {
        let newelem = document.getElementById("navbar");
        newelem.innerHTML = text;
        //Adding events
        addEvents();
        //Checking permissions
        checkPermissions();
    })
}

function checkPermissions(){
    const userRole = localStorage.getItem("userRole");
    if(userRole != "owner"){
        /*Removing owner exclusive permissions */
        document.getElementById("wUsers").style.display = 'none';
        document.getElementById("mUsers").style.display = 'none';
        /*Removing owner/admin exclusive permissions */
        if(userRole == "employee"){
            document.getElementById("wStock").style.display = 'none';
            document.getElementById("wReports").style.display = 'none';
            document.getElementById("wSuppliers").style.display = 'none';
            document.getElementById("mStock").style.display = 'none';
            document.getElementById("mReports").style.display = 'none';
            document.getElementById("mSuppliers").style.display = 'none';
        }
    }
}

function getNavBarLocation(){
    const locationSplit = location.href.toString().split("/");
    const module = locationSplit[locationSplit.length-2];
    if( module == "users" || module == "suppliers" || module == "stock" || module == "sales" || module == "reports"){
        return "../navbar.html";
    }
    return "./navbar.html";
}

export { setNavbar }