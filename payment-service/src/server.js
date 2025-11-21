import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import paymentRoutes from "./routes/routes.js";

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/payments", paymentRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Payment Service is running");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message });
});

app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});
