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

let relayAbi = fs.readFileSync('/home/limkeunhak/Workspace/blockchain-ethereum/contracts/compiled/EOSrelay.abi').toString();
let relayAddress = "0x0a4a4b39bb39b354cc8696757d88cfc856fab488"

var contract = new web3.eth.Contract(JSON.parse(relayAbi), relayAddress);

console.log(contract.methods['submitBlock(uint256,bytes)']);

contract.methods['submitBlock(uint256,bytes)'](123123123, new Buffer("test")).send({from:"0x051977ed8e503d3140e3ae8ecc645b3c9245acc6", gas:2000000}).then(receipt => { console.log(receipt); console.log("!!"); }).catch(ex => { console.log(ex); console.log("??");} );

run();

async function run () {
	while(1) {
		let lastBlockHeight = getLastBlockHeight();
		let blockInfo = await getBlockInfo(lastBlockHeight);
		if (blockInfo != -1) {
			// console.log(blockInfo);
		}
		await sleep(SLEEP_TIME);
	}
}

function getBlockInfo (blockNum) {
	return axios.post(EOS_MAINNET_URL + "/v1/chain/get_block", { "block_num_or_id":blockNum }).then((result) => { return result.data; }).catch((ex) => { return -1; });
}

function getLastBlockHeight () {
	// get latest number of block on eth contract
	return 1000000;
}

function sleep (ms) {
	return new Promise (resolve => setTimeout(resolve, ms));
}
