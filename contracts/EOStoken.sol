pragma solidity ^0.4.21;

import "./SafeMath.sol";
import "./ERC20.sol";
import "./EOSrelay.sol";

contract EOStoken is ERC20 {
    using SafeMath for uint256;
    
    EOSrelay public relay;
    
    string public EOSLockingAddr;
    
    uint public totalSupply;
    mapping(address => mapping (address => uint)) allowed;
    mapping(address => uint) balances;
    
    /* EOStoken */
    function EOStoken(address EOSrelayAddr) public {
        totalSupply = 0;
        relay = EOSrelay(EOSrelayAddr);
    }
    
    function changeEOSrelayAddr(address _EOSrelayAddr) public {
        relay = EOSrelay(_EOSrelayAddr);
    }
    
    function changeEOSLockingAddr(string _EOSLockingAddr) public {
        EOSLockingAddr = _EOSLockingAddr;
    }
    
    /* mint */
    function mint(uint256 _value, bytes32 blockHash, bytes32 trxHash, address newAddress)
    public
    returns (bool) {
        if (relay.isTrxInBlock(blockHash, trxHash)) {
            require(relay.isAddressValid(trxHash, EOSLockingAddr));
            
            totalSupply = totalSupply.add(_value);
            balances[newAddress] = balances[newAddress].add(_value);
            
            return true;
        }
        return false;
    }
    
    /* burn */
    function burn(uint256 _value)
    public
    returns (bool) {
        // safeSub already has throw, so no need to throw
        balances[msg.sender] = balances[msg.sender].sub(_value);
        totalSupply = totalSupply.sub(_value);
        
        return true;
    }
    
    /* others */
    function transfer(address _to, uint _value) public returns (bool) {
        // safeSub already has throw, so no need to throw
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint _value) public returns (bool) {
        uint256 allowance = allowed[_from][msg.sender];
    
        balances[_from] = balances[_from].sub(_value);
        allowed[_from][msg.sender] = allowance.sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(_from, _to, _value);
        return true;
    }
    
    function balanceOf(address _owner) public constant returns (uint) {
        return balances[_owner];
    }
    
    function approve(address _spender, uint _value) public returns (bool) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    function allowance(address _owner, address _spender) public constant returns (uint) {
        return allowed[_owner][_spender];
    }
    
    // Non-payable unnamed function prevents Ether from being sent accidentally
    function () public {}
}
