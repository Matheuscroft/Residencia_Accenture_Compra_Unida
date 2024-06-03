import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {db, auth} from "./firebase";

export const register = async (email, password, userType) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await setDoc(doc(db, 'usuarios', user.uid), {
      email: user.email,
      userType: userType
    });
    console.log('Usuário registrado com sucesso!');
  } catch (error) {
    console.error('Erro ao registrar usuário: ', error);
  }
};

export const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      if (userDoc.exists()) {
        const userType = userDoc.data().userType;
        console.log('Usuário logado com sucesso!');
        return userType;
      } else {
        throw new Error('User not found in Firestore');
      }
    } catch (error) {
      console.error('Erro ao logar usuário: ', error);
      return null;
    }
  };

export const logout = async () => {
  try {
    await signOut(auth);
    console.log('Usuário deslogado com sucesso!');
  } catch (error) {
    console.error('Erro ao deslogar usuário: ', error);
  }
};
