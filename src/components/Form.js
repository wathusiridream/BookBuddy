/*import React , { useState } from "react";
import firebase from '../utils/firebase';
import { getDatabase, ref, push } from '../utils/firebase/database'*/

/*import React, { useState } from "react";
import { ref, push } from "firebase/database";
import { database } from '../utils/firebase';*/

import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from '../utils/firebase';  // Import Firestore instance

/*function Form() {
    const [title, setTitle] = useState('');
  
    const handleOnChange = (e) => {
      setTitle(e.target.value);
    };
  
    const createToDo = () => {
      const todoRef = ref(database, 'Todo');  // Reference to 'Todo' path in the database
      const toDo = {
        title,
        complete: false
      };
      push(todoRef, toDo);  // Push the new to-do into the database
    };
  
    return (
      <div>
        <input type="text" onChange={handleOnChange} value={title} />
        <button className="add-btn" onClick={createToDo}>AddToDo</button>
      </div>
    );
  }*/

function Form() {
    const [title, setTitle] = useState('');
      
        const handleOnChange = (e) => {
          setTitle(e.target.value);
        };
      
        const createToDo = async () => {
          try {
            const todoCollectionRef = collection(db, 'Todo');
            await addDoc(todoCollectionRef, {
              title,
              complete: false
            });
            console.log("ToDo added successfully");
          } catch (error) {
            console.error("Error adding ToDo: ", error);
          }
        };
      
        return (
          <div>
            <input type="text" onChange={handleOnChange} value={title} />
            <button className="add-btn" onClick={createToDo}>AddToDo</button>
          </div>
        );
      }
      
  
  export default Form;