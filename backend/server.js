const express = require("express");

const productRoutes = require("./routes/productRoutes");

const app = express();

const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Blockchain Supply Chain Backend is running");
});

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});