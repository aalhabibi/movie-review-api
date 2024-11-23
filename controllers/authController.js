const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "SUPERSECRETKEY";

async function registerUser(username, email, password) {
  await bcrypt.hash(password, 10, async (err, hash) => {
    if (err) console.log(err);
    else {
      await User.create({
        username,
        email,
        password: hash,
      });
    }
  });
}

async function loginUser(email, password, res) {
  const loggingUser = await User.findOne({
    where: {
      email: email,
    },
    raw: true,
  });

  if (await bcrypt.compare(password, loggingUser.password)) {
    try {
      const token = jwt.sign(
        {
          id: loggingUser.id,
          username: loggingUser.username,
        },
        secret,
        { expiresIn: "10m" }
      );
      res.cookie("token", token, { maxAge: 600000 });
      res.status(200).json({ message: "Login Successful", token });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  } else {
    res.status(400).json({ message: "Wrong Password" });
  }
}

module.exports = { registerUser, loginUser };
