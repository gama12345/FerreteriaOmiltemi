import { db } from './firebase';
import { collection, doc, getDoc, query, where, getDocs, addDoc, updateDoc, deleteDoc,
            orderBy, startAfter, limit } from "firebase/firestore";

const collectionName = "sales";
const salesRef = collection(db, collectionName);

const registerSale = async (clientId, productsList, date) => {
    const products = {};
    for(const p of productsList){
        products[`${p.id}`] = {unit_price: p.price, quantity: p.quantity, discount: p.discountId};
    }
    const num = await getCount();
    const saleNum = (num.count+1);
    await addDoc(salesRef, {
        sale_number: saleNum, 
        client: clientId,
        products: products,
        status: 'CONFIRMED',
        date: date
    })
    await updateSalesCount(saleNum);
    return saleNum;
}

const getCount = async () => {
    const docRef = doc(db, "sales_count", "ventas_registradas");
    const document = await getDoc(docRef); 
    return document.data();
}

const updateSalesCount = async (newCount) => {
    const docRef = doc(db, "sales_count", "ventas_registradas");
    await updateDoc(docRef, {count: newCount})
}

const getSales = async (lastVisible) => {
    let q;
        q = query(salesRef, where("status", "==", "CONFIRMED"), 
                    orderBy("sale_number", "desc"), limit(10));
        if(lastVisible){
            q = query(salesRef, where("status", "==", "CONFIRMED"),
                        orderBy("sale_number", "desc"), startAfter(lastVisible), limit(10));
        }    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs;
}

const getTodaySales = async (date) => {
    let q;
        q = query(salesRef, where("status", "==", "CONFIRMED"), where("date","==", date),
                    orderBy("sale_number", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs;
}

const getAllSales = async () => {
    let q;
        q = query(salesRef, where("status", "==", "CONFIRMED"), 
                    orderBy("sale_number", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs;
}

const cancelSale = async id => {
    const saleRef = doc(db, collectionName, id);
    return await updateDoc(saleRef, {
        status: "CANCELED"
    })
}

const getSaleById = async id => {
    const ref = doc(db, collectionName, id);
    const docSnap = await getDoc(ref);
    return docSnap.exists() ? docSnap.data() : null;
}

export { registerSale, getCount, getSales, cancelSale, getSaleById, getTodaySales, getAllSales }