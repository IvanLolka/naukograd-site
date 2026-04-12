require("dotenv").config();
const app = require("./app");
const env = require("./config/env");

const server = app.listen(env.port, () => {
  console.log(`API is running on port ${env.port}`);
});

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
