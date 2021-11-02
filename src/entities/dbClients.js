import { db } from '../entities/firebase';
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";

const collectionName = "clients";
const usersRef = collection(db, collectionName);

const getAllNamesClients = async () => {
    const querySnapshot = await getDocs(query(usersRef));
    let clientsList = [];
    querySnapshot.forEach(client => {
        clientsList.push(
            {
                unique_key: client.id,
                search_field: `${client.data().name} ${client.data().last_name}`,                
            }
        );
    });
    return clientsList;    
}

const getClientById = async (id) => {
    const ref = doc(db, collectionName, id);
    const docSnap = await getDoc(ref);
    return docSnap.exists() ? docSnap.data() : null;
}

export { getAllNamesClients, getClientById }