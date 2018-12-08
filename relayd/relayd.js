const args = require('yargs').argv;
const _ = require('lodash');
const fs = require('fs');
const OPTIONS = [ "address", "gas", "interval", "chunksize", "eospath", "h" ];

if (args.h) {
	console.log("Usage: node relayd.js --address=<contract address> [Options]");
	console.log();
	console.log("REQUIRED:");
	console.log();
	console.log("\t--address=<contract address> Contract address EOSrelay on ethereum");
	console.log();
	console.log("OPTIONS:");
	console.log();
	console.log("\t--gas=<gas> The gas used to call the contract");
	console.log("\t--interval=<interval> Contract call interval (ms)");
	console.log("\t--chunksize=<chunksize> Number of blocks read at one cycle (default: 5)");
	console.log("\t--eospath=<network url> EOS network url (default: mainnet)");
	console.log("\t--h Print help");
	console.log();
	console.log("DOCUMENT:");
	console.log("\tGithub: https://github.com/twodude/EOSrelay");
	console.log();
	process.exit(1);
}

// Validate options
Object.keys(args).forEach((element) => {
	if (element == '_' || element == '$0') return;
	if (!_.find(OPTIONS, element)) {
		console.log('Usage: node relayd.js --address=<contract address> [options]');
		console.log('Invalid option: ' + element);
		process.exit(1);
	}
});

if (!args.address) {
	console.log('Usage: node relayd.js --address=<contract address> [options]');
	console.log('Show options: node relayd.js --h ');
	process.exit(1);
}

if (!fs.existsSync('../build/EOSrelay.abi')) {
	console.log('abi file is required');
	process.exit(1);
}

const relayAbi = fs.readFileSync('../build/EOSrelay.abi').toString();

const options = {
EOS_MAINNET_URL: (args.eospath)? args.eospath : 'https://api.eosnewyork.io',
	CHUNK_SIZE: (args.chunksize)? args.chunksize : 5,
	SLEEP_TIME: (args.interval)? Number(args.interval) : 1000 * 60,
	RELAY_ABI: relayAbi,
	RELAY_ADDRESS: (args.address)? args.address : '0x0a4a4b39bb39b354cc8696757d88cfc856fab488',

};

require('./relay')(options).runRelay();
