pragma solidity ^0.5.0;

contract EOSrelay {
    uint256 public genesisBlock;
    uint256 public highestBlock;
  
    struct BlockHeader {
        uint256 previous;   // previous
        bytes32 txRoot;     // transaction_mroot
        bytes32 axRoot;     // action_mroot
    }
    
    mapping(uint256 => BlockHeader) public blocks;

    constructor (uint256 blockNumber) public {
        genesisBlock = blockNumber;
        highestBlock = blockNumber;
    }
    
    function resetGenesisBlock(uint256 blockNumber) public {
        genesisBlock = blockNumber;
        highestBlock = blockNumber;
    }
    
    function submitBlock(uint256 blockHash, bytes memory context) public {
        BlockHeader memory header = parseBlockHeader(context);
        uint256 blockNumber = getBlockNumber(context);
        
        if (blockNumber > highestBlock) {
            highestBlock = blockNumber;
        }
        
        blocks[blockHash] = header;
    }
    
    function parseBlockHeader(bytes memory context) pure internal returns (BlockHeader memory header) {
        "Todo: decoder";
        
        return header;
    }
    
    function getBlockNumber(bytes memory context) pure internal returns (uint blockNumber) {
        "Todo: decoder";
        
        blockNumber = 0;
    }

    function getTxRoot(uint256 blockHash) public view returns (bytes32) {
        return blocks[blockHash].txRoot;
    }

    function getAxRoot(uint256 blockHash) public view returns (bytes32) {
        return blocks[blockHash].axRoot;
    }
}
