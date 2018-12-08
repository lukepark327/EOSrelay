[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![solidity](https://img.shields.io/badge/solidity-0.4.21-brown.svg)](https://img.shields.io/badge/solidity-0.4.21-brown.svg)   

# EOSrelay
![icon](https://github.com/twodude/EOSrelay/blob/master/images/icon.png)

EOSrelay
*(EOS-ETH Relay)*
is a system that allow of using EOS on Ethereum.   
> [The 1st DApp Development Contest](https://medium.com/eosys/the-1st-dapp-contest-d2b714a90adc) Entry Work   
> Based on [PeaceRelay](https://github.com/KyberNetwork/peace-relay)   

## Abstract
EOSrelay is an EOS–ETH relaying smart contract DApp. EOSrelay allows EOS holders to use DApps based on Ethereum eco-system, written in Solidity(or et al.).

**Certain blockchain’s (blockchain system of currency that user is holding)**
information, such as block and transaction information, is verified on
**Target Blockchain (blockchain that user want to use)**
eco-system Platform.
For EOSrelay, EOS’s block and transaction information is verified on Ethereum platform. And the information (mostly the EOS block header) is submitted by relayers.

## Overview
![image_diagram](https://github.com/twodude/EOSrelay/blob/master/images/diagram.png)

*"There is an Ethereum smart contract that stores all ```EOS``` block headers relayed/submitted by users, or relayers."*
refers to the [article](https://medium.com/@loiluu/peacerelay-connecting-the-many-ethereum-blockchains-22605c300ad3) of Lou Luu in KyberNetwork.

As you know, each block header contains committed transactions. Given a block header, anyone will be able to verify if a transaction is included or not. Now we can offer a transfer services from ```EOS``` to ```ETH```.

## Details
1. Tx1 is occurred and included in Block. Tx1 is a locking transaction that sending EOS to certain account.   
2. Relayer registers the header information of the Block (one that include Tx1) on Ethereum.   
3. All the verification processes are executed by smart contract, whether the Tx1 is involved in Block and locking transaction is sent properly.   
4. If the Tx1 is confirmed as verified one, same amount of token is minted on Ethereum.

Users can use DApps based on different blockchain eco-system by using EOSrelay.
For now, it is specialized at connecting EOS to ETH.
And also, users can get experience advantages of both Ethereum and EOS.

Relayers can get fee as reward for submitting the block header to EOSrelay.
But relayers can’t get reward just for submitting information to smart contract.
They only can get reward when the information they gave is verified.

## Environments
* Solidity v0.4.21   
```
pragma solidity ^0.4.21;
```

## Setup
is basically the same as PeaceRelay

### Pre-requisites
There are 2 wallets needed: 1 that does the submitting of block headers,
and another that will submit mint transactions for the smart contracts.

### Contract deployment
The contracts' codes can be found in the [./contracts](https://github.com/twodude/EOSrelay/tree/master/contracts) folder.

## Todo
### Contract Side
* Implement ownable, pausable
* 2-way-relay
*(current 1-way: EOS -> ETH)*

### Daemon Side
* Add & validate relay options
* Support data retrieve from multiple EOS nodes
* Support desktop user interface (GUI application) 

## Milestones
- **Start Date:**
*Nov 21, 2018*   
- MVP running (EOS -> ETH):
*Dec 7, 2018*   
- Add features (ownable, pausable, etc.)   
- Complete Prototype Development (EOS <-> ETH)   
- **End Date:**
*Not decided yet.*

## References
> https://github.com/KyberNetwork/peace-relay   
> https://github.com/twodude/eos-dapp-dev   
> https://github.com/k26dr/eth-eos-relay   

## Designed by
[@Luke Park](https://github.com/twodude)   
[@Keunhak Lim](https://github.com/limkeunhak)   
[@Minseo Park](https://github.com/finchparker)   

## License
The EOSrelay project is licensed under the [Apache License, Version 2.0](https://opensource.org/licenses/Apache-2.0), also included in our repository in the [LICENSE](https://github.com/twodude/EOSrelay) file.
