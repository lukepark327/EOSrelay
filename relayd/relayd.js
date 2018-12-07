const args = require('yargs').argv;
const axios = require('axios');
const Web3 = require('web3');
const fs = require('fs');
const web3 = new Web3('http://localhost:8545');

if (!args.account || !args.address) {
	console.log("Usage: node relayd.js --account=<your eth account> --address=<contract address>");
	return;
}

const EOS_MAINNET_URL = "https://api.eosnewyork.io";
const CHUNK_SIZE = 5;
const SLEEP_TIME = 1000 * 10; // 10 sec. it will be changed

if (!fs.existsSync('../build/EOSrelay.abi')) {
	console.log("You should compile contracts to get abi file.");
	return;
}

const RELAY_ABI = fs.readFileSync('../build/EOSrelay.abi').toString();
const RELAY_ADDRESS = args.address; //"0x0a4a4b39bb39b354cc8696757d88cfc856fab488";

let contract = new web3.eth.Contract(JSON.parse(RELAY_ABI), RELAY_ADDRESS);

// contract.methods['submitBlock(uint256,bytes)'](123123123, new Buffer("test")).send({from:"0x051977ed8e503d3140e3ae8ecc645b3c9245acc6", gas:2000000}).then(receipt => { console.log(receipt); console.log("!!"); }).catch(ex => { console.log(ex); console.log("??");} );

run();

async function run () {
	while(1) {
		let lastBlockHeight = getLastBlockHeight();
		let blockInfo = await getBlockInfo(lastBlockHeight);
		if (blockInfo != -1) {
			summitBlock(blockInfo.id, blockInfo.block_num, blockInfo.previous, blockInfo.transaction_mroot, blockInfo.action_mroot);
			blockInfo.transactions.forEach((element) => {
				summitTrx(blockInfo.id, element.trx.id);
				console.log(element.trx.transaction);
			});
		}
		await sleep(SLEEP_TIME);
	}
}

function getBlockInfo (blockNum) {
	return axios.post(EOS_MAINNET_URL + "/v1/chain/get_block", { "block_num_or_id":blockNum }).then((result) => { return result.data; }).catch((ex) => { return -1; });
}

function getLastBlockHeight () {
	// get latest number of block on eth contract
	return 30000001;
}

function summitBlock(blockHash, index, previous, txRoot, axRoot) {
	console.log("blockHash: " + blockHash + " index: " + index + " previous: " + previous + " txRoot: " + txRoot + " axRoot: " + axRoot);
}

function summitTrx(blockHash, trxHash, from, to, amount) {
	console.log("blockHash: " + blockHash + " trxHash: " + trxHash + " from: " + from + " to: " + to + " amount: " + amount);
}

function sleep (ms) {
	return new Promise (resolve => setTimeout(resolve, ms));
}
