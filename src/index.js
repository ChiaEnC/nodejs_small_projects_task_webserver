const express = require("express");
require("./db/mongoose"); // for connecting to database
// const path = require("path");
const app = express();
const port = process.env.PORT;
const hbs = require("hbs");
const taskRouter = require("./routers/task");
const userRouter = require("./routers/user");

// use
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up on port : " + port);
});
