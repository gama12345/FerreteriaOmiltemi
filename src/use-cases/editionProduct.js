import { brandExists, registerBrand } from "../entities/dbBrands";
import { categoryExists, registerCategory } from "../entities/dbCategories";
import { materialExists, registerMaterial } from "../entities/dbMaterials";
import { updateImagesURL, uploadProductImages, editProduct, deleteImage } from "../entities/dbProducts";
import { registerSalesUnit, salesUnitExists } from "../entities/dbSalesUnit";
import { validateDataProduct } from "../presenters/dataValidation";

export async function editionProduct(id, name, short_name, description, category, brand, material, supplier,
                                            sales_unit, cost, price, images, previousImages){
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
        await editProduct(id, name, short_name, description, category, brand, material, 
                                    supplierId, sales_unit, cost, price);
        let resDeleteImg = {value: true};
        const arrayImages = [];
        for(let i=0; i<images.length; i++){
            if(images[i].file){
                arrayImages.push(images[i].file);
                if(previousImages.length > i) previousImages[i] = images[i].file;
                if(previousImages.length <= i) previousImages.push(images[i].file);
            }
            if(images[i].previousImgName){
                resDeleteImg = await deleteImage(`${id}-${images[i].previousImgName}`);
            }
            if(!resDeleteImg.value) break;
        }

        if(resDeleteImg.value){
            if(arrayImages.length > 0){
                //Uploading images
                const imagesUploaded = await uploadProductImages(id, arrayImages);
                if(imagesUploaded.result){
                    const urlUpdated = await updateImagesURL(id, previousImages);
                    if(urlUpdated){
                        regRes = {result: true, msg: "Editado"};
                    }else return {result: false, msg: "Ha ocurrido un error al guardar la URL de las imágenes, "+
                                                        "intenté editar el registro del producto."}
                }else return {result: false, msg: "Ha ocurrido un error al guardar las imágenes, intenté editar "+
                                                    "el registro del producto."}
            }
        }else return {result: false, msg:`Ha ocurrido un error al editar las imágenes. Intente editar el producto nuevamente.`}        
    }
    return regRes;
}