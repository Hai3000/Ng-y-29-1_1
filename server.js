const express = require("express");
const connectDB = require("./config/db");

const userRoute = require("./routes/user.route");
const roleRoute = require("./routes/role.route");

const app = express();

app.use(express.json());

connectDB();

app.use("/users", userRoute);
app.use("/roles", roleRoute);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});