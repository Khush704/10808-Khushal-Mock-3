const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const complaintRoutes = require("./routes/complaintRoutes");

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Camplaint success"
  });
});

app.use("/api/complaints", complaintRoutes);

app.use((req, res) => {
  res.status(400).json({
    success: false,
    message: "Failed"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});