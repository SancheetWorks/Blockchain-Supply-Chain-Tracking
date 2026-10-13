const express = require("express");
const cors = require("cors");
const { hash, compare } = require("bcryptjs");
const db = require("./config/db");

const app = express();

const PORT = 5000;

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
    res.send("Blockchain Supply Chain Backend is running");
});

app.post("/api/auth/register", async (req, res) => {

    const { name, email, role, password } = req.body;

    if (!name || !email || !role || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {

        const hashedPassword = await hash(password, 10);

        const sql = `
            INSERT INTO users (name, email, role, password)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [name, email, role, hashedPassword],
            (error, result) => {

                if (error) {

                    if (error.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            message: "Email already registered"
                        });
                    }

                    console.error(error);

                    return res.status(500).json({
                        message: "Registration failed"
                    });
                }

                res.status(201).json({
                    message: "Registration successful",
                    userId: result.insertId
                });
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Registration failed"
        });
    }
});

app.post("/api/auth/login", async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const sql = `
        SELECT id, name, email, role, password
        FROM users
        WHERE email = ?
    `;

    db.query(sql, [email], async (error, results) => {

        if (error) {
            console.error(error);

            return res.status(500).json({
                message: "Login failed"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = results[0];

        const passwordMatch = await compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
});

app.post("/api/products", (req, res) => {

    const {
        product_id,
        product_name,
        category,
        quantity,
        manufacturer_id
    } = req.body;

    if (
        !product_id ||
        !product_name ||
        !category ||
        !quantity ||
        !manufacturer_id
    ) {
        return res.status(400).json({
            message: "All product fields are required"
        });
    }

    const productSql = `
        INSERT INTO products
        (product_id, product_name, category, quantity, manufacturer_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        productSql,
        [
            product_id,
            product_name,
            category,
            quantity,
            manufacturer_id
        ],
        (error, result) => {

            if (error) {

                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        message: "Product ID already exists"
                    });
                }

                console.error(error);

                return res.status(500).json({
                    message: "Product creation failed"
                });
            }

            const productDatabaseId = result.insertId;

            const inventorySql = `
                INSERT INTO product_inventory
                (product_id, user_id, quantity)
                VALUES (?, ?, ?)
            `;

            db.query(
                inventorySql,
                [
                    productDatabaseId,
                    manufacturer_id,
                    quantity
                ],
                (inventoryError) => {

                    if (inventoryError) {
                        console.error(inventoryError);

                        return res.status(500).json({
                            message: "Product created but inventory creation failed"
                        });
                    }

                    res.status(201).json({
                        message: "Product created successfully",
                        productId: productDatabaseId
                    });
                }
            );
        }
    );
});

app.get("/api/products/manufacturer/:manufacturerId", (req, res) => {

    const { manufacturerId } = req.params;

    const sql = `
        SELECT
            id,
            product_id,
            product_name,
            category,
            quantity,
            status,
            created_at
        FROM products
        WHERE manufacturer_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [manufacturerId], (error, results) => {

        if (error) {
            console.error(error);

            return res.status(500).json({
                message: "Failed to fetch products"
            });
        }

        res.status(200).json(results);
    });
});

app.get("/api/products/track/:productCode", (req, res) => {

    const { productCode } = req.params;

    if (!productCode) {
        return res.status(400).json({
            message: "Product ID is required"
        });
    }

    const productSql = `
        SELECT
            p.id,
            p.product_id,
            p.product_name,
            p.category,
            p.quantity,
            p.status,
            p.created_at,
            u.id AS manufacturer_id,
            u.name AS manufacturer_name,
            u.email AS manufacturer_email
        FROM products p
        JOIN users u
            ON p.manufacturer_id = u.id
        WHERE p.product_id = ?
    `;

    db.query(
        productSql,
        [productCode],
        (error, productResults) => {

            if (error) {

                console.error(error);

                return res.status(500).json({
                    message: "Failed to fetch product"
                });
            }

            if (productResults.length === 0) {

                return res.status(404).json({
                    message: "Product not found"
                });
            }

            const product = productResults[0];

            const transferSql = `
                SELECT
                    pt.id,
                    pt.product_id,
                    pt.from_user_id,
                    from_user.name AS from_user_name,
                    from_user.role AS from_user_role,
                    pt.to_user_id,
                    to_user.name AS to_user_name,
                    to_user.role AS to_user_role,
                    pt.quantity,
                    pt.status,
                    pt.transferred_at
                FROM product_transfers pt
                JOIN users from_user
                    ON pt.from_user_id = from_user.id
                JOIN users to_user
                    ON pt.to_user_id = to_user.id
                WHERE pt.product_id = ?
                ORDER BY pt.transferred_at ASC
            `;

            db.query(
                transferSql,
                [product.id],
                (transferError, transferResults) => {

                    if (transferError) {

                        console.error(transferError);

                        return res.status(500).json({
                            message: "Failed to fetch product history"
                        });
                    }

                    res.status(200).json({

                        product: {
                            id: product.id,
                            product_id: product.product_id,
                            product_name: product.product_name,
                            category: product.category,
                            quantity: product.quantity,
                            status: product.status,
                            created_at: product.created_at
                        },

                        manufacturer: {
                            id: product.manufacturer_id,
                            name: product.manufacturer_name,
                            email: product.manufacturer_email
                        },

                        transfers: transferResults

                    });
                }
            );
        }
    );
});

app.get("/api/users/distributors", (req, res) => {

    const sql = `
        SELECT id, name, email
        FROM users
        WHERE role = 'distributor'
        ORDER BY name ASC
    `;

    db.query(sql, (error, results) => {

        if (error) {
            console.error(error);

            return res.status(500).json({
                message: "Failed to fetch distributors"
            });
        }

        res.status(200).json(results);
    });
});

app.get("/api/users/retailers", (req, res) => {

    const sql = `
        SELECT id, name, email
        FROM users
        WHERE role = 'retailer'
        ORDER BY name ASC
    `;

    db.query(sql, (error, results) => {

        if (error) {
            console.error(error);

            return res.status(500).json({
                message: "Failed to fetch retailers"
            });
        }

        res.status(200).json(results);
    });
});

app.post("/api/products/transfer", (req, res) => {

    const {
        product_id,
        from_user_id,
        to_user_id,
        quantity
    } = req.body;

    // Check required fields
    if (!product_id || !from_user_id || !to_user_id || !quantity) {
        return res.status(400).json({
            message: "All transfer fields are required"
        });
    }

    // Check quantity
    if (quantity <= 0) {
        return res.status(400).json({
            message: "Quantity must be greater than 0"
        });
    }

    // Prevent same sender and receiver
    if (from_user_id == to_user_id) {
        return res.status(400).json({
            message: "Sender and receiver cannot be the same user"
        });
    }

    // Get sender and receiver
    const usersSql = `
        SELECT id, name, role
        FROM users
        WHERE id IN (?, ?)
    `;

    db.query(
        usersSql,
        [from_user_id, to_user_id],
        (userError, userResults) => {

            if (userError) {
                console.error(userError);

                return res.status(500).json({
                    message: "Failed to check users"
                });
            }

            // Both users must exist
            if (userResults.length !== 2) {
                return res.status(404).json({
                    message: "Sender or receiver user not found"
                });
            }

            const sender = userResults.find(
                user => user.id == from_user_id
            );

            const receiver = userResults.find(
                user => user.id == to_user_id
            );

            if (!sender || !receiver) {
                return res.status(404).json({
                    message: "Sender or receiver user not found"
                });
            }

            // Allowed supply-chain transfer rules
            const validTransfer =
                (
                    sender.role === "manufacturer" &&
                    receiver.role === "distributor"
                )
                ||
                (
                    sender.role === "distributor" &&
                    receiver.role === "retailer"
                );

            if (!validTransfer) {
                return res.status(403).json({
                    message:
                        "Invalid transfer. Products can only move from Manufacturer to Distributor or Distributor to Retailer."
                });
            }

            // Start MySQL transaction
            db.beginTransaction((transactionError) => {

                if (transactionError) {
                    console.error(transactionError);

                    return res.status(500).json({
                        message: "Failed to start transfer transaction"
                    });
                }

                // Helper function for rollback
                const rollback = (message, error = null) => {

                    if (error) {
                        console.error(error);
                    }

                    db.rollback(() => {

                        return res.status(500).json({
                            message: message
                        });

                    });
                };

                // Check sender inventory
                // FOR UPDATE locks this inventory row during transaction
                const inventorySql = `
                    SELECT quantity
                    FROM product_inventory
                    WHERE product_id = ? AND user_id = ?
                    FOR UPDATE
                `;

                db.query(
                    inventorySql,
                    [product_id, from_user_id],
                    (inventoryError, inventoryResults) => {

                        if (inventoryError) {
                            return rollback(
                                "Failed to check inventory",
                                inventoryError
                            );
                        }

                        // Product must exist in sender inventory
                        if (inventoryResults.length === 0) {

                            return db.rollback(() => {

                                return res.status(404).json({
                                    message: "Product not found in your inventory"
                                });

                            });
                        }

                        const currentQuantity =
                            inventoryResults[0].quantity;

                        // Check available quantity
                        if (currentQuantity < quantity) {

                            return db.rollback(() => {

                                return res.status(400).json({
                                    message: "Insufficient product quantity"
                                });

                            });
                        }

                        // Create transfer record
                        const transferSql = `
                            INSERT INTO product_transfers
                            (
                                product_id,
                                from_user_id,
                                to_user_id,
                                quantity,
                                status
                            )
                            VALUES (?, ?, ?, ?, 'Completed')
                        `;

                        db.query(
                            transferSql,
                            [
                                product_id,
                                from_user_id,
                                to_user_id,
                                quantity
                            ],
                            (transferError, transferResult) => {

                                if (transferError) {
                                    return rollback(
                                        "Product transfer failed",
                                        transferError
                                    );
                                }

                                // Decrease sender inventory
                                const updateSenderSql = `
                                    UPDATE product_inventory
                                    SET quantity = quantity - ?
                                    WHERE product_id = ?
                                    AND user_id = ?
                                    AND quantity >= ?
                                `;

                                db.query(
                                    updateSenderSql,
                                    [
                                        quantity,
                                        product_id,
                                        from_user_id,
                                        quantity
                                    ],
                                    (senderError, senderResult) => {

                                        if (senderError) {
                                            return rollback(
                                                "Sender inventory update failed",
                                                senderError
                                            );
                                        }

                                        if (senderResult.affectedRows !== 1) {
                                            return rollback(
                                                "Sender inventory quantity could not be updated"
                                            );
                                        }

                                        // Update product quantity
                                        const updateProductSql = `
                                            UPDATE products
                                            SET quantity = quantity - ?
                                            WHERE id = ?
                                            AND quantity >= ?
                                        `;

                                        db.query(
                                            updateProductSql,
                                            [
                                                quantity,
                                                product_id,
                                                quantity
                                            ],
                                            (productError, productResult) => {

                                                if (productError) {
                                                    return rollback(
                                                        "Product quantity update failed",
                                                        productError
                                                    );
                                                }

                                                if (productResult.affectedRows !== 1) {
                                                    return rollback(
                                                        "Product quantity could not be updated"
                                                    );
                                                }

                                                // Check receiver inventory
                                                const receiverSql = `
                                                    SELECT id
                                                    FROM product_inventory
                                                    WHERE product_id = ?
                                                    AND user_id = ?
                                                    FOR UPDATE
                                                `;

                                                db.query(
                                                    receiverSql,
                                                    [
                                                        product_id,
                                                        to_user_id
                                                    ],
                                                    (receiverError, receiverResults) => {

                                                        if (receiverError) {
                                                            return rollback(
                                                                "Failed to check receiver inventory",
                                                                receiverError
                                                            );
                                                        }

                                                        // Receiver already has product
                                                        if (receiverResults.length > 0) {

                                                            const updateReceiverSql = `
                                                                UPDATE product_inventory
                                                                SET quantity = quantity + ?
                                                                WHERE product_id = ?
                                                                AND user_id = ?
                                                            `;

                                                            db.query(
                                                                updateReceiverSql,
                                                                [
                                                                    quantity,
                                                                    product_id,
                                                                    to_user_id
                                                                ],
                                                                (updateError) => {

                                                                    if (updateError) {
                                                                        return rollback(
                                                                            "Receiver inventory update failed",
                                                                            updateError
                                                                        );
                                                                    }

                                                                    // Commit transaction
                                                                    db.commit((commitError) => {

                                                                        if (commitError) {
                                                                            return rollback(
                                                                                "Failed to complete transfer",
                                                                                commitError
                                                                            );
                                                                        }

                                                                        return res.status(200).json({
                                                                            message: "Product transferred successfully",
                                                                            transferId: transferResult.insertId
                                                                        });

                                                                    });

                                                                }
                                                            );

                                                        } else {

                                                            // Create receiver inventory
                                                            const insertReceiverSql = `
                                                                INSERT INTO product_inventory
                                                                (
                                                                    product_id,
                                                                    user_id,
                                                                    quantity
                                                                )
                                                                VALUES (?, ?, ?)
                                                            `;

                                                            db.query(
                                                                insertReceiverSql,
                                                                [
                                                                    product_id,
                                                                    to_user_id,
                                                                    quantity
                                                                ],
                                                                (insertError) => {

                                                                    if (insertError) {
                                                                        return rollback(
                                                                            "Receiver inventory creation failed",
                                                                            insertError
                                                                        );
                                                                    }

                                                                    // Commit transaction
                                                                    db.commit((commitError) => {

                                                                        if (commitError) {
                                                                            return rollback(
                                                                                "Failed to complete transfer",
                                                                                commitError
                                                                            );
                                                                        }

                                                                        return res.status(200).json({
                                                                            message: "Product transferred successfully",
                                                                            transferId: transferResult.insertId
                                                                        });

                                                                    });

                                                                }
                                                            );

                                                        }

                                                    }
                                                );

                                            }
                                        );

                                    }
                                );

                            }
                        );

                    }
                );

            });

        }
    );

});

app.get("/api/inventory/:userId", (req, res) => {

    const { userId } = req.params;

    const sql = `
        SELECT
            pi.id,
            pi.product_id,
            p.product_id AS product_code,
            p.product_name,
            p.category,
            pi.quantity,
            pi.updated_at
        FROM product_inventory pi
        JOIN products p
            ON pi.product_id = p.id
        WHERE pi.user_id = ?
        ORDER BY pi.updated_at DESC
    `;

    db.query(sql, [userId], (error, results) => {

        if (error) {
            console.error(error);

            return res.status(500).json({
                message: "Failed to fetch inventory"
            });
        }

        res.status(200).json(results);
    });
});


app.get("/api/transfers/user/:userId", (req, res) => {

    const { userId } = req.params;

    const sql = `
        SELECT
            pt.id,
            pt.product_id,
            p.product_id AS product_code,
            p.product_name,
            pt.from_user_id,
            from_user.name AS from_user_name,
            pt.to_user_id,
            to_user.name AS to_user_name,
            pt.quantity,
            pt.status,
            pt.transferred_at
        FROM product_transfers pt
        JOIN products p
            ON pt.product_id = p.id
        JOIN users from_user
            ON pt.from_user_id = from_user.id
        JOIN users to_user
            ON pt.to_user_id = to_user.id
        WHERE pt.from_user_id = ?
           OR pt.to_user_id = ?
        ORDER BY pt.transferred_at DESC
    `;

    db.query(
        sql,
        [userId, userId],
        (error, results) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    message: "Failed to fetch transfer history"
                });
            }

            res.status(200).json(results);
        }
    );
});

app.get("/api/auth/test", (req, res) => {

    res.json({
        message: "Authentication API is working"
    });
});

app.get("/api/products/track/:productCode", (req, res) => {

    const { productCode } = req.params;

    const productSql = `
        SELECT
            p.id,
            p.product_id,
            p.product_name,
            p.category,
            p.quantity,
            p.status,
            p.created_at,
            u.id AS manufacturer_id,
            u.name AS manufacturer_name,
            u.email AS manufacturer_email
        FROM products p
        JOIN users u
            ON p.manufacturer_id = u.id
        WHERE p.product_id = ?
    `;

    db.query(productSql, [productCode], (productError, productResults) => {

        if (productError) {
            console.error(productError);

            return res.status(500).json({
                message: "Failed to fetch product"
            });
        }

        if (productResults.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const product = productResults[0];

        const transferSql = `
            SELECT
                pt.id,
                pt.product_id,
                pt.from_user_id,
                from_user.name AS from_user_name,
                from_user.role AS from_user_role,
                pt.to_user_id,
                to_user.name AS to_user_name,
                to_user.role AS to_user_role,
                pt.quantity,
                pt.status,
                pt.transferred_at
            FROM product_transfers pt
            JOIN users from_user
                ON pt.from_user_id = from_user.id
            JOIN users to_user
                ON pt.to_user_id = to_user.id
            WHERE pt.product_id = ?
            ORDER BY pt.transferred_at ASC
        `;

        db.query(
            transferSql,
            [product.id],
            (transferError, transferResults) => {

                if (transferError) {
                    console.error(transferError);

                    return res.status(500).json({
                        message: "Failed to fetch product history"
                    });
                }

                res.status(200).json({
                    product: {
                        id: product.id,
                        product_id: product.product_id,
                        product_name: product.product_name,
                        category: product.category,
                        quantity: product.quantity,
                        status: product.status,
                        created_at: product.created_at
                    },

                    manufacturer: {
                        id: product.manufacturer_id,
                        name: product.manufacturer_name,
                        email: product.manufacturer_email
                    },

                    transfers: transferResults
                });
            }
        );
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});