import { checkUniqueness } from "../entities/dbUsers"

//Validation of input fields
const isValidName = name => {
    let regex = /[(A-ZÁ-Úa-zá-ú)*\s*]+/;
    return (name.match(regex) == name);
}
const isValidPhone = phone => {
    let regex = /[0-9]{10}/;
    return (phone.match(regex) == phone);
}
const isValidEmail = email => {
    let regex = /^[_\-A-Za-z0-9\+]+(\.[_A-Za-z0-9]+)*@+[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/g;
    return (email.match(regex) == email);
}

const isValidPassword = password => {
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\ ^&\*]).{6,}$/;
    return (password.match(regex) == password);
}
const isValidPrice = price => {
    let regex = /^[1-9][0-9]*\.?\d?\d?/;
    return (price.match(regex) == price);
}
const isValidInteger = phone => {
    let regex = /^[1-9][0-9]{0,4}/;
    return (phone.match(regex) == phone);
}

//Validation of user's data
const validateDataUser = async (name, last_name, email, phone, id = null, password = null, confirm_password = null) =>{
    if(isValidName(name)){
        if(isValidName(last_name)){
            if(isValidEmail(email)){
                const userUsingEmail = await checkUniqueness(email, "email");
                if(!userUsingEmail || (id != null && userUsingEmail == id)){
                    if(isValidPhone(phone)){
                        if(password != null){
                            if(isValidPassword(password)){
                                if(confirm_password != null){
                                    if(password == confirm_password){
                                        return {result: true, masg: "Campos validados"}
                                    }else return {result: false, msg: "La contraseña y su confirmación no coinciden."}
                                }return {result: true, masg: "Campos validados"}
                            }else return {result: false, msg: "Campo 'Contraseña' no válido, use al menos 6 "+
                                                                "caracteres e incluya al menos una mayúsucula, "+
                                                                "un número y un caracter especial."}
                        }return {result: true, masg: "Campos validados"}
                    }else return {result: false, msg: "Campo 'Teléfono' no válido, use 10 digitos."}
                }else return {result: false, msg: "Correo electrónico no válido. Actualmente en uso."}
            }else return {result: false, msg: "Formato del campo 'Correo electrónico' no válido."}
        }else return {result: false, msg: "Formato del campo 'Apellidos' no válido, use letras y espacios en blanco."}
    }else return {result: false, msg: "Formato del campo 'Nombre' no válido, use letras y espacios en blanco."}
}

//Validation of supplier's data
const validateDataSupplier = (name_company, email_company, phone_company, 
                                name_contact, email_contact, phone_contact, address) => {
    if(name_company.trim() != ""){
        if(email_company == "" || isValidEmail(email_company)){
            if(isValidPhone(phone_company)){
                if(isValidName(name_contact)){
                    if(email_contact == "" || isValidEmail(email_contact)){
                        if(isValidPhone(phone_contact)){
                            if(address != ""){
                                return {result: true, msg: "Campos validados"}
                            }else return {result: false, msg: "Ingrese la dirección de la empresa proveedora."}
                        }else return {result: false, msg: "Teléfono del contacto de la empresa no válido, use 10 digitos."}
                    }else return {result: false, msg: "Formato del correo electrónico del contacto de la empresa no válido."}
                }else return {result: false, msg: "Nombre de persona de contacto no válido, use letras y espacios en blanco."}
            }else return {result: false, msg: "Teléfono de la empresa no válido, use 10 digitos."}
        }else return {result: false, msg: "Formato del correo electrónico de la empresa no válido."}
    }else return {result: false, msg: "Ingrese el nombre de la empresa proveedora."}
}

//Validation of product data
const validateDataProduct = (name, short_name, description, category, brand, material, supplier,
                                    sales_unit, cost, price) => {
    if(name.trim() != ""){
        if(checkUniqueness("name", name)){
            if(short_name.trim() != "" && short_name.length <= 20){
                if(description.trim() != ""){
                    if(category != ""){
                        if(brand != ""){
                            if(material != ""){
                                if(supplier.options.length > 0){
                                    if(sales_unit != ""){
                                        if(isValidPrice(cost)){
                                            if(isValidPrice(price)){
                                                return {result: true, msg: "Campos validados"}    
                                            }else return {result: false, msg: "Campo 'Precio de venta' debe ser un número, puede incluir hasta dos decimales."}
                                        }else return {result: false, msg: "Campo 'Costo de compra' debe ser un número, puede incluir hasta dos decimales."}
                                    }else return {result: false, msg: "Debe especificar la unidad de venta del producto."}
                                }else return {result: false, msg: "Debe registrar un proveedor para el producto."}
                            }else return {result: false, msg: "Debe especificar el material del producto."}
                        }else return {result: false, msg: "Debe especificar la marca del producto."}
                    }else return {result: false, msg: "Debe especificar la categoria del producto."}
                }else return {result: false, msg: "Ingrese la descripción del producto."}
            }else return {result: false, msg: "Especifique el nombre corto del producto (20 caracteres máximo)."}
        }else return {result: false, msg: "Nombre de producto ya registrado. Use uno diferente."}
    }else return {result: false, msg: "Ingrese el nombre del producto."}
}

export { isValidEmail, isValidPassword, isValidName, isValidPhone, validateDataUser, validateDataSupplier, 
            validateDataProduct, isValidInteger };