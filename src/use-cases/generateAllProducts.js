import jsPDF from "jspdf";
import 'jspdf-autotable';
import { getClientById } from "../entities/dbClients";
import { getDiscount } from "../entities/dbDiscounts";
import { getAllProducts, getOutOfStockProducts, getProductById } from "../entities/dbProducts";
import { getTodaySales } from "../entities/dbSales";
import { getSupplierById } from "../entities/dbSuppliers";
import { logoImgURI } from "../presenters/logoImageURI";

export const generateReportAllProducts = async () => {
    const list = await gettingOutOfStockProducts()

    var doc = new jsPDF()
    //Logo
    const imgURI = logoImgURI;
    doc.addImage(imgURI, 'JPEG', 20, 10, 38, 10)
    //Title
    doc.setFontSize(14)
    let xPosText = centerText('Ferretería Omiltemi', doc)
    doc.text(xPosText, 13, 'Ferretería Omiltemi')
    //Address
    doc.setFontSize(10)
    xPosText = centerText('Amelitos II, #23, 39059', doc)
    doc.text(xPosText, 17, 'Amelitos II, #23, 39059')
    xPosText = centerText('Chilpancingo de los Bravo, Gro.', doc)
    doc.text(xPosText, 20, 'Chilpancingo de los Bravo, Gro.')
    //Header
    doc.setFontSize(12)
    xPosText = centerText('Productos registrados', doc)
    doc.text(xPosText, 30, 'Productos registrados')
    //Products
    let productsList = []
    for(let i=0; i<list.length; i++){
        productsList.push([(i+1), list[i].name, list[i].brand, list[i].salesUnit, list[i].supplier, list[i].stock])
    }
    doc.autoTable({
        head: [['N°', 'Nombre', 'Marca', 'Presentación', 'Proveedor', 'Existencias']],
        body: productsList,
        margin: {
            top: 35,
            left: 20,
            right: 20
        }
        
    })
    //Create
    doc.save("productos_registrados.pdf")
    
}

async function gettingOutOfStockProducts(){
    const snapshot =  await getAllProducts()
    let array = []
    for(let i=0; i<snapshot.length; i++){
        const productName = snapshot[i].data().name
        const productBrand = snapshot[i].data().brand
        const salesUnit = snapshot[i].data().sales_unit
        const supplier = await getSupplierById(snapshot[i].data().supplier)
        const productStock = snapshot[i].data().stock
        array.push({name: productName, brand: productBrand, salesUnit: salesUnit, supplier: supplier.name_company,
                    stock: productStock})
    }
    return array
}

function centerText(text, doc){
    let textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    let textOffset = (doc.internal.pageSize.width - textWidth) / 2;
    return textOffset
}