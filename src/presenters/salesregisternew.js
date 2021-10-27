import { setNavbar } from "./navbar"
import { setOptionsBar } from "./salesoptionsbar"
import { isSessionStarted } from "../entities/session"
import { backToLogin } from "./navigation"
import '../ui/styles/sales/registernew.css'

//Checks if user is authenticated
if(!isSessionStarted()) backToLogin();
//Importing navbar
setNavbar();
//Importing options bar
setOptionsBar();