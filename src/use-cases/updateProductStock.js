import { updateStockExistences } from "../entities/dbProducts";
import { updateLastPurchaseDate } from "../entities/dbSuppliers";

export async function updatingProductStock(productId, stock, supplierId){    
    let today = new Date();
    let date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
    await updateStockExistences(productId, stock);
    await updateLastPurchaseDate(supplierId, date);
}