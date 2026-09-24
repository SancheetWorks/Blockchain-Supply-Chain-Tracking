const express = require("express");
const contract = require("../blockchain/contract");

const router = express.Router();

router.post("/", async (req, res) => {

    try {

        const { productId, productName } = req.body;

        if (!productId || !productName) {
            return res.status(400).json({
                message: "Product ID and Product Name are required"
            });
        }

        const transaction = await contract.createProduct(
            productId,
            productName
        );

        await transaction.wait();

        res.status(201).json({
            message: "Product created successfully",
            transactionHash: transaction.hash,
            productId: productId,
            productName: productName
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to create product",
            error: error.message
        });

    }

});


// Get product details
router.get("/:productId", async (req, res) => {

    try {

        const productId = req.params.productId;

        const product = await contract.getProduct(productId);

        res.json({
            productId: product[0],
            productName: product[1],
            manufacturer: product[2],
            currentOwner: product[3],
            createdAt: product[4].toString(),
            exists: product[5]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to get product",
            error: error.message
        });

    }

});

// Transfer product to a new owner
router.post("/:productId/transfer", async (req, res) => {

    try {

        const productId = req.params.productId;
        const { newOwner } = req.body;

        if (!newOwner) {
            return res.status(400).json({
                message: "New owner address is required"
            });
        }

        const transaction = await contract.transferProduct(
            productId,
            newOwner
        );

        await transaction.wait();

        res.json({
            message: "Product transferred successfully",
            transactionHash: transaction.hash,
            productId: productId,
            newOwner: newOwner
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to transfer product",
            error: error.message
        });

    }

});


// Get product transfer history
router.get("/:productId/history", async (req, res) => {

    try {

        const productId = req.params.productId;

        const history = await contract.getHistory(productId);

        const formattedHistory = history.map((transfer) => ({
            from: transfer.from,
            to: transfer.to,
            timestamp: transfer.timestamp.toString()
        }));

        res.json({
            productId: productId,
            history: formattedHistory
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to get product history",
            error: error.message
        });

    }

});

module.exports = router;