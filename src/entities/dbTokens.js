import { db } from '../entities/firebase';
import { collection, doc, getDoc, query, where, getDocs, addDoc, deleteDoc } from "firebase/firestore";

const collectionName = "tokens_reset_pass";
const tokensRef = collection(db, collectionName);

const generateToken = async (userEmail) => {
    const docRef = await addDoc(tokensRef, {
            user: userEmail                 
    });
    return docRef.id;
}

const getResetPassToken = async (token) => {
    const docRef = doc(db, collectionName, token);
    return await getDoc(docRef);
}

const deleteTokenByUserEmail = async (userEmail) => {
    const q = query(tokensRef, where("user", "==", userEmail));
    const snapshot = await getDocs(q);
    snapshot.forEach(async (docToken) => await deleteDoc( doc(db, collectionName, docToken.id) ) );    
}

export { generateToken, getResetPassToken, deleteTokenByUserEmail }