import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import campaignRoutes from "./routes/routes.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/campaigns", campaignRoutes);

// Test route
app.get("/", (req, res) => res.send("Campaign service running!"));

app.listen(PORT, () => {
  console.log(`Campaign service running on port ${PORT}`);
});
