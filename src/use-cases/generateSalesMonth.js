import jsPDF from "jspdf";
import 'jspdf-autotable';
import { getClientById } from "../entities/dbClients";
import { getDiscount } from "../entities/dbDiscounts";
import { getProductById } from "../entities/dbProducts";
import { getAllSales, getSales, getsales } from "../entities/dbSales";
import { logoImgURI } from "../presenters/logoImageURI";

export const generateReportSalesMonth = async () => {
    let today = new Date()
    let date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear()
    const sales = await gettingMonthSales((today.getMonth()+1), today.getFullYear())

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
    xPosText = centerText('Ventas registradas del mes', doc)
    doc.text(xPosText, 30, 'Ventas registradas del mes')
    //Products
    let salesList = []
    for(let i=0; i<(sales.length-1); i++){
        salesList.push([sales[i].client, sales[i].products, sales[i].discounts, sales[i].total])
    }
    salesList.push(['','','',''])
    salesList.push(['Descuentos:','',sales[sales.length-1].totalDiscounts,''])
    salesList.push(['Total:','','',sales[sales.length-1].totalSales])
    doc.autoTable({
        head: [['Cliente', 'Concepto', 'Descuentos', 'Subtotal']],
        body: salesList,
        margin: {
            top: 35,
            left: 20,
            right: 20
        }
        
    })
    //Create
    doc.save("ventas_del_mes.pdf")
    
}

async function gettingMonthSales(month, year){
    const sales =  await getAllSales()
    let salesSnapshot = []
    for(let i=0; i<sales.length; i++){
        const saleDate = sales[i].data().date
        let dateElements = saleDate.split("/")
        if(dateElements[1] == month && dateElements[2] == year) salesSnapshot.push(sales[i])
    }
    let arraySales = []
    let totalSales = 0.00
    let totalDiscounts = 0.00
    for(let i=0; i<salesSnapshot.length; i++){
        let clientFullName = "No registrado";
        if(clientFullName != salesSnapshot[i].data().client){
            const client = await getClientById(salesSnapshot[i].data().client)
            clientFullName = `${client.name} ${client.last_name}`
        }
        let concept = '';
        let discounts = 0.00;
        let total = 0.00;
        const arrayProducts  = Object.entries(salesSnapshot[i].data().products)
        for(const product of arrayProducts) {
            const productRes = await getProductById(product[0]);
            concept += product[1].quantity+" "+productRes.short_name+"\n"
            if(product[1].discount != "Indefinido"){
                const productDiscount = await getDiscount(productRes.discount)
                discounts += calculateDiscount(productDiscount, product[1].quantity, productRes.price)
            }
            total += parseFloat(product[1].unit_price)*parseInt(product[1].quantity)
        }
        totalDiscounts += discounts
        totalSales += total
        arraySales.push({client: clientFullName, products: concept, discounts: discounts, total: total})
    }
    arraySales.push({totalSales: totalSales, totalDiscounts: totalDiscounts})
    return arraySales
}

function calculateDiscount(discount, units, price){
    if(units >= discount.min_unit){
        const applyTimes = Math.floor(units/discount.min_unit);
        const discountValue = (discount.percentage*0.01)*price;
        return Math.ceil(applyTimes*discount.min_unit*discountValue);
    }else showMsg("Descuento", `Producto con descuento: ${discount.description}`)
    return 0.00;
}

function centerText(text, doc){
    let textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    let textOffset = (doc.internal.pageSize.width - textWidth) / 2;
    return textOffset
}