import { validateDataUser } from "../presenters/dataValidation";
import { updateUser } from "../entities/dbUsers";

export async function updatingAccount(id, name, last_name, role, email, phone, status, password){
    let res = await validateDataUser(name, last_name, email, phone, id, password, undefined);
    if(res.result){
        await updateUser(id, name, last_name, role, email, phone, status, password);
    }
    return res;
}