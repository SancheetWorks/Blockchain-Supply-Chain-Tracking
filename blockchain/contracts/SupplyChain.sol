// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SupplyChain {

    struct Product {
        string productId;
        string productName;
        address manufacturer;
        address currentOwner;
        uint256 createdAt;
        bool exists;
    }

    struct Transfer {
        address from;
        address to;
        uint256 timestamp;
    }

    mapping(string => Product) private products;

    mapping(string => Transfer[]) private transferHistory;


    // Create a new product
    function createProduct(
        string memory _productId,
        string memory _productName
    ) public {

        require(
            !products[_productId].exists,
            "Product already exists"
        );

        products[_productId] = Product({
            productId: _productId,
            productName: _productName,
            manufacturer: msg.sender,
            currentOwner: msg.sender,
            createdAt: block.timestamp,
            exists: true
        });
    }


    // Transfer product to the next participant
    function transferProduct(
        string memory _productId,
        address _newOwner
    ) public {

        require(
            products[_productId].exists,
            "Product does not exist"
        );

        require(
            products[_productId].currentOwner == msg.sender,
            "Only current owner can transfer"
        );

        require(
            _newOwner != address(0),
            "Invalid new owner"
        );

        transferHistory[_productId].push(
            Transfer({
                from: msg.sender,
                to: _newOwner,
                timestamp: block.timestamp
            })
        );

        products[_productId].currentOwner = _newOwner;
    }


    // Get product details
    function getProduct(
        string memory _productId
    )
        public
        view
        returns (
            string memory,
            string memory,
            address,
            address,
            uint256,
            bool
        )
    {

        require(
            products[_productId].exists,
            "Product does not exist"
        );

        Product memory product = products[_productId];

        return (
            product.productId,
            product.productName,
            product.manufacturer,
            product.currentOwner,
            product.createdAt,
            product.exists
        );
    }


    // Get complete transfer history
    function getHistory(
        string memory _productId
    )
        public
        view
        returns (Transfer[] memory)
    {

        require(
            products[_productId].exists,
            "Product does not exist"
        );

        return transferHistory[_productId];
    }


    // Verify whether a product exists
    function verifyProduct(
        string memory _productId
    )
        public
        view
        returns (bool)
    {

        return products[_productId].exists;
    }
}