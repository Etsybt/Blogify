const async_manager = require("express-async-handler");
const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/*
 * Description: Register a new user
 * HTTP Method & Endpoint: POST /api/user/signup
 * Access: Public
 */
const signupUser = async_manager(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all fields");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    // password hashing
    const hash_pass = await bycrypt.hash(password, 10);
    console.log("hashed password: ", hash_pass);
    const new_user = await User.create({
        name,
        email,
        password: hash_pass,
    });
    console.log(`user created ${new_user}`);

    if (new_user) {
        res.status(201).json({ _id: new_user.id, email: new_user.email });
    } else {
        res.status(400);
        throw new Error("User input is not valid!");
    }

    res.json({ message: "Sign up the user" });
});

/*
 * Description: Login a user
 * HTTP Method & Endpoint: POST /api/user/login
 * Access: Public
 */
const loginUser = async_manager(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Must enter all fields!");
    }

    const user = await User.findOne({ email });

    // Compare user inputted password with the hash password in the database
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
            {
                user: {
                    name: user.name,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.SECRET_TOKEN,
            { expiresIn: "30d" }
        );

        res.status(200).json({ token });
    } else {
        res.status(401);
        throw new Error("Invalid credentials");
    }
});

/*
 * Description: Get the current logged-in user's data
 * HTTP Method & Endpoint: GET /api/user/current
 * Access: Private
 */
const getCurrentUser = async_manager(async (req, res) => {
    res.json({ message: "Current user's data" });
});

module.exports = { signupUser, loginUser, getCurrentUser };