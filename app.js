const bodyParser = require("body-parser");
const express = require("express");
const { getVisit, searchVisits, saveVisit } = require("./visits");

const app = express();
app.use(bodyParser.json());

// get route
app.get("/visit", async (req, res) => {
  let response;
  let statusCode = 200;
  try {
    // if a visitId present call get visit to return single visit
    if (req.query.visitId) {
      response = await getVisit(req.query.visitId);

      // if userId and searchString are present search the user's visits
    } else if (req.query.userId && req.query.searchString) {
      response = await searchVisits(req.query.userId, req.query.searchString);

      // otherwise it's a bad request
    } else {
      statusCode = 400;
      response = "requsts must contain a visitId or userId and searchString";
    }
    // catch any server errors and display, mostly for debugging
  } catch (e) {
    statusCode = 500;
    response = `we have encountered an error: ${e}`;
  } finally {
    // send the response
    res.status(statusCode).send(response);
  }
});

app.post("/visit", async (req, res) => {
  // validate that the body has needed fields respond with bad request if not
  if (!req.body.userId || !req.body.name) {
    res.status(400).send("userId and name (location) are required fields");
  }
  let response;
  let statusCode = 200;

  // if fields are present save them
  try {
    response = await saveVisit(req.body.userId, req.body.name);

    // catch and display server errors
  } catch (e) {
    statusCode = 500;
    response = `we have encountered an error: ${e}`;
  } finally {
    // send response
    res.status(statusCode).send(response);
  }
});

module.exports = app;
