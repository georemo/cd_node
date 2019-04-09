const http = require('http');

const hostname = '0.0.0.0';
const port = 3050;
const url = "mongodb://mongo:27017/mydb";

const server = http.createServer((req, res) => {

  ////////////////////////////

  // var MongoClient = require('mongodb').MongoClient;
  // var url = "mongodb://mongo:27017/mydb";

  // MongoClient.connect(url, function(err, db) {
  //   if (err) throw err;
  //   console.log("Database created!");
  //   db.close();
  // });


  //////////////////////////////
  const {
    MongoClient
  } = require("mongodb");
  //const uri = 'mongodb://mongo:27017'; // mongodb://localhost - will fail

  (async function () {
    try {

      const client = await MongoClient.connect(uri, {
        useNewUrlParser: true
      });
      console.log("connection success");
      // ... anything

      client.close();
    } catch (e) {
      console.log("error encountered while trying to connect");
      console.error(e)
    }

  })()
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});



server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});