const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^[A-Za-z\s]+$/.test(value),
      message: "Invalid full name format. Only letters and spaces are allowed.",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) =>
        /\b[A-Za-z0-9._%+-]+@northeastern\.edu\b/.test(value),
      message: "Invalid email format. Must end with @northeastern.edu",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value) =>
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=.*[^\w\d\s]).{8,}$/.test(
          value
        ),
      message:
        "Invalid password format. It must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.",
    },
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
