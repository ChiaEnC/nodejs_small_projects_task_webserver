const express = require("express");
require("./db/mongoose"); // for connecting to database
const app = express();
// const port = process.env.PORT;
const taskRouter = require("./routers/task");
const userRouter = require("./routers/user");

// use
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
