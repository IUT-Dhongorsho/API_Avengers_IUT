import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import paymentRoutes from "./routes/routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api", paymentRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});
