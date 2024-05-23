import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import db from "./firebase";

const storage = getStorage();

export const uploadImage = async (file) => {
    const storageRef = ref(storage, `imagens/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};

export const deleteImage = async (imageUrl) => {
    if (!imageUrl) {
        console.error("Image URL is undefined");
        return;
    }
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
};

export const addProduto = async (produto) => {
    try {
        const docRef = await addDoc(collection(db, "produtos"), produto);
        return docRef.id;
    } catch (e) {
        console.error("Erro ao adicionar produto: ", e);
    }
};

export const getProdutos = async () => {
    const querySnapshot = await getDocs(collection(db, "produtos"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteProduto = async (produtoId) => {
    try {
        await deleteDoc(doc(db, "produtos", produtoId));
    } catch (e) {
        console.error("Erro ao deletar produto: ", e);
    }
};

export const addOferta = async (oferta) => {
    try {
        const docRef = await addDoc(collection(db, "ofertas"), oferta);
        return docRef.id;
    } catch (e) {
        console.error("Erro ao adicionar oferta: ", e);
    }
};

export const getOfertas = async () => {
    const querySnapshot = await getDocs(collection(db, "ofertas"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteOferta = async (ofertaId) => {
    try {
        await deleteDoc(doc(db, "ofertas", ofertaId));
    } catch (e) {
        console.error("Erro ao deletar oferta: ", e);
    }
};