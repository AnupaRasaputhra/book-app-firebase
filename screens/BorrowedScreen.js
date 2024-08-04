import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../firebase';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const BorrowedScreen = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const borrowedBooksCollection = collection(db, 'users', userId, 'borrowedBooks');

      const unsubscribe = onSnapshot(borrowedBooksCollection, (snapshot) => {
        const borrowedBooksList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBorrowedBooks(borrowedBooksList);
      });

      return () => unsubscribe();
    }
  }, []);

  const handleReturnBook = async (bookId) => {
    try {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        await deleteDoc(doc(db, 'users', userId, 'borrowedBooks', bookId));
        Alert.alert('Success', 'Book returned successfully.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to return book.');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={borrowedBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
            <Button title="Return Book" onPress={() => handleReturnBook(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 16,
    color: '#555',
  },
});

export default BorrowedScreen;
