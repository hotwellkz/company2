import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, query, where, getDocs, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAICwewb9nIfENQH-gOJgkpQXZKBity9ck",
  authDomain: "accounting-c3c06.firebaseapp.com",
  projectId: "accounting-c3c06",
  storageBucket: "accounting-c3c06.firebasestorage.app",
  messagingSenderId: "670119019137",
  appId: "1:670119019137:web:f5c57a1a6f5ef05c720380"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface CategoryData {
  title: string;
  amount: string;
  icon: string;
  color: string;
  row?: number;
}

export interface ContractData {
  id?: string;
  clientId: string;
  clientNumber: string;
  clientName: string;
  clientLastName: string;
  contractNumber: string;
  contractType: string;
  createdAt: Date;
  totalAmount: number;
  content: string;
  firstName: string;
  lastName: string;
  middleName: string;
  iin: string;
  constructionAddress: string;
  livingAddress: string;
  phone: string;
  email: string;
  constructionDays: number;
  deposit: number;
  firstPayment: number;
  secondPayment: number;
  thirdPayment: number;
  fourthPayment: number;
}

export const addCategory = async (category: CategoryData) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), category);
    console.log('Category added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const updateCategory = async (categoryId: string, category: CategoryData) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, category);
    console.log('Category updated:', categoryId);
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const addContract = async (contractData: ContractData) => {
  try {
    const docRef = await addDoc(collection(db, 'contracts'), contractData);
    console.log('Contract added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding contract:', error);
    throw error;
  }
};

export const updateContract = async (contractId: string, contractData: Partial<ContractData>) => {
  try {
    const contractRef = doc(db, 'contracts', contractId);
    await updateDoc(contractRef, contractData);
    console.log('Contract updated:', contractId);
  } catch (error) {
    console.error('Error updating contract:', error);
    throw error;
  }
};

export const deleteClientContracts = async (clientId: string) => {
  try {
    const q = query(collection(db, 'contracts'), where('clientId', '==', clientId));
    const querySnapshot = await getDocs(q);
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log('Contracts deleted for client:', clientId);
  } catch (error) {
    console.error('Error deleting contracts:', error);
    throw error;
  }
};

export { db };