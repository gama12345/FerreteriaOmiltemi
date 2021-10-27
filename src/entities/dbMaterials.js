import { db } from './firebase';
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";

const collectionName = "materials";
const materialsRef = collection(db, collectionName);

const materialExists = async name => {
    const q = query(materialsRef, where("name", "==", name));
    const querySnapshot = await getDocs(q);
    const doc = querySnapshot.docs[0];
    return doc;
}

const getAllMaterials = async () => { return await getDocs(materialsRef) }

const registerMaterial = async name =>{
    return await setDoc(doc(db, collectionName, name), {name: name})
}

export { materialExists, getAllMaterials, registerMaterial }