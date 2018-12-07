const args = require('yargs').argv;
const fs = require('fs');

if (!args.address || !args.abi) {
	console.log('Usage: node relayd.js --address=<contract address> --abi=<abi file>');
	process.exit(1);
}

if (!fs.existsSync('../build/EOSrelay.abi')) {
	console.log('You should compile contracts to get abi file.');
	process.exit(1);
}

// contract.methods['submitBlock(uint256,bytes)'](123123123, new Buffer("test")).send({from:"0x051977ed8e503d3140e3ae8ecc645b3c9245acc6", gas:2000000}).then(receipt => { console.log(receipt); console.log("!!"); }).catch(ex => { console.log(ex); console.log("??");} );

let relayAbi = fs.readFileSync('../build/EOSrelay.abi').toString();

const options = {
	EOS_MAINNET_URL: 'https://api.eosnewyork.io',
	CHUNK_SIZE: 5,
	SLEEP_TIME: 1000 * 10,
	RELAY_ABI: relayAbi,
	RELAY_ADDRESS: "0x0a4a4b39bb39b354cc8696757d88cfc856fab488" // args.address
}

require('./relay')(options).runRelay();
