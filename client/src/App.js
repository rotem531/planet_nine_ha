import React from "react";
import "./App.css";

function App() {
  const [text, setText] = React.useState('');

  React.useEffect(() => {
    PrintAll();
  }, []);

  // Handler to update state when the input changes
  const handleChange = (event) => {
    setText(event.target.value);
  };

  async function AddItem() {

    // console.log("entered");

    console.log("after e.preventDefault();");
    
  
      await fetch('http://localhost:3002/tasks', {
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
  const [tasks, setTasks] = React.useState([]);


  async function PrintAll(){
    await fetch("http://localhost:3002/tasks")
        .then((res) => res.json())
        .then((dataa) => {setTasks(dataa); console.log(dataa);});
        // console.log(`data is ${data}`);
        setTexti(`${tasks.length}`);
  }


  async function DeleteItem(){
    // const idToDelete="1";
    // console.log("STARTED DELETE");
    fetch(`http://localhost:3002/tasks/${selectedItem}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'sdc'})
    });
    // console.log("FINISHED DELETE");
    PrintAll();
  }
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [texti, setTexti] = React.useState("addItem");
  const handleSelectItem = (event) => {
    setSelectedItem(event.target.value);
    console.log(event.target.value);
  };


  return (
    <div className="App">
      <header className="App-header">
        <div id="list_div">
          <ul>
            {tasks.map((item) => (
              <li key={item[0]}>
                <label>
                  <input className="radios"
                    type="radio"
                    name="radios"
                    value={item[0]}
                    checked={selectedItem === item[0]}
                    onChange={handleSelectItem}
                  />
              {item[1]}
            </label>
              </li>
            ))}
          </ul>
        </div>
        <div id="actions_div">
          <button className="Form" onClick={AddItem} type="button">add task</button>
          <input className="Form"
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Enter some text"
          />
          <button className="Form" onClick={DeleteItem} type="button">delete</button>
          <button className="Form" onClick={PrintAll} type="button">print</button>
          
        </div>
        
      </header>
    </div>
  );
}

export default App;
