const axios = require('axios');
const Web3 = require('web3');
const fs = require('fs');
const web3 = new Web3('http://localhost:8545');

module.exports = function (options) {
	const relayOptions = options;
	const contract = new web3.eth.Contract(JSON.parse(options.RELAY_ABI), options.RELAY_ADDRESS);
	const relayAbi = relayOptions.RELAY_ABI;
	const relayAddress = relayOptions.RELAY_ADDRESS;
	const chunkSize = relayOptions.CHUNK_SIZE;
	const eosUrl = relayOptions.EOS_MAINNET_URL;
	const interval = relayOptions.SLEEP_TIME;

	function getBlockInfo (blockNum) {
		return axios.post(eosUrl + '/v1/chain/get_block', { 'block_num_or_id':blockNum })
			.then((result) => { return result.data; }).catch((ex) => { return -1; });
	}

	function getLastBlockHeight () {
		// get latest number of block on eth contract
		return 30000001;
	}

	function submitBlock (blockHash, index, previous, txRoot, axRoot) {
		console.log('blockHash: ' + blockHash + ' index: ' + index + ' previous: ' + previous + ' txRoot: ' + txRoot + ' axRoot: ' + axRoot);
	}

	function submitTrx (blockHash, trxHash, from, to, amount) {
		console.log('blockHash: ' + blockHash + ' trxHash: ' + trxHash + ' from: ' + from + ' to: ' + to + ' amount: ' + amount);
	}

	function sleep (ms) {
		return new Promise (resolve => setTimeout(resolve, ms));
	}

	return {
		runRelay: async function () {
			while(1) {
				let lastBlockHeight = getLastBlockHeight();
				let blockInfo = await getBlockInfo(lastBlockHeight);
				if (blockInfo != -1) {
					submitBlock(blockInfo.id, blockInfo.block_num, blockInfo.previous, blockInfo.transaction_mroot, blockInfo.action_mroot);
					blockInfo.transactions.forEach((element) => {
						submitTrx(blockInfo.id, element.trx.id);
						console.log(element.trx.transaction);
					});
				}
				await sleep(interval);
			}
		}
	};
};

