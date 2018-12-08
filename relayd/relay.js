const axios = require('axios');
const Web3 = require('web3');
const fs = require('fs');

module.exports = function (options) {
	// Relay parameter setting
	const relayAbi = options.RELAY_ABI;
	const relayAddress = options.RELAY_ADDRESS;
	const account = options.USER_ACCOUNT;
	const chunkSize = options.CHUNK_SIZE;
	const eosUrl = options.EOS_URL;
	const interval = options.SLEEP_TIME;
	const web3 = new Web3(options.ETHEREUM_URL);
	const contract = new web3.eth.Contract(JSON.parse(options.RELAY_ABI), options.RELAY_ADDRESS);

	// TODO: options type checkinig

	function getBlockInfo (blockNum) {
		return axios.post(eosUrl + '/v1/chain/get_block', { 'block_num_or_id':blockNum }).then((result) => { return result.data; }).catch((ex) => { return -1; });
	}

	async function getLastBlockHeight () {
		// get latest number of block on eth contract
		return contract.methods['getHghestBlockNumber()']().send({ from: account, gas: options.GAS }).then(blockHeight => { return blockHeight; }).catch( ex => { console.log(ex); });
	}

	function submitBlock (blockHash, index, previous, txRoot, axRoot) {
		contract.methods['submitBlock(bytes32,uint256,bytes32,bytes32,bytes32)'](new Buffer(blockHash), Number(index), new Buffer(previous), new Buffer(txRoot), new Buffer(axRoot)).send({ from: account, gas: options.GAS }).then(receipt => { console.log(receipt); }).catch( ex => { console.log(ex); });
		console.log('blockHash: ' + blockHash + ' index: ' + index + ' previous: ' + previous + ' txRoot: ' + txRoot + ' axRoot: ' + axRoot);
	}

	function submitTrx (blockHash, trxHash, from, to, amount) {
		contract.methods['submitTrx(bytes32,bytes32,string,string,uint256)'](new Buffer(blockHash), new Buffer(trxHash), from, to, Number(amount)).send({ from: account, gas: options.GAS }).then(receipt => { console.log(receipt); }).catch( ex => { console.log(ex); });
		console.log('blockHash: ' + blockHash + ' trxHash: ' + trxHash + ' from: ' + from + ' to: ' + to + ' amount: ' + amount);
	}

	function sleep (ms) {
		return new Promise (resolve => setTimeout(resolve, ms));
	}

	return {
		runRelay: async function () {
			while(1) {
				let lastBlockHeight = await getLastBlockHeight();
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

