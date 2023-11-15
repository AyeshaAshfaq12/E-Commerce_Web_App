const { roles } = require("../utils/helper");
const User = require("../models/user");

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const existingEmailUser = await User.findOne({
      emailAddress: req.body.emailAddress,
    });

    if (existingEmailUser) {
      return res
        .status(400)
        .send({ message: "Failed! Email is already in use!" });
    }

    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  checkDuplicateUsernameOrEmail,
};
