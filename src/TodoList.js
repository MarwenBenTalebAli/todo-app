import React from "react";
import "./TodoList.css";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FlipMove from "react-flip-move";


function TodoList(props) {
  const todos = props.todos;

  const listItems = todos.map((todo) => {
    return (
      <div className="list" key={todo.key}>
        <p>
          <input
            type="text"
            key={todo.key}
            value={todo.todo}
            onChange={(event) => {
              props.updateTodo(event.target.value, todo.key);
            }}
          />
          <span>
			 <FontAwesomeIcon icon={faTrash} className="faicons" onClick = {() => props.deleteItem(todo.key)} />
         </span>
        </p>
      </div>
    );
  });
  return (
    <div>
      <FlipMove duration={300} easing="ease-in-out">
        {listItems}
      </FlipMove>
    </div>
  );
}

export default TodoList;
