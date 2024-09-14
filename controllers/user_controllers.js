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
    const hash_pass = await bcrypt.hash(password, 10);
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
    res.json(req.user);
});


/*
 * Description: Update user profile
 * HTTP Method & Endpoint: PUT /api/users/:id
 * Access: Private
 */
const updateUserProfile = async_manager(async (req, res) => {
    const { name, bio } = req.body;
    const profilePicture = req.file ? req.file.path : req.user.profilePicture;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        name,
        bio,
        profilePicture
    }, { new: true });

    if (!updatedUser) {
        res.status(404);
        throw new Error("User not found");
    }

    res.status(200).json({
        name: updatedUser.name,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture,
    });
});

/*
 * Description: Delete user account
 * HTTP Method & Endpoint: DELETE /api/users/:id
 * Access: Private
 */
const deleteUserAccount = async_manager(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Account deleted successfully" });
});

module.exports = { signupUser, loginUser, getCurrentUser, updateUserProfile, deleteUserAccount };