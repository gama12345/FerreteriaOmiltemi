import { updateStockExistences } from "../entities/dbProducts";
import { cancelSale, getSaleById } from "../entities/dbSales";
import { validateOwnerPass } from "../entities/dbUsers";
import { showConfirm, showError, showInput } from "../presenters/alerts";


export async function cancellingSale(saleId){
    let res = await showConfirm("Cancelar venta", "¿Está seguro que desea cancelar este registro de venta?", "Continuar");
    if(res){
        let userType = localStorage.getItem("userRole");
        res = {isConfirmed: true}
        if(userType != "owner"){
            res = await showInput("Cancelar venta", "Ingrese la clave de propietario para continuar");
        }
        if(res.isConfirmed){
            res = await validateOwnerPass(res.value);
            if(res){
                await cancelSale(saleId);
                const sale = await getSaleById(saleId);
                const arrayProducts  = Object.entries(sale.products)
                for(const product of arrayProducts) {
                    await updateStockExistences(product[0], product[1].quantity)
                }
                return {result: true}
            }else return {result: false, msg: "Clave de propietario incorrecta, su cuenta no tiene permisos suficientes para cancelar."}
        }else return {result: false}
    }else return {result: false}
}