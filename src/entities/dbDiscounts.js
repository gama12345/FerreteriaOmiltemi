import { db } from './firebase';
import { collection, doc, getDoc } from "firebase/firestore";

const collectionName = "discounts";
const discountsRef = collection(db, collectionName);

const getDiscount = async id => {
    if(id == 'Indefinido') return null;
    const ref = doc(db, collectionName, id);
    const docSnap = await getDoc(ref);
    return docSnap.data();
}

export { getDiscount }