require("dotenv").config();

const express = require("express");
const cors = require("cors");

const paymentRoutes = require("./routes/payment");

const app = express();

app.use(cors());

// Webhook ke liye raw body
app.use("/webhook", express.raw({ type: "application/json" }));

// Baaki APIs ke liye JSON
app.use(express.json());

app.use("/", paymentRoutes);

app.listen(process.env.PORT, () => {
    console.log("Server running...");
});