import { setNavbar } from "./navbar"
import '../ui/styles/stock/editproduct.css'
import { isSessionStarted } from "../entities/session"
import { getProductById } from "../entities/dbProducts"
import { backToStockView } from "./navigation"
import { categoryExists, getAllCategories } from "../entities/dbCategories"
import { getAllNamesSuppliers } from "../entities/dbSuppliers"
import { brandExists, getAllBrands } from "../entities/dbBrands"
import { getAllMaterials, materialExists } from "../entities/dbMaterials"
import { getAllSalesUnit, salesUnitExists } from "../entities/dbSalesUnit"
import { showError, showInput, showMsg } from "./alerts"
import { editionProduct } from "../use-cases/editionProduct"

//Checks if user is authenticated
if(!isSessionStarted()) backToLogin();
//Importing navbar
setNavbar();

//Events
const btnBack = document.getElementById("btnBack");
btnBack.addEventListener('click', backToStockView);

//Checking url parameters
const urlParams = window.location.search;
if(urlParams.length == 0) backToStockView();
const params = new URLSearchParams(urlParams);
const productId = params.get("id");
if(productId == null) backToStockView();

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
let previousImgNames = [];
//Images
const imgOne = document.getElementById("imageOne");
imgOne.setAttribute('src', '../../images/image_preview.png');
imgOne.onchange = function(){ setImagePreview("imageOnePreview", this) };
const imgTwo = document.getElementById("imageTwo");
imgTwo.setAttribute('src', '../../images/image_preview.png');
imgTwo.onchange = function(){ setImagePreview("imageTwoPreview", this) };
const imgThree = document.getElementById("imageThree");
imgThree.setAttribute('src', '../../images/image_preview.png');
imgThree.onchange = function(){ setImagePreview("imageThreePreview", this) };

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
const btnSave = document.getElementById("btnSaveProduct");
btnSave.addEventListener('click', () => onSavingChanges());

//Getting product's data
gettingProductData(productId);

async function gettingProductData(id){
    const product = await getProductById(id);
    name.value = product.name;
    shortName.value = product.short_name;
    description.value = product.description;
    cost.value = product.cost;
    price.value = product.price;
    await onLoadingOptions();
    category.value = product.category;
    brand.value = product.brand;
    material.value = product.material;
    salesUnit.value = product.sales_unit;
    if(product.images) setProductImages(product.images);
}

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

async function onAddOption(input, title, desc, dataExists, comment){
    const res = await showInput(title, desc);
    if(res.isConfirmed) {
        const existing = await dataExists(res.value);
        if(!existing) {
            input.innerHTML += `<option value='${res.value}' selected>${res.value}</option>`;
        }else showError("Error al agregar", comment);
    }
}

function setProductImages(images){
    let img = document.getElementById("imageOnePreview");
    if(images.imageOne) {
        img.style.backgroundImage = `url(${images.imageOne.url})`;
        previousImgNames.push({name: images.imageOne.name});
    }
    img = document.getElementById("imageTwoPreview");
    if(images.imageTwo) {
        img.style.backgroundImage = `url(${images.imageTwo.url})`;
        previousImgNames.push({name: images.imageTwo.name});
    }
    img = document.getElementById("imageThreePreview");
    if(images.imageThree) {
        img.style.backgroundImage = `url(${images.imageThree.url})`;
        previousImgNames.push({name: images.imageThree.name});
    }
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

async function onSavingChanges(){
    btnSave.disabled = true;
    let arrayImages = [{file: null, previousImgName: null}, {file: null, previousImgName: null}, {file: null, previousImgName: null}];
    if(imgOne.files[0]){
        arrayImages[0].file = imgOne.files[0];
        if(previousImgNames[0]){
            arrayImages[0].previousImgName = previousImgNames[0].name;
            previousImgNames[0] = null;
        }
    }
    if(imgTwo.files[0]){        
        arrayImages[1].file = imgTwo.files[0];
        if(previousImgNames[1]){
            arrayImages[1].previousImgName = previousImgNames[1].name;
            previousImgNames[1] = null;
        }
    }
    if(imgThree.files[0]){
        arrayImages[2].file = imgThree.files[0];
        if(previousImgNames[2]){
            arrayImages[2].previousImgName = previousImgNames[2].name;
            previousImgNames[2] = null;
        }
    } 
    let res = await editionProduct(productId, name.value, shortName.value, description.value, category.value,
                        brand.value, material.value, supplier, salesUnit.value, cost.value, price.value,
                        arrayImages, previousImgNames);
    if(res.result){        
        showMsg("Producto editado", "Se ha editado el producto correctamente.", "../stock/view.html");
    }
    else{
        showError("Error al editar producto", res.msg);
        btnSave.disabled = false;
    }

}