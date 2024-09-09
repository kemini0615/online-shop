const path = require("path");

const express = require("express");
const authRouter = require("./routes/auth-routes");
const mongodb = require("./database/mongodb");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // __dirname is a path to this project directory

app.use(express.static("public")); // static middleware handles requrests for static files such as css or js within 'public' directory

app.use(authRouter);

mongodb
  .connectToDatabase()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log("Failed to connect to DB.");
    console.log(err);
  });
