// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

// Interface for ERC20 tokens (USDC)
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract BazuuSave {
    address public owner;
    IERC20 public usdcToken; 
    uint256 public lockPeriod = 30 days; 
    uint256 public savingsReturnRate = 2; // Percentage (2%)

    struct SavingsAccount {
        uint256 amount;
        uint256  lockUntil;
        bool active;
    }

    // Mappings store user data  
    mapping(address => SavingsAccount) public savings;

    // Events
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 interest); 
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address _usdcTokenAddress) {
        owner = msg.sender;
        usdcToken = IERC20(_usdcTokenAddress);
    }
//Deposit function - in usdc  and have the correct user contract
    function deposit(uint256 _amount) external  {
        require(_amount > 0, "Amount must be greater than 0");
        require(usdcToken.balanceOf(msg.sender) >= _amount, "Insufficient USDC balance");
        require(usdcToken.allowance(msg.sender, address(this)) >= _amount, "Insufficient allowance");
        require(usdcToken.transferFrom(msg.sender, address(this), _amount), "Transfer Failed");

        SavingsAccount storage account = savings[msg.sender];
    account.amount += _amount;
    account.lockUntil = block.timestamp + lockPeriod;
    account.active = true;
   
        emit Deposited(msg.sender, _amount);
    }
// function withdraw - in usdc after lock period
    function withdraw() external {
        SavingsAccount storage account = savings[msg.sender];

        require(account.active, "No savings to withdraw");
        require(block.timestamp >= account.lockUntil, "Savings still locked"); 
        
        uint256 amount = account.amount;
        uint256 returnAmount = (amount * savingsReturnRate) / 100;
        uint256 totalAmount = amount + returnAmount;
        
        account.amount = 0;
        account.active = false;
          
        require(usdcToken.transfer(msg.sender, totalAmount), "Transfer Failed"); 

        emit Withdrawn(msg.sender, totalAmount, returnAmount);
    }
    
    // // balance function - Check User's  savings balance
        function getBalance(address _user) external view returns (uint256, uint256, bool) {
        SavingsAccount memory account = savings[_user];
        return (account.amount, account.lockUntil, account.active);
    }

    // Admin function to update parameters
    function updateParameters(
        uint256 _lockPeriod,
        uint256 _savingsReturnRate
    ) external onlyOwner {
        lockPeriod = _lockPeriod;
        savingsReturnRate = _savingsReturnRate;
    }

    // Emergency Withdrawal function (ONly Owner)
    function emergencyWithdraw(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Amount must be greater than 0");
        require(usdcToken.transfer(owner, _amount), "Transfer Failed");
    }

    // Get Total Savings
    function getTotalSavings() external view returns (uint256) {
        return usdcToken.balanceOf(address(this));
    }
}