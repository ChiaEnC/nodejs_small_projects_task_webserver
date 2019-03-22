const express = require("express");
require("./db/mongoose"); // for connecting to database
// const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const hbs = require("hbs");
// const viewsPath = path.join(__dirname, "/templates/views");
// const partialsPath = path.join(__dirname, "templates/partials");
// const publicDirectoryPath = path.join(__dirname, "../public");
const taskRouter = require("./routers/task");
const userRouter = require("./routers/user");
// app.use(express.static(publicDirectoryPath));

// handle bar engine

// app.set("view engine", "hbs");
// app.set("views", viewsPath);
// hbs.registerPartials(partialsPath);

//hbs.registerPartials(partialsPath);

// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET reqs are disable");
//   } else {
//     next();
//   }
// });
// app.use((req, res, next) => {
//   if (req) {
//     res.status("503").send("Sorry the site is under maintenance level");
//   } else {
//     next();
//   }
// });

// use
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
const multer = require("multer");
// const upload = multer({
//   dest:"images"
// })
// app.post("/upload")

app.listen(port, () => {
  console.log("Server is up on port : " + 3000);
});

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const myFunction = async () => {
//   const token = jwt.sign({ _id: "a123" }, "thisismynewcourse", {
//     expiresIn: "7 days"
//   });
//   const data = jwt.verify(token, "thisismynewcourse");
//   console.log(data);
//   // const password = "Red12345!";
//   // const hashedPassword = await bcrypt.hash(password, 8);
//   // console.log(password);
//   // console.log(hashedPassword);
//   // const isMatch = await bcrypt.compare("Red12345!", hashedPassword);
//   // console.log(isMatch);
// };
// myFunction();

const Task = require("./model/task");
const User = require("./model/user");
const main = async () => {
  const user = await User.findById("5c95097c64a9e14377b32940");
  await user.populate("tasks").execPopulate();
  console.log(user.tasks);
  // const task = await Task.findById("5c9509a714eb1443821750a8");
  // await task.populate("owner").execPopulate();
  // console.log(task.owner);
};
main();
