const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");
const productRoutes = require("./routes/productRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");
const combinedRoutes = require("./routes/combinedRoutes");
dotenv.config();
connectDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/combinedRoutes", combinedRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
