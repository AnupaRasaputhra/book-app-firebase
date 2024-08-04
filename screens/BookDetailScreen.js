import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc, addDoc, collection, getDocs } from 'firebase/firestore';

const BookDetailScreen = ({ route }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    const fetchBook = async () => {
      const bookDoc = doc(db, 'books', bookId);
      const bookSnapshot = await getDoc(bookDoc);
      if (bookSnapshot.exists()) {
        setBook(bookSnapshot.data());
      }
    };

    fetchBook();
  }, [bookId]);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const borrowedBooksCollection = collection(db, 'users', userId, 'borrowedBooks');
        const borrowedBooksSnapshot = await getDocs(borrowedBooksCollection);
        const borrowedBooksList = borrowedBooksSnapshot.docs.map(doc => doc.data());
        setBorrowedBooks(borrowedBooksList);
      }
    };

    fetchBorrowedBooks();
  }, []);

  const handleBorrow = async () => {
    if (borrowedBooks.length >= 3) {
      Alert.alert('Borrowing Limit Exceeded', 'You can only borrow up to 3 books at a time.');
      return;
    }

    try {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const borrowedBooksCollection = collection(db, 'users', userId, 'borrowedBooks');
        await addDoc(borrowedBooksCollection, book);
        Alert.alert('Success', 'Book borrowed successfully.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to borrow book.');
    }
  };

  if (!book) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: book.coverUrl }} style={styles.cover} />
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>{book.author}</Text>
      <Text style={styles.rating}>Rating: {book.rating}</Text>
      <Text style={styles.summary}>{book.summary}</Text>
      <Button title="Borrow Book" onPress={handleBorrow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cover: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 18,
    color: '#555',
  },
  rating: {
    fontSize: 18,
    color: '#555',
  },
  summary: {
    fontSize: 16,
    marginVertical: 20,
  },
});

export default BookDetailScreen;
