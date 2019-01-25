/*
Copyright 2019 de la Dirección General de Sistemas Informáticos – Secretaría Legal y Técnica - Nación.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 2 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/
*/
pragma solidity ^0.4.24;

contract Stamper {
    event Stamped(address indexed from, string indexed hash, string indexed ots);

    event Deploy(address indexed from);
    event SelfDestroy(address indexed from);

    struct Dato {
        uint blockNumber;
        string hash;
    }
    mapping (string => Dato) private hashstore;
    address owner;

    constructor() public {
        owner = msg.sender;
        emit Deploy(msg.sender);
    }

    function stamp(string ots, string file_hash) public {
        if (hashstore[ots].blockNumber == 0) {
            emit Stamped(msg.sender, file_hash, ots);
            hashstore[ots] = Dato({blockNumber: block.number, hash: file_hash});
        }
    }

    function verify(string ots, string file_hash) public view returns(bool){
        Dato memory dato = hashstore[ots];
        return stringsEqual(dato.hash, file_hash);
    }

    function getHash(string ots) public view returns(string){
        Dato memory dato = hashstore[ots];
        return dato.hash;
    }

    function getBlockNumber(string ots) public view returns(uint){
        Dato memory dato = hashstore[ots];
        return dato.blockNumber;
    }

    function stringsEqual(string memory _a, string memory _b) internal pure returns (bool) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);

        if (keccak256(a) != keccak256(b)) { return false; }
        return true;
    }
}