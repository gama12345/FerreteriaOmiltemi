import { validateDataUser } from "../presenters/dataValidation";
import { registerUser } from "../entities/dbUsers";

export async function registrationUser(name, last_name, role, email, phone, password, confirm_password){
    let res = await validateDataUser(name, last_name, email, phone, undefined, password, confirm_password);
    if(res.result){
        let today = new Date();
        let date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
        await registerUser(name, last_name, role, email, phone, password, date);
    }
    return res;
}