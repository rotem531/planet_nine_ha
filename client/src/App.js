import React from "react";
import "./App.css";
import List_comp from "./list_comp.js";
import Form_comp from "./form_comp.js";

function App() {

  const [tasks,setTasks]=React.useState([]);

  React.useEffect(() => {
    PrintAll();
  }, []);

  async function PrintAll(){
    await fetch("http://localhost:3002/tasks")
        .then((res) => res.json())
        .then((dataa) => {setTasks(dataa);});
  } 

  async function DeleteItemById(id) {
    fetch(`http://localhost:3002/tasks/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: 'sdc'})
        });
        PrintAll();
  }
  async function AddItem(val) {
      await fetch('http://localhost:3002/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: val}),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Item added:', data);
      })
      .catch(error => console.error('Error adding item:', error));
      PrintAll();
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <List_comp tasks_list={tasks} DeleteItemById={DeleteItemById}></List_comp>
        <Form_comp addItemToList={AddItem}></Form_comp>
      </header>
    </div>
  );
}

export default App;
