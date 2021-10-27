import { db } from './firebase';
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";

const collectionName = "categories";
const categoriesRef = collection(db, collectionName);

const categoryExists = async name => {
    const q = query(categoriesRef, where("name", "==", name));
    const querySnapshot = await getDocs(q);
    const doc = querySnapshot.docs[0];
    return doc;
}

const getAllCategories = async () => { return await getDocs(categoriesRef) }

const registerCategory = async name =>{
    return await setDoc(doc(db, collectionName, name), {name: name})
}


export { categoryExists, getAllCategories, registerCategory }