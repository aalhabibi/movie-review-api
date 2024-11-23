const { where } = require("sequelize");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

async function getUser(id) {
  const user = await User.findOne({ where: { id }, raw: true });
  return user;
}

async function updateUser(id, userDetails, res) {
  await bcrypt.hash(userDetails.password, 10, async (err, hash) => {
    if (err) console.log(err);
    else {
      const [affectedRows, updatedUsers] = await User.update(
        {
          username: userDetails.username,
          email: userDetails.email,
          password: hash,
        },
        {
          where: {
            id: id,
          },
        }
      );
      if (affectedRows == 0) res.json({ message: "No user was updated" });
      else res.status(200).json({ message: "User has been updated" });
    }
  });
}

async function deleteUser(id, res) {
  const affectedRows = await User.destroy({
    where: {
      id: id,
    },
  });
  if (affectedRows == 0) res.json({ message: "No user was deleted" });
  else res.status(200).json({ message: "User has been deleted" });
}

module.exports = { getUser, updateUser, deleteUser };
