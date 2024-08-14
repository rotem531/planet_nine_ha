const express = require("express");
const redis = require("redis");
const fs = require('fs');
// const { promisify } = require('util');


const PORT = process.env.PORT || 3001;
const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);

const app = express();
app.use(express.json());


let tasks=[];

// app.get("/tasks", (req, res) => {
//     // res.json({ message: "Hello from server!" });
//     var config = require('./test.json');
//     res.json(config.firstName+" "+config.lastName)
//     // console.log(config.firstName + ' ' + config.lastName);
//   });

// app.get("/api", (req, res) => {
//     // res.json({ message: "Hello from server!" });
//     var config = require('./test.json');
//     res.json(config.firstName+" "+config.lastName)
//     // console.log(config.firstName + ' ' + config.lastName);
//   });


async function getTasks(req,res,next) {
  try{
    console.log('getting tasks')

    const values = await client.mGet(await client.keys('*'));
  }
  catch(err){
    console.error(err);
    redis.status(500);
  }
}

async function loadJsonToRedis(){
  fs.readFile('server/tasksJson.json', 'utf8', async (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }
  
    const jsonData = JSON.parse(data);
    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();

    await client.hSet('user-session:123', jsonData);

    // for (const key in jsonData) {
    //   // console.log(`${key}: ${jsonData[key]}`);
    //   await client.set(key,jsonData[key]);
    //   console.log(`loaded to redis ${key}:${jsonData[key]}`);
    //   // console.log(await client.get(key));
    // } 



  
    // Store JSON object as a Redis hash
    // client.hSet('user:1', jsonData, (err, reply) => {
    //   if (err) {
    //     console.error('Error storing data in Redis hash:', err);
    //   } else {
    //     console.log('Data stored in Redis hash:', reply);
    //   }
  
    //   client.quit();
    // });
    // try {
    //   // Store JSON data as a Redis hash using hset
    //   const reply = await hsetAsync(hashKey, newData);
    //   console.log('Data stored in Redis hash:', reply);
    // } catch (err) {
    //   console.error('Error storing data in Redis hash:', err);
    // } finally {
    //   client.quit(); // Close the Redis connection after all operations are done
    // }
  });
  }
loadJsonToRedis();

function getKeyByTime(){
  var now= new Date();
  return `${now.getFullYear()}+${now.getMonth()+1}+${now.getDate()}+${now.getHours()}+${now.getMinutes()}+${now.getSeconds()}+${now.getMilliseconds()}`;
}

function addToJson(key,val){
  fs.readFile('server/tasksJson.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }
  
    // Parse the existing tasks
    let tasks = JSON.parse(data);
  
    // Create a new task
    const newTask = {
      [key]: val
    };
  
    // Add the new task to the array
    tasks={...tasks,...newTask};
  
    // Write the updated tasks array back to the JSON file
    fs.writeFile('server/tasksJson.json', JSON.stringify(tasks, null, 2), (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('New task added to tasks.json');
      }
    });
  });
}


function deleteTaskById(taskId) {
  console.log(`task id to delete is ${taskId}`);
  // Read the existing tasks from the JSON file
  fs.readFile('server/tasksJson.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    // Parse the existing tasks
    let tasks = JSON.parse(data);

    // Filter out the task with the given id
    const updatedTasks = tasks.filter(task => task.id !== taskId);

    // Write the updated tasks array back to the JSON file
    fs.writeFile('server/tasksJson.json', JSON.stringify(updatedTasks, null, 2), (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log(`Task with id ${taskId} has been deleted`);
      }
    });
  });
}



app.get('/tasks', async (req, res) => {
  // fs.readFile('server/tasksJson.json', 'utf8', (err, data) => {
  //   if (err) {
  //     console.error('Error reading the file:', err);
  //     return;
  //   }
  
  //   // Parse the JSON data
  //   const jsonData = JSON.parse(data);
  
  //   // Initialize an empty array to hold values of "val"
  //   tasks = [];
  
  //   // Iterate through each item in the array and collect "val"
  //   jsonData.forEach(item => {
  //     if (item.description) {
  //       tasks.push(item.description);
  //     }
  //   });
  
  //   // Print or use the values list
  //   console.log(tasks); // Output: ['A', 'B', 'C']
  // });
  
  // const keys=client.keys();
  tasks = [];
  console.log("entered get");
  let userSession = await client.hGetAll('user-session:123');
  console.log(`user session type is ${typeof(userSession)}`);
  let dataAsJson=JSON.stringify(userSession, null, 2);
  console.log(dataAsJson);
  for (const key in userSession) {
    tasks.push(userSession[key]);
    console.log(`pushing ${key}:${userSession[key]}`);
    
  }
    // console.log(typeof(dataAsJson));
    res.json(tasks);
  });
  
  // POST endpoint to add a new item
  app.post('/tasks', async (req, res) =>{
    console.log(req.body);
    var val = req.body.name;
    if (val === undefined){
      val="rotem";
    }
    const key=getKeyByTime();
    console.log(`val is ${val}`)
    console.log(`key is ${key}`)
    
    addToJson(key,val);
    
    res.json(key);
    

    

    // client.on('error', (err) => {
    //   console.error('Error connecting to Redis:', err);
    // });
    // console.log("reached post nodejs")
    // const val = req.body;

    // const key=getKeyByTime();
    // console.log(`key is ${key}`);
    // console.log(`val is ${val}`);
    // try {
    //   await client.set(key, val);
    //   console.log(`Added key: ${key} with value: ${value}`);
    // } catch (err) {
    //   console.error('Error setting key in Redis:', err);
    // }
    // res.json(key);
    // client.quit();
    // save in json
  });
  
  // DELETE endpoint to remove an item by ID
  app.delete('/tasks/:id', async (req, res) => {
    const { key } = req.params;
    // const itemIndex = items.findIndex(item => item.id === id);
    
    // if (itemIndex !== -1) {
    //   const deletedItem = items.splice(itemIndex, 1);
    //   res.json(deletedItem);
    //   // save in cache
    // // save in json
    // } else {
    //   res.status(404).json({ message: "Item not found" });
    // }

    console.log("inside delete nodejs");
    console.log(req.params);
    deleteTaskById(req.params.id);




    // try {
    //   const result = await client.del(key);
      
    //   if (result === 1) {
    //     console.log(`Key ${key} deleted successfully`);
    //   } else {
    //     console.log(`Key ${key} does not exist`);
    //   }
    // } catch (err) {
    //   console.error('Error deleting key from Redis:', err);
    // }
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});