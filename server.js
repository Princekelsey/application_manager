const express = require("express");

const bodyParser = require("body-parser");
const morgan = require("morgan");
const { Client } = require("pg");
require("dotenv").config();

// intiallize app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// POST ROUTE TO THE DATABASE TO REGISTER NEW APPLICATION
app.post("/api/newData", (req, res) => {
  const client = new Client();
  client
    .connect()
    .then(() => {
      console.log("connection complete");
      const sql = `INSERT INTO "Application Data" ( "Application_id", "First Name", "Last Name", "Occupation", "Application") VALUES ($1, $2, $3, $4, $5)`;
      const params = [
        req.body.application_id,
        req.body.first_Name,
        req.body.last_Name,
        req.body.occupation,
        req.body.application
      ];
      console.log("Data Inserted");
      res.status(202).send({ msg: "Data insert Successful" });
      return client.query(sql, params);
    })
    .catch(err => {
      console.log("error", err);
      res.status(404).send({ msg: "Error inserting data" });
    });
});

// EDIT ROUTE TO THE DATEBASE TO EDIT AN APPLICATION
app.post("/api/edit/:id", (req, res) => {
  const client = new Client();
  client
    .connect()
    .then(() => {
      console.log("connection complete");
      const sql = `UPDATE "Application Data"
      SET "First Name"=$1, "Last Name"=$2, "Occupation"=$3, "Application"=$4
      WHERE "Application_id" = $5`;
      const params = [
        req.body.first_Name,
        req.body.last_Name,
        req.body.occupation,
        req.body.application,
        req.params.id
      ];
      console.log("Data Updated");
      res.status(202).send({ msg: "Data Update Successful" });
      return client.query(sql, params);
    })
    .catch(err => {
      console.log("error", err);
      res.status(404).send({ msg: "Error inserting data" });
    });
});

//GET REQUEST ROUTE TO GET ALL THE OCCUPATION DATA
app.get("/api/occupation", (req, res) => {
  const client = new Client();
  const sql = `SELECT  * FROM occupations`;
  client
    .connect()
    .then(() => {
      return client.query(sql);
    })
    .then(result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.log("error", err);
    });
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
