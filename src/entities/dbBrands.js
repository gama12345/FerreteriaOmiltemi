import { db } from './firebase';
import { collection, query, where, getDocs, setDoc, doc} from "firebase/firestore";

const collectionName = "brands";
const brandsRef = collection(db, collectionName);

const brandExists = async name => {
    const q = query(brandsRef, where("name", "==", name));
    const querySnapshot = await getDocs(q);
    const doc = querySnapshot.docs[0];
    return doc;
}

const getAllBrands = async () => { return await getDocs(brandsRef) }

const registerBrand = async name =>{
    return await setDoc(doc(db, collectionName, name), {name: name})
}

export { brandExists, getAllBrands, registerBrand }