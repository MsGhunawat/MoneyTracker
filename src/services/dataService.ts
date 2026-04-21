import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Transaction, Account } from "../types";

export const getUserSettings = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data();
  }
  return null;
};

export const updateUserSettings = async (userId: string, data: any) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, data);
};

export const subscribeToTransactions = (userId: string, callback: (transactions: Transaction[]) => void) => {
  const txRef = collection(db, "users", userId, "transactions");
  const q = query(txRef, orderBy("date", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Transaction[];
    callback(transactions);
  });
};

export const subscribeToAccounts = (userId: string, callback: (accounts: Account[]) => void) => {
  const accRef = collection(db, "users", userId, "accounts");
  
  return onSnapshot(accRef, (snapshot) => {
    const accounts = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as Account[];
    callback(accounts);
  });
};

export const addTransaction = async (userId: string, transaction: Transaction) => {
  const txRef = doc(collection(db, "users", userId, "transactions"));
  const newTx = { ...transaction, id: txRef.id };
  await setDoc(txRef, newTx);
  return newTx;
};

export const updateTransaction = async (userId: string, transaction: Transaction) => {
  const txRef = doc(db, "users", userId, "transactions", transaction.id);
  await updateDoc(txRef, { ...transaction });
};

export const deleteTransaction = async (userId: string, transactionId: string) => {
  const txRef = doc(db, "users", userId, "transactions", transactionId);
  await deleteDoc(txRef);
};

export const addAccount = async (userId: string, account: Account) => {
  const accRef = doc(collection(db, "users", userId, "accounts"));
  const newAcc = { ...account, id: accRef.id };
  await setDoc(accRef, newAcc);
  return newAcc;
};

export const updateAccount = async (userId: string, account: Account) => {
  const accRef = doc(db, "users", userId, "accounts", account.id);
  await updateDoc(accRef, { ...account });
};
