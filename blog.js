const express = require("express");
const errorManager = require("./middleware/error_manager");
const db_config = require("./config/db_config");
const dotenv = require("dotenv").config();

db_config();
const app = express()

const port = process.env.PORT || 5000;

// Serve uploaded images
app.use('/uploads', express.static('uploads'));


app.use(express.json());
app.use("/api/blogs", require("./routes/blog_routes"));
app.use("/api/users", require("./routes/user_routes"));
app.use(errorManager);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});