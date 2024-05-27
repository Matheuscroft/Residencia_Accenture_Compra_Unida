import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import db from "./firebase";

const storage = getStorage();

export const uploadImagem = async (file) => {
    const storageRef = ref(storage, `imagens/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};

export const deletarImagem = async (imageUrl) => {
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

export const editarProduto = async (produtoId, novoProduto) => {
    try {
        const produtoAtual = doc(db, "produtos", produtoId);
    
        await updateDoc(produtoAtual, novoProduto);
        
        console.log("Produto atualizado com sucesso!");
    } catch (e) {
        console.error("Erro ao atualizar produto: ", e);
    }
};

export const deletarProduto = async (produtoId) => {
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

export const editarOferta = async (ofertaId, novaOferta) => {
    try {
        const ofertaAtual = doc(db, "ofertas", ofertaId);
    
        await updateDoc(ofertaAtual, novaOferta);
        
        console.log("Oferta atualizada com sucesso!");
    } catch (e) {
        console.error("Erro ao atualizar oferta: ", e);
    }
};

export const deletarOferta = async (ofertaId) => {
    try {
        await deleteDoc(doc(db, "ofertas", ofertaId));
    } catch (e) {
        console.error("Erro ao deletar oferta: ", e);
    }
};