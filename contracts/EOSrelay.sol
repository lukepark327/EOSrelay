pragma solidity ^0.4.8;

contract EOSrelay {
    /* Block index */
    uint256 public genesisBlockNumber;
    uint256 public highestBlockNumber;
  
    /* Block */
    struct BlockHeader {
        uint256 index;      // block_num
        bytes32 previous;   // previous
        bytes32 txRoot;     // transaction_mroot
        bytes32 axRoot;     // action_mroot
        bytes32[]  trxHeaders;
    }
    mapping(bytes32 => BlockHeader) public blocks;

    /* Transaction */
    struct Transaction {
        string  _from;
        string  _to;
        uint256 _amount;     // quantity
    }
    mapping(bytes32 => Transaction) public trxs;    
    
    /* EOSrelay */
    function EOSrelay (uint256 blockNumber) public {
        genesisBlockNumber = blockNumber;
        highestBlockNumber = blockNumber;
    }
    
    function resetGenesisBlock(uint256 blockNumber) public {
        genesisBlockNumber = blockNumber;
        highestBlockNumber = blockNumber;
    }

    function submitBlock(bytes32 blockHash, uint256 index, bytes32 previous, bytes32 txRoot, bytes32 axRoot)
    public {
        bytes32[] memory blankTrxHeaders;
        BlockHeader memory newBlockHeader = BlockHeader(index, previous, txRoot, axRoot, blankTrxHeaders);
        
        if (index > highestBlockNumber) {
            highestBlockNumber = index;
        }
        
        blocks[blockHash] = newBlockHeader;
    }
    
    function submitTrx(bytes32 blockHash, bytes32 trxHash, string memory _from, string memory _to, uint256 _amount)
    public {
        Transaction memory newTrx = Transaction(_from, _to, _amount);
        trxs[trxHash] = newTrx;
        
        blocks[blockHash].trxHeaders.push(trxHash);
    }
    
    function isTrxInBlock(bytes32 blockHash, bytes32 trxHash)
    public
    constant
    returns (bool){
        uint256 len = blocks[blockHash].trxHeaders.length;
        for(uint256 i=0; i<len; i++){
            if (blocks[blockHash].trxHeaders[i] == trxHash) {
                return true;
            }
        }
        return false;
    }
    
    function getTxRoot(bytes32 blockHash) public constant returns (bytes32) {
        return blocks[blockHash].txRoot;
    }

    function getAxRoot(bytes32 blockHash) public constant returns (bytes32) {
        return blocks[blockHash].axRoot;
    }
    
    function gethHghestBlockNumber() public constant returns (uint256) {
        return highestBlockNumber;
    }
}
