require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieSession = require("cookie-session");
const app = express();

//Database
require("./database/connect");
require("./middleware/authorization");

//Routes
const usersRouter = require("./routes/users");

//Middleware
app.use(express.json());
app.use(bodyParser.json());
// app.use(cors());
app.use(cors({ credentials: true, origin: "http://localhost:4200" }));
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIESESSION],
    httpOnly: true,
    maxAge: 10 * 1000,
  })
);

//Port
app.set("port", process.env.PORT);

//Products
app.use("/api", usersRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const start = async () => {
  try {
    console.log(`${process.env.PORT}=Subhan`);
    // await connectDB(process.env.URI);
    app.listen(app.get("port"), () => {
      console.log(
        `Express started on http://localhost:${app.get(
          "port"
        )};\n Press Ctrl+C to exit`
      );
    });
  } catch (err) {
    console.log(err);
  }
};
start();
