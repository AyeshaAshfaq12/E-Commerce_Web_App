const User = require("../models/user");

const { comparePasswords, hashPassword } = require("../utils/helper");
// const { GenerateToken } = require("../middleware/authorization");
const jwt = require("jsonwebtoken");
const GenerateToken = (user) => {
  const payload = { id: user._id, role: user.role };
  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: 6000 });
  return token;
};

const loginUser = async (req, res) => {
  console.log("emailAddress");
  const { emailAddress, password } = req.body;
  console.log(emailAddress);
  try {
    const user = await User.findOne({ emailAddress });
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (await comparePasswords(password, user.password)) {
      var token = GenerateToken(user);
      console.log(token);

      req.session.token = token;
      console.log({
        message: "Login successful",
        email: emailAddress,
        fullname: user.fullname,
        userid: user.id,
        token: token,
      });
      res.status(200).json({
        message: "Login successful",
        email: emailAddress,
        fullname: user.fullname,
        userid: user.id,
        token: token,
      });
    } else {
      res.status(401).json({ error: "Incorrect Credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const logoutUser = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};

// JSON WebToken

const createUser = async (req, res) => {
  try {
    console.log(req.body);
    req.body.password = await hashPassword(req.body.password);
    const user = await User.create(req.body);
    res.status(201).json(user);
    console.log(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.status(200).json(updatedUser);
    console.log(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      deletedUser: deletedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  logoutUser,
};
