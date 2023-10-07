const express = require("express");
require("dotenv").config();
const app = express();

//Database
const connectDB = require("./database/connect");

//Routes
const products = require("./routes/products");

//Middleware
app.use(express.static("./public"));
app.use(express.json());

//Port
app.set("port", process.env.PORT || 30001);

//Products
app.use("/api/products", products);

const start = async () => {
  try {
    await connectDB(process.env.URI);
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
