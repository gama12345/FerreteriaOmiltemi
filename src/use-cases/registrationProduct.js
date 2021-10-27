import { brandExists, registerBrand } from "../entities/dbBrands";
import { categoryExists, registerCategory } from "../entities/dbCategories";
import { materialExists, registerMaterial } from "../entities/dbMaterials";
import { updateImagesURL, uploadProductImages, registerProduct, updateProductCount } from "../entities/dbProducts";
import { registerSalesUnit, salesUnitExists } from "../entities/dbSalesUnit";
import { validateDataProduct } from "../presenters/dataValidation";

export async function registrationProduct(name, short_name, description, category, brand, material, supplier,
                                            sales_unit, cost, price, images){
    let regRes = validateDataProduct(name, short_name, description, category, brand, material, supplier,
                                    sales_unit, cost, price);
    if(regRes.result){
        let exists = await categoryExists(category);
        if(!exists) await registerCategory(category); 
        exists = await brandExists(brand);
        if(!exists) await registerBrand(brand);
        exists = await materialExists(material);
        if(!exists) await registerMaterial(material);
        exists = await salesUnitExists(sales_unit);
        if(!exists) await registerSalesUnit(sales_unit);
        const supplierId = supplier.options[supplier.options.selectedIndex].id;
        const newProduct = await registerProduct(name, short_name, description, category, brand, material, 
                                    supplierId, sales_unit, cost, price);
        if(newProduct){
            await updateProductCount();
        }
        if(images.length > 0){
            //Uploading images
            const imagesUploaded = await uploadProductImages(newProduct.id, images);
            if(imagesUploaded){
                const urlUpdated = await updateImagesURL(newProduct.id, images);
                if(urlUpdated){
                    regRes = {result: true, msg: "Guardado"};
                }else return {result: false, msg: `Ha ocurrido un error al guardar la URL de las imágenes, 
                                                    intenté editar el registro del producto.`}
            }else return {result: false, msg: `Ha ocurrido un error al guardar las imágenes, intenté editar 
                                                el registro del producto.`}
        }
    }
    return regRes;
}