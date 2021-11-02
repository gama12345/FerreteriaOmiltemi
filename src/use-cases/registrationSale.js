import { getClientById } from "../entities/dbClients";
import { stockValidation, updateStockExistences } from "../entities/dbProducts";
import { registerSale } from "../entities/dbSales";
import { showConfirm } from "../presenters/alerts";

export async function registeringSale(clientId, isNotRegistered, productsList, total, discount){
    if(clientId || isNotRegistered.checked){
        if(productsList.length > 0){
            let detailsProducts = "";
            productsList.forEach(product => detailsProducts += product.quantity+" "+product.name+"<br>");
            const res = await showConfirm("Registrar venta", `¿Seguro que desea registrar esta venta?<br><br>
                                    ${detailsProducts}<br>
                                    Descuentos: ${discount}<br>
                                    <b>Total a pagar: ${total}</b>`, 
                                    "Registrar venta");
            if(res){
                const validQuantities = await stockValidation(productsList);
                if(!validQuantities){
                    if(!clientId) clientId = "No registrado";
                    let today = new Date();
                    let date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
                    for(const product of productsList){
                        await updateStockExistences(product.id, (-1*product.quantity));
                    }
                    const saleNum = await registerSale(clientId, productsList, date);
                    let client = clientId;
                    if(clientId != "No registrado"){
                        const resClient = await getClientById(clientId);
                        client = resClient.name+" "+resClient.last_name;
                    }
                    return {result: true, saleNum: saleNum, client: client, date: date}
                }else return {result: false, err: "Insuficientes existencias", msg: `El producto ${validQuantities.name} cuenta con ${validQuantities.stock} unidades`}
            }else return {result: false, msg: null}
        }else return {result: false, err: "Productos indefinidos", msg: "Agregue al menos un producto para efectuar una venta."}
    }else return {result: false, err: "Cliente indefinido", msg: "Seleccione al cliente o marquelo como no registrado."}
}