// SPDX-License-Identifier: MIT
//pragma solidity >=0.6.12 <0.9.0;
pragma solidity ^0.8.8;

contract SimpleStorage{
    //types of variable boolean, string, uint, int, address, bytes
    // preferably to have a specific size 
    //uint256 favoritNumber= 0; 
    //int256 favoritNumberPos=123;
    //bool hasFavoritNumber = true;
   // string favoirtNumberInText = "Five"; //it's basically a byte type only for string
   // address myAddress = 0x300AFFA0753Bc325dF94dD0160847827DE241796;
  //  bytes32  favoritBytes = "cat";
    
    
    //this gets initialized to zero
    uint256 favoritNumber; //we created a getter function when we make the var public
    //People public person = People({favoritNumber:2, name:"Husam"});
    //remember that default is internal
    
    //mapping is a data structure where a key is "mapped" to a single value more like a dictionery 
    mapping(string => uint256) public nameToFavoriteNumber;

    struct People{ //automotically get indexed inside the struct
        uint256 favoritNumber;
        string name;
    }

    
    
    
    
    People[]public people;
    
    function store(uint256 _favoritNumber) public{
        favoritNumber = _favoritNumber;
    }

    //view function can't update anything in the contract
  /*function retrieve () public view returns (uint256){
    return favoritNumber;
   }*/

   function addPerson (string memory _name, uint256 _favoritNumber) public{
    //Data Location calldata, memory, storage
    // memory: means this variable is only temporarly 
    // calldata: non modifiable and non-persistent data location (default for function arguments)
    // Storage: Permenant data (on blockchain and expensive) 
    // Data location can only be specified for array, struct or mapping types and string considered as array of bytes
    People memory newPerson = People(_favoritNumber,_name); 
    people.push(newPerson);
    //Different way to create new persons
    //people.push(People(_favoritNumber, _name));
    //People memory newPerson = People({favoritNumber: _favoritNumber,name:_name});

    nameToFavoriteNumber[_name] = _favoritNumber; //we mapped each name(string) to a a fovirtNumber (uint265)
   }
}

// the contract address -- 0x99CF4c4CAE3bA61754Abd22A8de7e8c7ba3C196d -- 
//anytime we deploy a contract is a transaction 