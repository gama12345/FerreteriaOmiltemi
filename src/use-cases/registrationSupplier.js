import { validateDataSupplier } from "../presenters/dataValidation";
import { registerSupplier } from "../entities/dbSuppliers";

export async function registrationSupplier(name_company, email_company, phone_company, name_contact,
                                                                email_contact, phone_contact, address){
    let res = validateDataSupplier(name_company, email_company, phone_company, name_contact,
                                            email_contact, phone_contact, address);
    if(res.result){
        let today = new Date();
        let date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
        await registerSupplier(name_company, email_company, phone_company, name_contact, email_contact,
                                phone_contact, address, date);
    }
    return res;
}