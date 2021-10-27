import { db } from './firebase';
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";

const collectionName = "sales_unit";
const salesUnitRef = collection(db, collectionName);

const salesUnitExists = async name => {
    const q = query(salesUnitRef, where("name", "==", name));
    const querySnapshot = await getDocs(q);
    const doc = querySnapshot.docs[0];
    return doc;
}

const getAllSalesUnit = async () => { return await getDocs(salesUnitRef) }

const registerSalesUnit = async name =>{
    return await setDoc(doc(db, collectionName, name), {name: name})
}

export { salesUnitExists, getAllSalesUnit, registerSalesUnit }