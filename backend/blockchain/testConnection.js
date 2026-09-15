const contract = require("./contract");

async function testConnection() {

    const result = await contract.verifyProduct("PROD001");

    console.log("Contract connection successful");
    console.log("Product PROD001 exists:", result);
}

testConnection().catch((error) => {
    console.error("Connection failed:");
    console.error(error.message);
});