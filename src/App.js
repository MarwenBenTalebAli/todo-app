import React, { useState, useEffect } from "react";
import ListItems from "./TodoList";
import "./App.css";
import { FormControl, InputLabel, Input, Button } from "@material-ui/core";
import db from "./firebase";
import firebase from "firebase";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState({ key: "", todo: "", timestamp: "" });

  /* when the app loads, we need to listen to the database and fetch new todos 
      as they get added/removed */
  useEffect(() => {
    // this code here... fires when the app.js loads
    db.collection("todos")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setTodos(
          snapshot.docs.map((doc) => ({
            key: doc.id,
            todo: doc.data().todo,
            timestamp: doc.data().timestamp,
          }))
        );
      });
  }, [input]);

  const handleInput = (event) =>
    setInput({
      key: Date.now(),
      todo: event.target.value,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

  const addTodo = (event) => {
    event.preventDefault(); /* To stop the refresh */

    db.collection("todos").add(input);

    const newInput = input;
    let items = [];

    if (newInput.todo !== "") {
      items = [...todos, newInput];
    }

    setTodos(items);
    setInput({
      key: "",
      todo: "",
      timestamp: "",
    });
  };

  const deleteTodo = (key) => {
    const filteredItems = todos.filter((item) => item.key !== key);
    setTodos(filteredItems);
    db.collection("todos").doc(key).delete();
  };

  const updateTodo = (todo, key) => {
    const items = todos;
    items.map((item) => {
      if (item.key === key) {
        console.log(item.key + "    " + key);
        item = todo;
      }
      return "";
    });
    setTodos(items);
    db.collection("todos").doc(key).update({
      key: key,
      todo: todo,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };

  return (
    <div className="App">
      <h1>Todo APP</h1>
      <form id="to-do-form" onSubmit={addTodo}>
        <FormControl>
          <InputLabel>Entrez une tâche</InputLabel>
          <Input
            type="text"
            placeholder="Entrez une tâche"
            value={input.todo}
            onChange={handleInput}
          />
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={!input.todo}
          onClick={addTodo}
        >
          AddTodo
        </Button>
      </form>

      <ListItems
        todos={todos}
        deleteItem={deleteTodo}
        updateTodo={updateTodo}
      />
    </div>
  );
}

export default App;
