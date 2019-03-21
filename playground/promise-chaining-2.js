require("../src/db/mongoose");
const Task = require("../src/model/task");
// Task.findByIdAndDelete("5c8d373015cd9f96a0a7843f")
//   .then(task => {
//     console.log(task);
//     return Task.countDocuments({ completed: false });
//   })
//   .then(result => {
//     console.log(result);
//   })
//   .catch(e => {
//     console.log(e);
//   });

const findByIdAndDelete = async (id, completed) => {
  await Task.findByIdAndDelete(id);
  return Task.countDocuments({ completed: completed });
};

findByIdAndDelete("5c8e160bc4a03cabdc67971b", false)
  .then(result => {
    console.log(result);
  })
  .catch(e => {
    console.log(e);
  });
