const axios = require('axios');
const Web3 = require('web3');
const fs = require('fs');
const web3 = new Web3('http://localhost:8545');

module.exports = (options) => {
	const relayOptions = options;
	console.log(options);
	const contract = new web3.eth.Contract(JSON.parse(options.RELAY_ABI), options.RELAY_ADDRESS);

	return {
		relayAbi: relayOptions.RELAY_ABI,
		relayAddress: relayOptions.RELAY_ADDRESS,
		chunkSize: relayOptions.CHUNK_SIZE,
		eos_mainnet_url: relayOptions.EOS_MAINNET_URL,
		interval: relayOptions.SLEEP_TIME,
		contract: contract,
		runRelay: async () => {
			while(1) {
				let lastBlockHeight = this.getLastBlockHeight();
				let blockInfo = await this.getBlockInfo(lastBlockHeight);
				if (blockInfo != -1) {
					this.summitBlock(blockInfo.id, blockInfo.block_num, blockInfo.previous, blockInfo.transaction_mroot, blockInfo.action_mroot);
					blockInfo.transactions.forEach((element) => {
						this.summitTrx(blockInfo.id, element.trx.id);
						console.log(element.trx.transaction);
					});
				}
				await sleep(this.interval);
			}
		},
		getBlockInfo: (blockNum) => {
			return axios.post(EOS_MAINNET_URL + '/v1/chain/get_block', { 'block_num_or_id':blockNum })
				.then((result) => { return result.data; }).catch((ex) => { return -1; });
		},
		getLastBlockHeight: () => {
			// get latest number of block on eth contract
			return 30000001;
		},
		submitBlock: (blockHash, index, previous, txRoot, axRoot) => {
			console.log('blockHash: ' + blockHash + ' index: ' + index + ' previous: ' + previous + ' txRoot: ' + txRoot + ' axRoot: ' + axRoot);
		},
		submitTrx: (blockHash, trxHash, from, to, amount) => {
			console.log('blockHash: ' + blockHash + ' trxHash: ' + trxHash + ' from: ' + from + ' to: ' + to + ' amount: ' + amount);
		},
		sleep: (ms) => {
			return new Promise (resolve => setTimeout(resolve, ms));
		}
	}
}

