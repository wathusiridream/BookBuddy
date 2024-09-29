import React from "react";
import { db } from '../utils/firebase'; 
import firebase from "firebase/compat/app";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";


function Todo ({ todo }) {
    const deleteTodo = async () => {
        try {
            const todoRef = doc(db, 'Todo', todo.id); // Get a reference to the document
            await deleteDoc(todoRef); // Delete the document
        } catch (error) {
            console.error("Error deleting todo: ", error);
        }
    }

    // Toggle the completion status of a todo
    const completeTodo = async () => {
        try {
            const todoRef = doc(db, 'Todo', todo.id); // Get a reference to the document
            await updateDoc(todoRef, {
                complete: !todo.complete // Toggle the 'complete' field
            });
        } catch (error) {
            console.error("Error updating todo: ", error);
        }
    }
    return (
        <div>
            <h3 className={todo.complete ? 'complete' : ''}>{todo.title} {todo.complete ? "Completed" : "Incomplete"}</h3>
            <button className="delete-btn" onClick={deleteTodo}>Delete</button>
            <button className="complete-btn" onClick={completeTodo}>Complete</button>
        </div>
    );
 }
 
 export default Todo;
