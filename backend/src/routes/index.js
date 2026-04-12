const express = require("express");
const authRoutes = require("./auth.routes");
const contentRoutes = require("./content.routes");
const meRoutes = require("./me.routes");
const ordersRoutes = require("./orders.routes");
const paymentsRoutes = require("./payments.routes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, service: "naukograd-backend" });
});

router.use("/auth", authRoutes);
router.use("/me", meRoutes);
router.use("/orders", ordersRoutes);
router.use("/payments", paymentsRoutes);
router.use("/", contentRoutes);

module.exports = router;
