import React from "react";
import "./App.css";

function List_comp({tasks_list,DeleteItemById}){

    

    async function handleButtonClick(id) {
        DeleteItemById(id);
      }

    return(
        <div id="list_div">
          <ul>
            {tasks_list.map((item) => (
              <li key={item[0]}>
                <label>
                    <button className= "del-buttons" onClick={() => handleButtonClick(item[0])}>X</button>
                    {item[1]}
                </label>
              </li>
            ))}
          </ul>
        </div>
    )
}

export default List_comp;