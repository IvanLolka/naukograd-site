const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes");
const env = require("./config/env");
const { errorHandler, notFoundHandler } = require("./middleware/error-handler");

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.use("/api", routes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
