
// SPDX-License-Identifier: MIT
//pragma solidity >=0.6.12 <0.9.0;
pragma solidity ^0.8.8;

import "./SimpleStorage.sol" ;

contract StorageFactory{

  SimpleStorage[] public simpleStorageArray;

  function createSimpleStorageContract() public{
    SimpleStorage simpleStorage = new SimpleStorage();
    simpleStorageArray.push(simpleStorage);
  }

function sfStore (uint256 _simpleStorageIndex, uint256 _simpleStorageNumber) public{
    //Address
    //ABI -Application Binary Interface 
    SimpleStorage simpleStorage = simpleStorageArray[_simpleStorageIndex];
    simpleStorage.store(_simpleStorageNumber);

    //this is another way to do exactly the same as above
    //simpleStorageArray[_simpleStorageIndex].store(_simpleStorageNumber);
}

function sfGet(uint256 _simpleStorageIndex) public view returns(uint256){
    SimpleStorage simpleStorage = simpleStorageArray[_simpleStorageIndex];
    return simpleStorage.retrieve();

    //this is another way to do exactly the same as above
    //return simpleStorageArray[_simpleStorageIndex].retrieve();
    
}

}