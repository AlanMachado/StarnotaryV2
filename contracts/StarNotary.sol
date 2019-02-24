pragma solidity >=0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {

    struct Star {
        string name;
    }

    mapping(uint256 => Star) public tokenIdToStarInfo;

    mapping(uint256 => uint256) public starsForSale;

    function createStar(string memory _name, uint256 _tokenId) public {
        Star memory newStar = Star(_name);

        tokenIdToStarInfo[_tokenId] = newStar;

        _mint(msg.sender, _tokenId);
    }

    function putStarForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender);
        starsForSale[_tokenId] = _price;
    }

    function _make_payable(address x) internal pure returns (address payable){
        return address(uint160(x));

    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0);
        uint256 starCost = starsForSale[_tokenId];
        address starOwner = ownerOf(_tokenId);
        require(msg.value >= starCost);

        _transferFrom(starOwner, msg.sender, _tokenId);

        address payable ownerAddressPayable = _make_payable(starOwner);
        ownerAddressPayable.transfer(starCost);

        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }

        starsForSale[_tokenId] = 0;

    }



}