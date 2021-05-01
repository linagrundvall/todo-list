import React, { useState } from "react";
import todoService from "../api/todoApiService";

//Formulär för att skapa todo

const CreateTodoForm = (props) => {
  const {onCancel, onSave} = props;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [created, setCreated] = useState("");
  const [updated, setUpdated] = useState("");
  const isValid = title !== "";

  const handleSave = async () => {
    if (isValid && onSave) {
      //Skapa ny todo, input till api
      const newTodo = {
        title: title,
        description: description,
        created: created,
        updated: updated,
      };

      //Skapar ett nytt datum för created och omvandlar den till en string
      const newDate = new Date(newTodo.created).toLocaleString();
  
      newTodo.created = newDate;

      //Skapar ett nytt datum för updated och omvandlar den till en string
      const updatedDate = new Date(newTodo.updated).toLocaleString();

      newTodo.updated = newDate;
     
      //Det vi får tillbaka från api:et
      const createdTodo = await todoService.createTodo(newTodo);
      //Rensa formuläret
      setTitle("");
      setDescription("");
      
      // Skickar uppåt till App mha onSave
      onSave(createdTodo);
    }
  };

  

    return (
        <form id="todo-form">
          <h2>Create todo</h2>
          <label>Title</label>
          <input 
            name="title" 
            required value={title} 
            onChange={(e) => setTitle(e.target.value)} />
          <label>Description</label>
          <textarea 
            name="description" 
            rows="3" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            >Todo Description</textarea
          ><br />
          <button 
            type="button" 
            className="link-button" 
            onClick={onCancel}>Cancel</button>
          <button 
            type="button" 
            className="primary" 
            onClick={handleSave} 
            disabled={!isValid}>Save</button>
        </form>
    );
};

export default CreateTodoForm;