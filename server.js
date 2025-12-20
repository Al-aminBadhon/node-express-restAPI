require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const conn = require("./helper/connectionStrings");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const researchRoute = require("./routes/researchRoute");

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:8080", // my frontend
    credentials: true,
  })
);

// Global body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/api", userRoute);
app.use("/", authRoute);
app.use("/api", researchRoute);

mongoose
  .connect(conn)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

app.listen(port, () => {
  console.log(`server listening on ${port} .....`);
});
