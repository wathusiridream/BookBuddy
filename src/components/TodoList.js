import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../utils/firebase';  // Import Firestore instance
import Todo from './Todo'; // Assuming Todo is another component to display each todo

function TodoList() {
    const [todoList, setTodoList] = useState([]);  // Set initial state as an empty array

    useEffect(() => {
        // Firestore reference to the 'Todo' collection
        const todoRef = collection(db, 'Todo');

        // Listen for real-time updates with Firestore's onSnapshot
        const unsubscribe = onSnapshot(todoRef, (snapshot) => {
            const todos = snapshot.docs.map((doc) => ({
                id: doc.id, 
                ...doc.data()   // Get data from each document
            }));
            setTodoList(todos);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <div>
            {todoList.length > 0 
                ? todoList.map((todo, index) => (
                    <Todo key={index} todo={todo} />  // Map through todoList and pass 'todo' as a prop
                ))
                : "No Todos available"}
        </div>
    );
}

export default TodoList;
