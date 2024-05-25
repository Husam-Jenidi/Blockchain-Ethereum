//Get funds from users
//Withdraw funds
//Set a minimum funding value in Euro

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
import "./PriceConverter";

contract FundMe{
    using PriceConverter for uint256;
    uint256 public minimumEuro= 50 *1e18; //1*10^18

    address [] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    function fund() public payable { //smart contracts can hold funds just like how wallets can
        
        //want to be able to set a minimum fund amount in Euro
        //1. How do we send ETH to this contract?
        
        //what is revert? if a function returns a revert, that means it undo all the changes that have been done before in the function

        //the require function check the first argument, if it's false go ahead revert with the error message
        require(msg.value.getConversionRate >= minimumEuro, "Didn't send enough!"); //1e18 == 1*10^18 
        funders.push(msg.sender); // msg.sender and msg.value are alwas available to get
        addressToAmountFunded[msg.sender]=msg.value;
    }

   

    //function withdraw(){}

}