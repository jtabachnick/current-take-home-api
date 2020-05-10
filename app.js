const bodyParser = require("body-parser");
const express = require("express");
const { getVisit, searchVisits, saveVisit } = require("./visits");

const app = express();
app.use(bodyParser.json());

app.get("/visit", async (req, res) => {
  let response;
  let statusCode = 200;
  try {
    if (req.query.visitId) {
      response = await getVisit(req.query.visitId);
    } else if (req.query.userId && req.query.searchString) {
      response = await searchVisits(req.query.userId, req.query.searchString);
    } else {
      statusCode = 400;
      response = "requsts must contain a visitId or userId and searchString";
    }
  } catch (e) {
    statusCode = 500;
    response = `we have encountered an error: ${e}`;
  } finally {
    res.status(statusCode).send(response);
  }
});

app.post("/visit", async (req, res) => {
  if (!req.body.userId || !req.body.name) {
    res.status(400).send("userId and name (location) are required fields");
  }
  let response;
  let statusCode = 200;

  try {
    response = await saveVisit(req.body.userId, req.body.name);
  } catch (e) {
    statusCode = 500;
    response = `we have encountered an error: ${e}`;
  } finally {
    res.status(statusCode).send(response);
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
