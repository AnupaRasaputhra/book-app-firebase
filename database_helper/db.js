import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export const fetchBooks = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'books'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching books: ', error);
    throw error;
  }
};

export const fetchBorrowedBooks = async (userId) => {
  try {
    const snapshot = await getDocs(collection(db, 'users', userId, 'borrowedBooks'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching borrowed books: ', error);
    throw error;
  }
};
