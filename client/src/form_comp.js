import React from "react";
import "./App.css";

function Form_comp({addItemToList}){

    const [task,setTask]=React.useState();
    const handleChange = (event) => {
        setTask(event.target.value);
    };

    async function AddItem() {
        addItemToList(task);
    }

      return (
        <div id="add_item_div">
            <button className="Form" onClick={AddItem} type="button">add task</button>
            <input className="Form"
                type="text"
                onChange={handleChange}
            placeholder="Enter some text"
            />
          </div>
      )
}

export default Form_comp;