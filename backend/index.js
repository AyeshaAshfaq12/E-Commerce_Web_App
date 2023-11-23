require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieSession = require("cookie-session");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();

//Database
require("./database/connect");
require("./middleware/authorization");

//Routes
const usersRouter = require("./routes/users");
const imagesRouter = require("./routes/images");
const productsRouter = require("./routes/products");
const categoryRouter = require("./routes/category");

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
// Swagger Options
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
      description: "Documentation for your Express.js API SE",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`, // replace with your actual port
        description: "Local server",
      },
    ],
  },
  apis: [`${__dirname}/routes/*.js`], // Add the path to your route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Port
app.set("port", process.env.PORT);

//Users
app.use("/api", usersRouter);

//Images
app.use("/api/images", imagesRouter);

//products
app.use("/api", productsRouter);

//category
app.use("/api", categoryRouter);

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
