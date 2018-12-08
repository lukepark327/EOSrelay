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
		return contract.methods['getHighestBlockNumber()']().send({ from: account, gas: options.GAS }).then(highestBlockNumber => { return highestBlockNumber; }).catch( ex => { console.log(ex); });
	}

	function submitBlock (blockHash, index, previous, txRoot, axRoot) {
		contract.methods['submitBlock(bytes32,uint256,bytes32,bytes32,bytes32)'](new Buffer(blockHash), Number(index), new Buffer(previous), new Buffer(txRoot), new Buffer(axRoot)).send({ from: account, gas: options.GAS }).then(receipt => { console.log(receipt); }).catch( ex => { console.log(ex); });
	}

	function submitTrx (blockHash, trxHash, from, to, amount) {
		contract.methods['submitTrx(bytes32,bytes32,string,string,uint256)'](new Buffer(blockHash), new Buffer(trxHash), from, to, amount).send({ from: account, gas: options.GAS }).then(receipt => { console.log(receipt); }).catch( ex => { console.log(ex); });
	}

	function sleep (ms) {
		return new Promise (resolve => setTimeout(resolve, ms));
	}

	return {
		runRelay: async function () {
			while(1) {
				let lastBlockHeight = await getLastBlockHeight();
				for (let i=0; i < chunkSize; i++) {
					lastBlockHeight += 1;
					let blockInfo = await getBlockInfo(lastBlockHeight);
					if (blockInfo != -1) {
						submitBlock(blockInfo.id, blockInfo.block_num, blockInfo.previous, blockInfo.transaction_mroot, blockInfo.action_mroot);
						blockInfo.transactions.forEach((element) => {	
							if (element.trx.transaction) {
								submitTrx(blockInfo.id, element.trx.id, element.trx.transaction.actions[0].data.from, element.trx.transaction.actions[0].data.to, element.trx.transaction.actions[0].data.quantity);
							} else {
								submitTrx(blockInfo.id, element.trx.id, null, null, null);
							}
						});
					}
				}
				await sleep(interval);
			}
		}
	};
};

