const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/api", (req, res) => {
    // res.json({ message: "Hello from server!" });
    var config = require('./test.json');
    res.json(config.firstName+" "+config.lastName)
    // console.log(config.firstName + ' ' + config.lastName);
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});