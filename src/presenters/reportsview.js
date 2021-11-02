import { setNavbar } from "./navbar"
import '../ui/styles/reports/view.css'
import { isSessionStarted } from "../entities/session"
import { backToLogin } from "./navigation"
import { generateReportSalesToday } from "../use-cases/generateSalesToday";
import { generateReportSalesMonth } from "../use-cases/generateSalesMonth";
import { generateReportOutOfStockProducts } from "../use-cases/generateOufOfStockProducts";
import { generateReportAllProducts } from "../use-cases/generateAllProducts";

//Checks if user is authenticated
if(!isSessionStarted()) backToLogin();
//Importing navbar
setNavbar();

//Events
const salesTodayElement = document.getElementById("salesToday")
salesTodayElement.addEventListener('click', () => generateReportSalesToday())
const salesMonthElement = document.getElementById("salesMonth")
salesMonthElement.addEventListener('click', () => generateReportSalesMonth())
const productsOutOfStockElement = document.getElementById("productsStock")
productsOutOfStockElement.addEventListener('click', () => generateReportOutOfStockProducts())
const productsAllElement = document.getElementById("productsAll")
productsAllElement.addEventListener('click', () => generateReportAllProducts())
