require("../src/db/mongoose");
const User = require("../src/model/user");
// User.findByIdAndUpdate("5c8ce6e8beb985736310618f", { age: 1 })
//   .then(user => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
//   })
//   .then(result => {
//     console.log(result);
//   })
//   .catch(e => {
//     console.log(e);
//   });

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age: age });
  const count = await User.countDocuments({ age: 2 });
  return count;
};
updateAgeAndCount("5c8ce6e8beb985736310618f", 2)
  .then(count => {
    console.log(count);
  })
  .catch(e => {
    console.log(e);
  });
