import { db } from '../entities/firebase';
import { collection, doc, query, where, getDocs, addDoc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";

const collectionName = "suppliers";
const suppliersRef = collection(db, collectionName);

const getSupplierById = async (id) => {
    const ref = doc(db, collectionName, id);
    const docSnap = await getDoc(ref);
    return docSnap.exists() ? docSnap.data() : null;
}

const getAllNamesSuppliers = async () => {
    const q = query(suppliersRef);
    const querySnapshot = await getDocs(q);
    let suppliersList = [];
    querySnapshot.forEach(supplier => {
        suppliersList.push(
            {
                unique_key: supplier.id,
                search_field: `${supplier.data().name_company}`,                
            }
        );
    });
    return suppliersList;    
}

const updateSupplier = async (id, name_company, email_company, phone_company, name_contact, email_contact,
                            phone_contact, address) => {
    const supplierRef = doc(db, collectionName, id);
    let data = {
        address: address,
        email_company: email_company,
        email_contact: email_contact,
        name_company: name_company,
        name_contact: name_contact,
        phone_company: phone_company,
        phone_contact: phone_contact
    };
    return await updateDoc(supplierRef, data);
}

const registerSupplier = async (name_company, email_company, phone_company, name_contact, email_contact,
    phone_contact, address, regDate) => {
    return await addDoc(suppliersRef, {
        name_company: name_company,
        email_company: email_company,
        phone_company: phone_company,
        name_contact: name_contact,
        email_contact: email_contact,
        phone_contact: phone_contact,
        address: address,
        registration_date: regDate,
        last_purchase_date: "Indefinida"
    });
}

const deleteSupplier = async (id) => {
    await deleteDoc(doc(db, collectionName, id));
}

const updateLastPurchaseDate = async (id, date) => {
    const supplierRef = doc(db, collectionName, id);
    await updateDoc(supplierRef, {
        last_purchase_date: date
    })
}

export { getSupplierById, getAllNamesSuppliers, updateSupplier, registerSupplier, deleteSupplier,
        updateLastPurchaseDate }