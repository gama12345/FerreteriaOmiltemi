import { setNavbar } from "./navbar"
import { setOptionsBar } from "./stockoptionsbar"
import { isSessionStarted } from "../entities/session"
import { backToLogin } from "./navigation"
import '../ui/styles/stock/registerproduct.css'
import { showError, showInput, showMsg } from "./alerts"
import { registrationProduct } from "../use-cases/registrationProduct"
import { categoryExists, getAllCategories } from "../entities/dbCategories"
import { getAllNamesSuppliers } from "../entities/dbSuppliers"
import { brandExists, getAllBrands } from "../entities/dbBrands"
import { getAllMaterials, materialExists } from "../entities/dbMaterials"
import { getAllSalesUnit, salesUnitExists } from "../entities/dbSalesUnit"
import { getImagesNames, getProductImages, registerProduct, updateProductCount, uploadProductImages } from "../entities/dbProducts"

//Checks if user is authenticated
if(!isSessionStarted()) backToLogin();
//Importing navbar
setNavbar();
//Importing options bar
setOptionsBar("registerProducts");

//Constants
const name = document.getElementById("name");
const shortName = document.getElementById("shortName");
const description = document.getElementById("description");
const category = document.getElementById("category");
const brand = document.getElementById("brand");
const material = document.getElementById("material");
const supplier = document.getElementById("supplier");
const salesUnit = document.getElementById("salesUnit");
const cost = document.getElementById("cost");
const price = document.getElementById("price");


//Loading category, brand, suppliers, material, sales_unit options
onLoadingOptions();

//Events
const btnOtherCategory = document.getElementById("categoryOther");
btnOtherCategory.addEventListener('click', () => onAddOption(category, "Ingrese la categoría",
                                                    "Nombre de la categoría", categoryExists,
                                                    "Esta categoría ya está registrada."));
const btnOtherBrand = document.getElementById("brandOther");
btnOtherBrand.addEventListener('click', () => onAddOption(brand, "Ingrese la marca",
                                                    "Nombre de la marca", brandExists,
                                                    "Esta marca ya está registrada."));                                                    
const btnOtherMaterial = document.getElementById("materialOther");
btnOtherMaterial.addEventListener('click', () => onAddOption(material, "Ingrese el material",
                                                    "Nombre del material", materialExists,
                                                    "Este material ya está registrado."));
const btnOtherSalesUnit = document.getElementById("salesUnitOther");
btnOtherSalesUnit.addEventListener('click', () => onAddOption(salesUnit, "Ingrese la unidad de venta",
                                                    "Nombre de la presentación de venta", salesUnitExists,
                                                    "Esta unidad de venta ya está registrada."));

const imgOne = document.getElementById("imageOne");
imgOne.setAttribute('src', '../../images/image_preview.png');
imgOne.onchange = function(){ setImagePreview("imageOnePreview", this) };
const imgTwo = document.getElementById("imageTwo");
imgTwo.setAttribute('src', '../../images/image_preview.png');
imgTwo.onchange = function(){ setImagePreview("imageTwoPreview", this) };
const imgThree = document.getElementById("imageThree");
imgThree.setAttribute('src', '../../images/image_preview.png');
imgThree.onchange = function(){ setImagePreview("imageThreePreview", this) };

const btnRegister = document.getElementById("btnRegisterProduct");
btnRegister.addEventListener('click', onRegisterProduct);

async function onLoadingOptions(){
    loadOptions(category, getAllCategories);
    loadOptions(brand, getAllBrands);
    loadOptions(material, getAllMaterials);
    loadOptions(salesUnit, getAllSalesUnit);
    //Supplier
    const suppliers = await getAllNamesSuppliers();
    suppliers.forEach(sup => {
        const name = sup.search_field;
        supplier.innerHTML += `<option value='${name}' id='${sup.unique_key}'>${name}</option>`
    });
}

async function loadOptions(dataType, fun){
    const elements = await fun();
    elements.forEach(obj => {
        const name = obj.data().name;
        dataType.innerHTML += `<option value='${name}'>${name}</option>`
    });    
}

function setImagePreview(previewId, evt){
    const img = document.getElementById(previewId);
    if (FileReader && evt.files && evt.files.length) {
        let reader = new FileReader();
        reader.onload = event => img.style.backgroundImage = `url(${event.target.result})`;
        reader.readAsDataURL(evt.files[0]);
    }else{
        showMsg("Sin vista previa", "El navegador en uso no permite visualizar imágenes cargadas desde su equipo.");
    }
}

async function onAddOption(input, title, desc, dataExists, comment){
    const res = await showInput(title, desc);
    if(res.isConfirmed) {
        const existing = await dataExists(res.value);
        if(!existing) {
            input.innerHTML += `<option value='${res.value}' selected>${res.value}</option>`;
        }else showError("Error al agregar", comment);
    }
}

async function onRegisterProduct(){
    btnRegister.disabled = true;
    let arrayImages = [];
    if(imgOne.files[0]) arrayImages.push(imgOne.files[0]);
    if(imgTwo.files[0]) arrayImages.push(imgTwo.files[0]);
    if(imgThree.files[0]) arrayImages.push(imgThree.files[0]);   
    let res = await registrationProduct(name.value, shortName.value, description.value, category.value,
                        brand.value, material.value, supplier, salesUnit.value, cost.value, price.value,
                        arrayImages);
    if(res.result){        
        showMsg("Producto registrado", "Se ha registrado al producto correctamente.", "../stock/registerproduct.html");
    }
    else{
        showError("Error al registrar producto", res.msg);
        btnRegister.disabled = false;
    }
}