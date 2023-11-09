const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/user");

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(
  "mongodb+srv://ronakdshah9:" +
    encodeURIComponent("Ronak007@") +
    "@cluster0.69xsicw.mongodb.net/assignment",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/user/create", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.put("/user/edit", async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    if (fullName) {
      if (/^[A-Za-z\s]+$/.test(fullName)) {
        user.fullName = fullName;
      } else {
        throw new Error(
          "Invalid full name format. Only letters and spaces are allowed."
        );
      }
    }

    if (password) {
      if (
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=.*[^\w\d\s]).{8,}$/.test(
          password
        )
      ) {
        user.password = password;
      } else {
        throw new Error(
          "Invalid password format. It must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long."
        );
      }
    }

    await user.save();
    res.status(200).send("User updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete("/user/delete", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOneAndDelete({ email });

    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).send("User deleted successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/user/getAll", async (req, res) => {
  try {
    const users = await User.find({}, "fullName email password");
    res.status(200).json(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
