const args = require('yargs').argv;
const fs = require('fs');

if (args.h) {
	console.log("Usage: node relayd.js --address=<contract address> --abi=<abi path> [Options]");
	console.log();
	console.log("Options");
	console.log();
	console.log("\t--interval=<relaying interval>");
	console.log("\t\t: 컨트랙트를 호출하는 주기를 설정합니다.");
	console.log("\t--chunksize=<chunk size>");
	console.log("\t\t: 한번에 읽어오는 블록 개수를 설정합니다.");
	console.log("\t--eospath=<eos network url>");
	console.log("\t\t: eos 네트워크 정보를 설정합니다.");
	console.log("\t--h");
	console.log("\t\t: 도움말을 출력합니다.");
	console.log();
	process.exit(1);
}

if (!args.address || !args.abi) {
	console.log('Usage: node relayd.js --address=<contract address> --abi=<abi path>');
	console.log('\tHelp: node relayd.js --h ');
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
	SLEEP_TIME: (args.interval)? Number(args.interval) : 1000 * 100,
	RELAY_ABI: relayAbi,
	RELAY_ADDRESS: '0x0a4a4b39bb39b354cc8696757d88cfc856fab488' // args.address
};

require('./relay')(options).runRelay();
