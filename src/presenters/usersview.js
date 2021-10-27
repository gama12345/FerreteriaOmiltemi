import { setNavbar } from "./navbar"
import { setOptionsBar } from "./usersoptionsbar"
import '../ui/styles/users/view.css'
import '../ui/styles/autocomplete.css'
import { isSessionStarted } from "../entities/session"
import { backToLogin } from "./navigation"
import { showError, showMsg } from "./alerts"
import { autocomplete } from "./autocomplete"
import { getAllNamesUsers, getUserById, updateUser } from "../entities/dbUsers"
import { validateDataUser } from "./dataValidation"


//Checks if user is authenticated
if(!isSessionStarted()) backToLogin();
//Importing navbar
setNavbar();
//Importing options bar
setOptionsBar();
//Getting users data
setAutocomplete();

//Constants
const inputName = document.getElementById("nameUser"); 
const inputLastName = document.getElementById("lastNameUser"); 
const selectRole = document.getElementById("roleUser"); 
const inputEmail = document.getElementById("emailUser"); 
const inputPhone = document.getElementById("phoneUser"); 
const inputRegDate = document.getElementById("registrationDateUser"); 
const selectStatus = document.getElementById("statusUser"); 
//Variables
let selectedUserId = null;

//Events
const formButtons = document.getElementById("formButtons");

const btnEdit = document.getElementById("btnEditUser");
btnEdit.addEventListener('click', () => {
    selectedUserId ? showFormButtons() : showError("Usuario indefinido",
                                        "Para editar un registro, primero seleccione un usuario de la búsqueda.");
});

const btnSave = document.getElementById("btnSaveUser");
btnSave.addEventListener('click', verifyUserData);
const btnCancel = document.getElementById("btnCancelEditUser");
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

async function setAutocomplete(){
    const searchInput = document.getElementById("searchUser");
    const usersList = await getAllNamesUsers();
    autocomplete(searchInput, usersList, setUserData);
}

const setUserData = async (id = null) => {
    if(id){
        const userData = await getUserById(id);
        inputName.value = userData.name;
        inputLastName.value = userData.last_name;
        inputEmail.value = userData.email;
        inputPhone.value = userData.phone;
        inputRegDate.value = userData.registration_date;
        selectRole.value = userData.role;
        selectStatus.value = userData.status;
        selectedUserId = id;
    }
}

const setFieldsStatus = (status) =>{
    const fields = document.getElementsByClassName("form-field");    
    for(let i=0; i<fields.length; i++){ status ? fields[i].removeAttribute("disabled") : 
                                                    fields[i].setAttribute("disabled", true) }
}

const cleanFields = () => {
    inputName.value = "";
    inputLastName.value = "";
    inputEmail.value = "";
    inputPhone.value = "";
    inputRegDate.value = "";
    selectRole.value = "owner";
    selectStatus.value = "ACTIVE";
}

async function verifyUserData(){
    let res = await validateDataUser(inputName.value, inputLastName.value,
                    inputEmail.value, inputPhone.value, selectedUserId);
    if(res.result){
        res = await updateUser(selectedUserId, inputName.value, inputLastName.value, selectRole.value,
            inputEmail.value, inputPhone.value, selectStatus.value, undefined);
        showMsg("Usuario actualizado", "Se han guardado los cambios correctamente.", "../users/view.html");
        cleanFields();
        setFieldsStatus(false);
        selectedUserId = null;
    }
    else showError("Error al actualizar información", res.msg);
}