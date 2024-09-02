const express = require("express");
const authRouter = require("./routes/auth-routes");

const app = express();
app.use(authRouter);

app.listen(3000);