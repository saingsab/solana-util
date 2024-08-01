const web3 = require("@solana/web3.js");

let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

async function main() {
    let slot = await connection.getSlot();
    console.log(slot);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
