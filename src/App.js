import logo from './logo.svg';
import './App.css';
import TodoList from './todoList/TodoList';
import TodoDetails from './todoDetails/TodoDetails';
import CreateTodoForm from './todoDetails/CreateTodoForm';
import EditTodoForm from './todoDetails/EditTodoForm';
import { useEffect, useState } from 'react';
import todoService from './api/todoApiService';

//Här skapas de olika vyerna som kan visas
const viewModes = {
  view: "View",
  edit: "Edit",
  create: "Create",
};

function App() {
  //Här sätter vi state
  const [todo, setTodo] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState();
  const [completedTodo, setCompletedTodo] = useState();
  const [viewMode, setViewMode] = useState(viewModes.create);

  //Vi skapar en ny todo
  const showCreateForm = () => {
    //Vyn som visas är create
    setViewMode(viewModes.create);
    //Vi sätter vi att ingen todo är markerad
    setSelectedTodo(null);
  }

  //Markerar en todo
  const selectTodo = (todo) => {
    setSelectedTodo(todo);
    //Sätter visningsläge till view
    setViewMode(viewModes.view);
  }

  //Sätter en todo till completed
  const completeTodo = async (completedTodo) => {
        
    setCompletedTodo(completedTodo);
    
    completedTodo.completed = true;
    //Anropar PUT från API:et för att uppdatera
    const compTodo = await todoService.updateTodo(completedTodo.id, completedTodo);
    
    //Sätter visningsläge till view
    setViewMode(viewModes.view);
  }

  //const testArray;

  const handleTodoSave = (newTodo) => {
    //Skapa en kopia av listan och lägger till det senast skapade objektet
    const newArray = [...todo, newTodo];
    //Uppdaterar todo med en ny referens
    setTodo(newArray);
    //Sätter att den nya todon är markerad
    selectTodo(newTodo);
  };

  const handleTodoUpdate = (updatedTodo) => {
    //Skapa en kopia av listan och uppdaterar innehållet
    const newArray = todo.slice();
    for(var i = 0; i < newArray.length; i++){
      if(newArray[i].id === updatedTodo.id){
        newArray[i] = updatedTodo;
        break;
      }
    }
    //
    setTodo(newArray);
    //markerar den uppdaterade todon
    selectTodo(updatedTodo);
  }

  const handleTodoDeleted = (deletedTodo) => {
    //uppdaterar listan. filtrerar ut och visar alla todos förutom den todo som idmatchar den som tagits bort
    setTodo(todo.filter(todo => todo.id !== deletedTodo.id));
    //Den ovan och getTodos gör samma sak, getTodos anropar API vilket kan påverka prestandan
    //getTodos();
    //Anropar en funktion som sätter vyn till create och avmarkerar alla todos
    showCreateForm();

  }

  //Vi hämtar alla todos via getAll på todoService och sparar i variabeln todos 
  const getTodos = async () => {
    const todos = await todoService.getAll();
    setTodo(todos);
  }


  //Listar alla todos
  const showAllTodos = () => {
    console.log("Hej Alla");
    getTodos();
  
    showCreateForm();  
  }

  //Listar todos som inte är klara
  const showNoneCompletedTodos = async () => {
    console.log("Hej Not Completed");

    const todos = await todoService.getAll();
    console.log("Lina");
   
    let test = [];

    for(var i = 0; i < todos.length; i++){
      if(todos[i].completed === false){
        test.push(todos[i]);
        //todos[i] = completedTodo;
      }
    } 

    setTodo(test);
    

    //setTodo(todo.filter(todo => todo.completed === false));
    showCreateForm(); 
  }

  //let listCompleted = [];
  

  //Listar todos som är klara
  const showCompletedTodos = async () => {
    console.log("Hej Completed");
    
    const todos = await todoService.getAll();
    console.log("Tobias");
   
    let test = [];

    for(var i = 0; i < todos.length; i++){
      if(todos[i].completed === true){
        test.push(todos[i]);
        //todos[i] = completedTodo;
      }
    } 

    setTodo(test);

    //setTodo(todo.filter(todo => todo.completed === true));
    showCreateForm();
  }





  /* //Sortera på ålder
  //Sort kommer att ändra ursprungslistan, och vi gör därför en kopia mha slice()
  const sortByDate = todos.slice();

  sortByDate.sort((todo, todo) => {
    //ItemA är äldre än itemB, itemA ska läggas efter B
    if (itemA.age > itemB.age) {
      return 1;
    } else {
      //ItemA läggs före B
      return -1;
    }
  }); 

  //foreach
  const newArray = todo.slice();
    for(var i = 0; i < newArray.length; i++){
      if(newArray[i].id === updatedTodo.id){
        newArray[i] = updatedTodo;*/

  //Körs vid start, med tom beroendelista körs den bara en gång
  useEffect(() => {
    //Hämtar alla todos
    getTodos();
  }, []);

  //Här renderar vi huvudsidan
  const renderMainSection = () => {
    //Om vi inte har en vald todo eller createvyn så visar vi formulär för att skapa en todo
    if(!selectedTodo || viewMode === viewModes.create){
      return (
        <CreateTodoForm
          onCancel={() => setViewMode(viewModes.view)}
          onSave={handleTodoSave} />
      );
    }
    switch (viewMode) {
      case viewModes.view:
        return (
          //
          <TodoDetails
            //Selected todo skickas hit
            todo={selectedTodo} 
            onDelete={handleTodoDeleted}
            onEdit={() => setViewMode(viewModes.edit)} />
        );
      case viewModes.edit:
        return (
          <EditTodoForm
            ////Selected todo skickas hit
            todo={selectedTodo}
            onCancel={() => setViewMode(viewModes.view)}
            onSave={handleTodoUpdate} />
        );
      default:
        return null;
    }
  };


  return (
    <main>
      <aside>
        <h1 className="list-title">
          My Todos
          <button
            id="button-add-todo"
            className="primary"
            onClick={showCreateForm}>
            Add</button>
        </h1>
        <div>
        <h4 className="buttons-filter-todos">
          <button id="button-filter-none"
          onClick={showAllTodos}>
            Show all todos</button>
        </h4>
       
        <h4 className="buttons-filter-todos">
          <button id="button-filter-none-completed"
            onClick={showNoneCompletedTodos}>
            Show what to do</button>
        </h4>
        <h4 className="buttons-filter-todos">
          <button id="button-filter-completed"
            onClick={showCompletedTodos}>
            Show completed</button>
        </h4>
        </div>

        <div>
        <h4 className="buttons-sort-todos">
          <button id="button-sort-oldest-first">
            Show oldest todos first</button>
        </h4>
        <h4 className="buttons-sort-todos">
          <button id="button-sort-newest-first">
            Show newest todos first</button>
        </h4>
        </div>
        
        {/* todo skickas ned hit */}
        <TodoList
        // todo skickas in som props
          todo={todo}
          //ser till att det kommer via props ner i todolist
          selectedTodo={selectedTodo}
          completedTodo={completedTodo}
          //när man klickar på en todo ska den sättas till selected
          //händelse som triggas från todolist, när den blir selected uppdaterar vi state med selectedtodo
          onTodoSelected={selectTodo} 
          onTodoCompleted={completeTodo}
          />
          
      </aside>
      <section>
        {renderMainSection()}
      </section>
    </main>
  );
}

export default App;
