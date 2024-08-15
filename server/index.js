const express = require("express");
const redis = require("redis");
const fs = require('fs');


const PORT = process.env.PORT || 3001;
const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);
client.on('error', err => console.log('Redis Client Error', err));
console.log(`on`);
client.connect();
console.log(`connected`);

const app = express();
app.use(express.json());



let tasks=[];

async function saveRedisDataToJson() {
  console.log("inside save to json");
  try {
      // client.on('error', err => console.log('Redis Client Error', err));
      // await client.connect();
      const userSession = await client.hGetAll('user-session:123');
      // const userSession = await client.hGetAll();
      console.log(JSON.stringify(userSession));
      fs.writeFileSync('server/tasksJson.json', JSON.stringify(userSession, null, 2));
    // console.log("finish save to json");
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

      // console.log(`loaded from json to redis ${JSON.stringify(jsonData)}`)
      for (const key in jsonData) {
        // console.log(`loading ${key}: ${jsonData[key]} to redis`);
        client.hSet('user-session:123',key,jsonData[key]);
      }
    });
  }
loadJsonToRedis();

function getKeyByTime(){
  var now= new Date();
  return `${now.getFullYear()}${now.getMonth()+1}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}${now.getMilliseconds()}`;
}

async function deleteTaskRedis(taskId){
  console.log(`inside delete task redis`);
  // client.on('error', err => console.log('Redis Client Error', err));
  // await client.connect();
  try{
    await client.hDel('user-session:123',taskId);
    await saveRedisDataToJson();
  }
  catch(err){console.log(err);}
  // finally{client.quit();}
  console.log(`finished delete ${taskId} task from redis`);

}



app.get('/tasks', async (req, res) => {
  // console.log("entered get");
  try{
    // client.on('error', err => console.log('Redis Client Error', err));
    // await client.connect();
    const userSession = await client.hGetAll('user-session:123');
    // client.quit();
    
    let dataAsJson=JSON.stringify(userSession, null, 2);
    res.json(Object.entries(JSON.parse(dataAsJson)));
    // res.json(userSession);
    // console.log(`GET returns ${Object.entries(JSON.parse(dataAsJson))[0][0]}`)
  }
  catch (err){console.log(`error with GET ${err}`);}

  });
  
  // POST endpoint to add a new item
  app.post('/tasks', async (req, res) =>{
    // console.log("inside post");
    // console.log(req.body);
    const val = req.body.name;
    if (val === undefined){
      console.log(`couldnt POST, value issue, value is ${val}`);
      return;
    }
    const key=getKeyByTime();
    // client.on('error', err => console.log('Redis Client Error', err));
    // await client.connect();
    await client.hSet('user-session:123',key, val).then(()=>{
      saveRedisDataToJson();
    });
    // client.quit();
    // console.log(`val is ${val}`)
    // console.log(`key is ${key}`)

    res.json(key);
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