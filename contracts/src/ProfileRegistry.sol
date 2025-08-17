// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/// @title Profile Registry
/// @notice Simple registry that maps an owner address to a profile CID (IPFS)
contract ProfileRegistry {
    mapping(address => string) private _profiles;

    event ProfileSet(address indexed owner, string cid);

    /// @notice Set the profile CID for the message sender
    /// @param cid The IPFS CID (or any string) representing the profile
    function setProfile(string calldata cid) external {
        _profiles[msg.sender] = cid;
        emit ProfileSet(msg.sender, cid);
    }

    /// @notice Get the profile CID for an address
    /// @param owner The address to query
    /// @return cid The stored profile CID, or empty string if none
    function getProfile(address owner) external view returns (string memory cid) {
        cid = _profiles[owner];
    }
}
