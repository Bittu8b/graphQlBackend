const bcrypt = require("bcryptjs");
const User = require("../../Models/user");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async args => {
    try {
      const userr = await User.findOne({
        email: args.userInput.email
      });

      if (userr) {
        throw new Error("User already exists");
      }
      const pass = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: pass
      });
      const res = await user.save();

      return res;
    } catch (err) {
      throw err;
    }
  },

  login: async ({
    email,
    password
  }) => {
    const user = await User.findOne({
      email: email
    });
    if (!user) {
      return {
        status: "User not found"
      }
    }

    const isEqaul = await bcrypt.compare(password, user.password);
    if (!isEqaul) {
      return {
        status: "Wrong password"
      }
    }

    const token = jwt.sign({
        userId: user._id,
        email: user.email
      },
      "somesupersecretkey", {
        expiresIn: "1h"
      }
    );

    return {
      userId: user._id,
      token: token,
      tokenExpiration: 1
    };
  }
};