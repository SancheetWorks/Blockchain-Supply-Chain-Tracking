import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("SupplyChain", function () {
    /*  1. Create Product */
    it("Should create a product", async function () {

        const SupplyChain = await ethers.getContractFactory("SupplyChain");
        const supplyChain = await SupplyChain.deploy();

        const [manufacturer] = await ethers.getSigners();

        await supplyChain
            .connect(manufacturer)
            .createProduct("PROD001", "Organic Rice");

        const product = await supplyChain.getProduct("PROD001");

        expect(product[0]).to.equal("PROD001");
        expect(product[1]).to.equal("Organic Rice");
    });

    /*   2. Transfer Product*/
    it("Should transfer product from manufacturer to distributor", async function () {

        const SupplyChain = await ethers.getContractFactory("SupplyChain");
        const supplyChain = await SupplyChain.deploy();

        const [manufacturer, distributor] = await ethers.getSigners();

        await supplyChain
            .connect(manufacturer)
            .createProduct("PROD002", "Wheat");

        await supplyChain
            .connect(manufacturer)
            .transferProduct("PROD002", distributor.address);

        const product = await supplyChain.getProduct("PROD002");

        expect(product[3]).to.equal(distributor.address);

    });

    /* Unauthorized Transfer Protection */
    it("Should not allow unauthorized user to transfer product", async function () {

        const SupplyChain = await ethers.getContractFactory("SupplyChain");
        const supplyChain = await SupplyChain.deploy();

        const [manufacturer, distributor, attacker] = await ethers.getSigners();

        await supplyChain
            .connect(manufacturer)
            .createProduct("PROD003", "Sugar");

        await expect(
            supplyChain
                .connect(attacker)
                .transferProduct("PROD003", distributor.address)
        ).to.be.revertedWith("Only current owner can transfer");
    });

    /* 4. Transfer History */
    it("Should record product transfer history", async function () {

        const SupplyChain = await ethers.getContractFactory("SupplyChain");
        const supplyChain = await SupplyChain.deploy();

        const [manufacturer, distributor, wholesaler] = await ethers.getSigners();

        await supplyChain
            .connect(manufacturer)
            .createProduct("PROD004", "Milk");

        await supplyChain
            .connect(manufacturer)
            .transferProduct("PROD004", distributor.address);

        await supplyChain
            .connect(distributor)
            .transferProduct("PROD004", wholesaler.address);

        const history = await supplyChain.getHistory("PROD004");

        expect(history.length).to.equal(2);

        expect(history[0].from).to.equal(manufacturer.address);
        expect(history[0].to).to.equal(distributor.address);

        expect(history[1].from).to.equal(distributor.address);
        expect(history[1].to).to.equal(wholesaler.address);
    });


    /* 5. Verify Product */
    it("Should verify an existing product", async function () {

        const SupplyChain = await ethers.getContractFactory("SupplyChain");
        const supplyChain = await SupplyChain.deploy();

        await supplyChain.createProduct("PROD005", "Basmati Rice");

        const result = await supplyChain.verifyProduct("PROD005");

        expect(result).to.equal(true);
    });

    /* 6. Error Handling */

    it("Should not return a non-existing product", async function () {

        const SupplyChain = await ethers.getContractFactory("SupplyChain");
        const supplyChain = await SupplyChain.deploy();

        await expect(
            supplyChain.getProduct("PROD999")
        ).to.be.revertedWith("Product does not exist");
    });

});