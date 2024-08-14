import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [h2Content, seth2Content] = React.useState('nothing');
  

  const AddItem = () => {
    // h2Content="trying";
    // const [name, setName] = React.useState('');
    console.log("entered");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
    };
    console.log("after e.preventDefault();");
    
  
      fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'רםמ'}),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Item added:', data);
      })
      .catch(error => console.error('Error adding item:', error));
      console.log("end");
  }

  


  // seth2Content("nothing");
  const [data, setData] = React.useState(null);
  async function PrintAll(){
    seth2Content("printing");
    
    await fetch("/tasks")
        .then((res) => res.json())
        .then((dataa) => setData(dataa));
        // data.forEach(element => {
          
        // });
        console.log(`data is ${data}`);
        seth2Content(data);

  }
  function DeleteItem(){
    const idToDelete="1";
    fetch(`/tasks/${idToDelete}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'sdc'})
    })
    .then(response => response.json())
    .then(data => {
      console.log('Item added:', data);
    })
    .catch(error => console.error('Error adding item:', error));

  }

  


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
        <button onClick={AddItem} type="button">add item</button>
        <button onClick={DeleteItem} type="button">delete</button>
        <button onClick={PrintAll} type="button">print</button>
        <h2 id="2">{h2Content}</h2>
      </header>
    </div>
  );
}

export default App;
