import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [h2Content, seth2Content] = React.useState('nothing');
  const [text, setText] = React.useState('');

  // Handler to update state when the input changes
  const handleChange = (event) => {
    setText(event.target.value);
  };

  async function AddItem() {
    
    // h2Content="trying";
    // const [name, setName] = React.useState('');
    console.log("entered");
  
    // const handleSubmit = (e) => {
    //   e.preventDefault();
      
    // };
    console.log("after e.preventDefault();");
    
  
      await fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: text}),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Item added:', data);
      })
      .catch(error => console.error('Error adding item:', error));
      PrintAll();
  }

  


  // seth2Content("nothing");
  const [data, setData] = React.useState(null);
  // let tasks=[["1","first"],["2","sec"]];
  const [tasks, setTasks] = React.useState([["1","first"],["2","sec"]]);


  async function PrintAll(){
    seth2Content("fetching");
    
    await fetch("/tasks")
        .then((res) => res.json())
        .then((dataa) => setTasks(dataa));
        // data.forEach(element => {
          
        // });
        console.log(`data is ${data}`);
        
        // setTasks(data);
        seth2Content(tasks);
        seth2Content("finished");

  }
  async function DeleteItem(){
    // const idToDelete="1";
    console.log("STARTED DELETE");
    fetch(`/tasks/${text}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'sdc'})
    });
    console.log("FINISHED DELETE");
    PrintAll();
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
        <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Enter some text"
        />
        <ul>
        {tasks.map((item) => (
          <li key={item[0]}>
            <input
                type="radio"
                value={item}
                // checked={selectedItem === item}
                // onChange={handleSelectItem}
              />
            {item[1]}
          </li>
        ))}
      </ul>
      </header>
    </div>
  );
}

export default App;
