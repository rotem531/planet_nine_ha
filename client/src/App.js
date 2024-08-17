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
      // PrintAll();
  }

  


  // seth2Content("nothing");
  const [data, setData] = React.useState(null);
  // let tasks=[["1","first"],["2","sec"]];
  const [tasks, setTasks] = React.useState([]);


  async function PrintAll(){
    await fetch("http://localhost:3002/tasks")
        .then((res) => res.json())
        .then((dataa) => {setTasks(dataa); console.log(dataa);});
  }  

  // async function DeleteItem(){
  //   // const idToDelete="1";
  //   // console.log("STARTED DELETE");
  //   fetch(`http://localhost:3002/tasks/${selectedItem}`, {
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ name: 'sdc'})
  //   });
  //   // PrintAll();
  // }
  async function DeleteItemById(id) {
    fetch(`http://localhost:3002/tasks/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: 'sdc'})
        });
        // PrintAll();
  }
  async function handleButtonClick(id) {
    DeleteItemById(id);
  }


  return (
    <div className="App">
      <header className="App-header">
        <div id="list_div">
          <ul>
            {tasks.map((item) => (
              <li key={item[0]}>
                <label>
                  {/* <input className="radios"
                    type="radio"
                    name="radios"
                    value={item[0]}
                    checked={selectedItem === item[0]}
                    onChange={handleSelectItem}
                  /> */}
              <button className= "del-buttons" onClick={() => handleButtonClick(item[0])}>X</button>
              {item[1]}
            </label>
              </li>
            ))}
          </ul>
        </div>
        <div id="actions_div">
          <div id="add_item_div">
            <button className="Form" onClick={AddItem} type="button">add task</button>
            <input className="Form"
            type="text"
            value={text}
            onChange={handleChange}
            placeholder="Enter some text"
            />
          </div>
          <button className="Form" onClick={PrintAll} type="button">refresh</button>
          
        </div>
        
      </header>
    </div>
  );
}

export default App;
