import { db } from '../entities/firebase';
import { collection, doc, query, where, getDocs, addDoc, updateDoc, getDoc } from "firebase/firestore";
import { Buffer } from 'buffer'

const collectionName = "users";
const usersRef = collection(db, collectionName);

const validateUserLogin = async (email, pass) => {
    const encodedPass = Buffer.from(pass).toString("base64");
    const q = query(usersRef, where("email", "==", email), 
                    where("password", "==", encodedPass), where("status", "==", "ACTIVE"),);
    const querySnapshot = await getDocs(q);
    let docUser;
    if(!querySnapshot.empty) docUser = querySnapshot.docs[0];
    return docUser ? docUser.id : null;
}

const validateOwnerPass = async pass => {
    const encodedPass = Buffer.from(pass).toString("base64");
    const q = query(usersRef, where("role", "==", "owner"), 
                    where("password", "==", encodedPass), where("status", "==", "ACTIVE"));
    const querySnapshot = await getDocs(q);
    let docUser;
    if(!querySnapshot.empty) docUser = querySnapshot.docs[0];
    return docUser ? docUser.id : null;
}

const checkUniqueness = async (field, field_name) => {
    const q = query(usersRef, where(field_name, "==", field));
    const querySnapshot = await getDocs(q);
    const docUser = querySnapshot.docs[0];
    return docUser ? docUser.id : null;
}

const getUserById = async (userID) => {
    const ref = doc(db, "users", userID);
    const docSnap = await getDoc(ref);
    return docSnap.exists() ? docSnap.data() : null;
}

const getUserIdByEmail = async (userEmail, status = "ACTIVE") => {
    const q = query(usersRef, where("status", "==", status), where("email", "==", userEmail));
    const querySnapshot = await getDocs(q);
    const docUser = querySnapshot.docs[0];
    return docUser ? docUser.id : null;
}

const getRole = async (userID) => {
    const ref = doc(db, "users", userID);
    const docSnap = await getDoc(ref);
    return docSnap.exists() ? docSnap.data().role : null;
}

const getUserName = async (userID) => {
    const ref = doc(db, "users", userID);
    const docSnap = await getDoc(ref);
    return docSnap.exists() ? docSnap.data().name : null;
}

const getAllNamesUsers = async () => {
    const q = query(usersRef, where("role", "!=", "owner"));
    const querySnapshot = await getDocs(q);
    let usersList = [];
    querySnapshot.forEach(user => {
        usersList.push(
            {
                unique_key: user.id,
                search_field: `${user.data().name} ${user.data().last_name}`,                
            }
        );
    });
    return usersList;    
}

const setNewPassword = async (userID, newPass) => {  
    const encodedPass = Buffer.from(newPass).toString("base64");  
    const userRef = doc(db, collectionName, userID);
    return await updateDoc(userRef, {
        password: encodedPass
    });
}

const updateUser = async (userId, userName, userLastName, userRole, userEmail, userPhone, userStatus, userPass = null) => {
    const userRef = doc(db, collectionName, userId);
    let data = {
        name: userName,
        last_name: userLastName,
        role: userRole,
        email: userEmail,
        phone: userPhone,
        status: userStatus,
    };
    if(userPass != null){
        const encodedPass = Buffer.from(userPass).toString("base64");
        data.password = encodedPass
    }
    return await updateDoc(userRef, data);
}

const registerUser = async (userName, userLastName, userRole, userEmail, userPhone, pass, regDate) => {
    const encodedPass = Buffer.from(pass).toString("base64");
    return await addDoc(usersRef, {
        email: userEmail,
        last_name: userLastName,
        name: userName,
        password: encodedPass,
        phone: userPhone,
        registration_date: regDate,
        role: userRole,
        status: 'ACTIVE'
    });
}

export { validateUserLogin, checkUniqueness, getUserById , getUserIdByEmail, getRole,
    getUserName, getAllNamesUsers, setNewPassword, updateUser, registerUser, validateOwnerPass}