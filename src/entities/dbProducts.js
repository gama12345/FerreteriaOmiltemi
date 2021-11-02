import { db, storage, storageRef, getDownloadURL, uploadBytes } from './firebase';
import { collection, doc, getDoc, query, where, getDocs, addDoc, updateDoc, deleteDoc,
            orderBy, startAfter, limit } from "firebase/firestore";
import { deleteObject, ref } from '@firebase/storage';

const collectionName = "products";
const productsRef = collection(db, collectionName);

const getProductById = async (id) => {
    const ref = doc(db, collectionName, id);
    const docSnap = await getDoc(ref);
    return docSnap.exists() ? docSnap.data() : null;
}

const getAllNamesProducts = async () => {
    const q = query(productsRef);
    const querySnapshot = await getDocs(q);
    let productsList = [];
    querySnapshot.forEach(product => {
        productsList.push(
            {
                unique_key: product.id,
                search_field: `${product.data().name}`,                
            }
        );
    });
    return productsList;    
}

const checkUniqueness = async (field_name, field) => {
    const q = query(productsRef, where(field_name, "==", field));
    const querySnapshot = await getDocs(q);
    const doc = querySnapshot.docs[0];
    return doc ? false : true;
}

const registerProduct = async (name, short_name, description, category, brand, material, supplierId,
                                sales_unit, cost, price) => {
    return await addDoc(productsRef, {
        name: name,
        short_name: short_name,
        description, description,
        category: category,
        brand: brand,
        material: material,
        supplier: supplierId,
        sales_unit: sales_unit,
        cost: cost,
        price: price,
        discount: "Indefinido",
        stock: 0
    });
}

const getProductCount = async () => {
    const docRef = doc(db, "products_count", "productos_registrados");
    const document = await getDoc(docRef); 
    return document.data();
}

const updateProductCount = async (value = 1) => {
    const docRef = doc(db, "products_count", "productos_registrados");
    const document = await getDoc(docRef); 
    const newCount = parseInt(document.data().count) + value; 
    await updateDoc(docRef, {count: ""+newCount})
}

const updateImagesURL = async (productId, images) => {
    let response = false;
    const docRef = doc(db, `${collectionName}/${productId}`);
    if(images.length > 0){
        const urls = await getProductImages(productId, images);
        const imgJSON = {};
        if(urls[0]) imgJSON.imageOne = {url: urls[0], name: images[0].name};
        if(urls[1]) imgJSON.imageTwo = {url: urls[1], name: images[1].name};
        if(urls[2]) imgJSON.imageThree = {url: urls[2], name: images[2].name};        
        await updateDoc(docRef, {
            images: imgJSON
        });
        response = true;
    }
    return response;
}

const uploadProductImages = async (productId, images) => {
    let res = {result: false, msg: ""};
    let index = 0;
    while(images[index]){
        const uploadRef = storageRef(storage, `products/${productId}-${images[index].name}`);
        await uploadBytes(uploadRef, images[index])
            .then(() => res = {result: true, msg: "Imágenes subidas correctamente."})
            .catch(err => res.msg = err);
        index += 1;
    }
    return res;
}

const getProductImages = async (productId, imagesNames) => {
    let urls = [];
    let index = 0;
    while(imagesNames[index]){
        const refImg = storageRef(storage, `products/${productId}-${imagesNames[index].name}`);
        await getDownloadURL(refImg)
                .then(url => {
                    urls.push(url);
                })
                .catch(err => console.log(err));
        index += 1;
    }
    return urls;
}

const getProducts = async (lastVisible, order_field = "name", type = "asc") => {
    let q = query(productsRef, orderBy(order_field, type), limit(10));
    if(lastVisible) q = query(productsRef, orderBy(order_field, type), startAfter(lastVisible), limit(10))
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs;
}

const updateStockExistences = async (id, stock) => {
    const product = await getProductById(id);
    const newStock = product.stock + parseInt(stock);
    const productRef = doc(db, collectionName, id);
    await updateDoc(productRef, {
        stock: newStock
    });
}

const deleteImage = async (imageName) => {
    const imgRef = ref(storage, 'products/'+imageName);
    let res = {value: true};
    await deleteObject(imgRef)
            .then(() => {})
            .catch(err => res = {value: false, msg: err});
    return res;
}

const editProduct = async (id, name, short_name, description, category, brand, material, supplierId,
                            sales_unit, cost, price) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
        name: name,
        short_name: short_name,
        description, description,
        category: category,
        brand: brand,
        material: material,
        supplier: supplierId,
        sales_unit: sales_unit,
        cost: cost,
        price: price,
        discount: "Indefinido"
    })
}

const deleteProduct = async id => {
    const product = await getProductById(id);
    let image = product.images;
    if(image && image.imageOne) await deleteImage(`${id}-${image.imageOne.name}`)
    if(image && image.imageTwo) await deleteImage(`${id}-${image.imageTwo.name}`)
    if(image && image.imageThree) await deleteImage(`${id}-${image.imageThree.name}`)
    await deleteDoc(doc(db, collectionName, id));
    await updateProductCount(-1);
}

const stockValidation = async list => {
    for(const element of list) {
        const product = await getProductById(element.id);
        if(element.quantity > product.stock) return product;
    };
    return null;
}

const getAllProducts = async () => {
    let q = query(productsRef, orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs;
}

const getOutOfStockProducts = async () => {
    let q = query(productsRef, where("stock", "==", 0),orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs;
}

export { getProductById, getAllNamesProducts, checkUniqueness, registerProduct, updateImagesURL, getProductImages,
            updateProductCount, uploadProductImages, getProductCount, getProducts, updateStockExistences,
            deleteImage, editProduct, deleteProduct, stockValidation, getAllProducts, getOutOfStockProducts }