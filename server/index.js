const express = require("express");
const redis = require("redis");
const fs = require('fs');
// const { promisify } = require('util');


const PORT = process.env.PORT || 3001;
const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);
client.on('error', err => console.log('Redis Client Error', err));
console.log(`on`);
client.connect();
console.log(`connected`);

const app = express();
app.use(express.json());

// const keysAsync = promisify(client.keys).bind(client);
// const hgetallAsync = promisify(client.hgetall).bind(client);


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

// async function saveRedisToJson(){
//   var r = {};

//   client.keys('*', function(err, keys) {
//     async.each(keys, function(key, callback) {
//       client.get(key, function(err, value) {
//         r[key] = value;
//         callback(err);
//       });
//     }, function() {
//       // when callback is finished
//       console.log(JSON.stringify(r));
//       client.quit();
//     });
//   });
//   if (r){
//     fs.writeFile('server/tasksJson.json', JSON.stringify(r, null, 2), (err) => {
//       if (err) {
//         console.error('Error writing to file:', err);
//       } else {
//         console.log(`saved json`);
//       }
//     });
//   }
// }

async function saveRedisDataToJson() {
  console.log("inside save to json");
  try {
    // client.on('error', err => console.log('Redis Client Error', err));
    // await client.connect();
    const userSession = await client.hGetAll('user-session:123');
    // const userSession = await client.hGetAll();
    console.log(JSON.stringify(userSession));
    fs.writeFileSync('server/tasksJson.json', JSON.stringify(userSession, null, 2));


  //   const keys = await keysAsync('*'); // Get all keys
  //   const data = {};

  //   for (const key of keys) {
  //     // const type = await promisify(client.type).bind(client)(key);

  //     data[key] = await hgetallAsync(key);
  //   }

  //   // Write data to a JSON file
  //   fs.writeFileSync('server/tasksJson.json', JSON.stringify(data, null, 2));

  //   console.log('Redis data saved to redis-data.json');
  // } catch (err) {
  //   console.error('Error saving Redis data to JSON:', err);
  // } finally {
  //   client.quit(); // Close the Redis connection
  // }


  // let data={};
    // client.on('error', err => console.log('Redis Client Error', err));
    // await client.connect();
  //   client.keys('*', (err, keys) => {
  //     if (err) throw err;
  //     keys.forEach(key => {
  //       client.get(key, (err, value) => {
  //         if (err) throw err;
  //         console.log(`FORSAVIG key is ${key} val is ${value}`);
  //         data[key]=value;
  //       });
  //     })

  //   }).then(()=>{
  //     console.log(`data to save is ${data}`);
  //     fs.writeFileSync('server/tasksJson.json', JSON.stringify(data, null, 2));
  //     console.log("saved json");
  //   });
    
  // }
  // catch(err){console.log('Error saving Redis data to JSON:', err);}
  // finally{client.quit();}
  console.log("finish save to json");
  }
  catch(err){console.log('Error saving Redis data to JSON:', err);}
  // finally{client.quit();}
}

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
    // client.on('error', err => console.log('Redis Client Error', err));

    // await client.connect();

    // await client.hSet('user-session:123', jsonData);
    console.log(`loaded from json to redis ${JSON.stringify(jsonData)}`)
    // await client.hSet(jsonData);
    for (const key in jsonData) {
      console.log(`loading ${key}: ${jsonData[key]} to redis`);
      client.set(key,jsonData[key]);
    }


    // client.quit();

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

async function deleteTaskRedis(taskId){
  console.log(`inside delete task redis`);
  // client.on('error', err => console.log('Redis Client Error', err));
  // console.log(`on`);
  // await client.connect();
  // console.log(`connected and task id is ${taskId}`);
  try{
    await client.hDel('user-session:123',taskId);
    await saveRedisDataToJson();
  }
  catch(err){console.log(err);}
  // finally{client.quit();}
  console.log(`finished delete ${taskId} task from redis`);

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
  try{
    // client.on('error', err => console.log('Redis Client Error', err));
    // await client.connect();
    const userSession = await client.hGetAll('user-session:123');
    // client.quit();
    // const userSession = await client.hGetAll();
    console.log(`user session type is ${typeof(userSession)}`);
    let dataAsJson=JSON.stringify(userSession, null, 2);
    console.log(dataAsJson);
    for (const key in userSession) {
      tasks.push(userSession[key]);
      console.log(`pushing ${key}:${userSession[key]}`);
      
    }
      // console.log(typeof(dataAsJson));
      res.json(Object.entries(JSON.parse(dataAsJson)));
      console.log(`GET returns ${Object.entries(JSON.parse(dataAsJson))[0][0]}`)
  }
  catch (err){console.log(`error with GET ${err}`); res.json({"didnt":"didnt work"});}

  });
  
  // POST endpoint to add a new item
  app.post('/tasks', async (req, res) =>{
    console.log("inside post");
    console.log(req.body);
    const val = req.body.name;
    if (val === undefined){
      val="rotem";
    }
    const key=getKeyByTime();
    // client.on('error', err => console.log('Redis Client Error', err));
    // await client.connect();
    await client.hSet('user-session:123',key, val).then(()=>{
      saveRedisDataToJson();
    });
    const value  = await client.get(key);  
    // client.quit();
    // await saveRedisDataToJson();
    console.log(`val is ${value}`)
    console.log(`key is ${key}`)
    
    // addToJson(key,val);
    
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

    console.log("inside delete nodejs");
    console.log(req.params);
    await deleteTaskRedis(req.params.id);
    console.log("LEAVING DELETE");
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});