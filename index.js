// express server with routes
const express = require("express");
const app = express();
const port = 3000;

// import routes
const index = require("./routes/index");

// use routes
app.use("/", index);

// start server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
