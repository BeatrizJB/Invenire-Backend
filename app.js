// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const session = require("express-session");
app.set("trust proxy", 1);
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
      sameSite: "none" /* frontend backend both run on localhost "none",*/,
      httpOnly: false /* we are not using https false,*/,
      maxAge: 600000, //session time
      secure: true,
    },
    rolling: true,
  })
);

// default value for title local
const projectName = "invenire-backend";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

// const inventory = require("./routes/inventory-routes");
// app.use("/api", inventory);

const list = require("./routes/list-routes");
app.use("/api", list);

const auth = require("./routes/auth-routes");
app.use("/api", auth);

const user = require("./routes/user");
app.use("/api", user);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
