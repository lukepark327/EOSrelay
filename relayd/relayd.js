const args = require('yargs').argv;
const _ = require('lodash');
const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3();

const OPTIONS = [ 'address', 'gas', 'account', 'interval', 'chunksize', 'eospath', 'ethpath', 'h' ];

if (args.h) {
	console.log('Usage: node relayd.js --address=<contract address> --account=<account> [Options]');
	console.log();
	console.log('REQUIRED:');
	console.log();
	console.log('\t--address=<contract address> Contract address EOSrelay on ethereum');
	console.log('\t--account=<account> Ethereum account');
	console.log();
	console.log('OPTIONS:');
	console.log();
	console.log('\t--gas=<gas> The gas used to call the contract (default: 200000)');
	console.log('\t--interval=<interval> Contract call interval (ms, default: 60000)');
	console.log('\t--chunksize=<chunksize> Number of blocks read at one cycle (default: 5)');
	console.log('\t--eospath=<basepath> EOS network rpc basepath (default: https://api.eosnewyork.io)');
	console.log('\t--ethpath=<basepath> Ethereum network rpc basepath (default: http://localhost:8545)');
	console.log('\t--h Print help');
	console.log();
	console.log('DOCUMENT:');
	console.log('\tGithub: https://github.com/twodude/EOSrelay');
	console.log();
	process.exit(1);
}

// Validate option keys
Object.keys(args).forEach((element) => {
	if (element == '_' || element == '$0') return;
	if (!_.includes(OPTIONS, element)) {
		console.log('Usage: node relayd.js --address=<contract address> --account=<account> [options]');
		console.log('Invalid option: ' + element);
		process.exit(1);
	}
});

// TODO: Option data type checking

if (!args.address || !args.account) {
	console.log('Usage: node relayd.js --address=<contract address> --account=<account> [options]');
	console.log('Show options: node relayd.js --h ');
	process.exit(1);
}

if (!web3.utils.isAddress(args.address)) {
	console.log('Contract address is wrong. please put contract address correctly.');
	process.exit(1);
}

if (!web3.utils.isHexStrict(args.account)) {
	console.log('Account must be hex value. such as 0xc1912..');
	process.exit(1);
}

if (!fs.existsSync('./abi/EOSrelay.abi')) {
	console.log('abi file is required');
	process.exit(1);
}

const relayAbi = fs.readFileSync('./abi/EOSrelay.abi').toString();

const options = {
	EOS_URL: (args.eospath)? args.eospath : 'https://api.eosnewyork.io',
	ETHEREUM_URL: (args.ethpath)? args.ethpath : 'http://localhost:8545',
	CHUNK_SIZE: (args.chunksize)? args.chunksize : 5,
	SLEEP_TIME: (args.interval)? Number(args.interval) : 1000 * 60,	// 1 minute
	RELAY_ABI: relayAbi,
	RELAY_ADDRESS: args.address,
	USER_ACCOUNT: args.account,
	GAS: (args.gas)? args.gas : '200000'
};

require('./relay')(options).runRelay();
