---
title: Roles in Marlowe
sidebar_position: 5
---

Generally speaking, participants are actors in a smart contract. These participants fulfill roles that specify the ability to execute certain actions in the contract.

Roles can be hardcoded addresses, pre-determined prior to launching a contract or determined after launching a contract.

These roles are uniquely identified using role tokens.

## Role tokens

Role tokens are used to identify roles to authorize transactions providing additional security and flexibility for your smart contracts. They are handled implicitly by the Marlowe Runtime. 

Each participant in a Marlowe contract has a role and each role has its own token. These tokens can be transferred between users in a peer-to-peer manner, allowing a participant to give their role to someone else.

There could be one or many tokens for a specific role.

Role tokens are distributed at contract initialization.

You can view these role tokens in your wallet under NFTs/Assets with a name reflective of the name specified for the role in the smart contract. (In Nami, Lace does not carry the name over from the DApp to the asset.) 

When designating an address after launching the contract, the open roles feature is used. 

## Open roles

'Open roles' allows for the specification of an address after contract deployment that is not known at deployment time.

When using open roles, the Marlowe contract sends the role tokens to a validator script that holds them until you specify an address later, at which time they are sent to the appropriate address.

This feature is best used when a developer is deploying a smart contract where certain addresses are unknown. It could be one address or all addresses associated with a contract.

The developer would deploy a contract that could be verified on-chain before a user interacts with it. The user initiates some action, like a deposit or choice, which triggers the smart contract to assign them the appropriate role and distribute the role token from the validator script.

The developer just needs to specify the `OpenRoles` type when setting participants in a contract, the rest is handled behind the scenes by the Marlowe Runtime. 

Because we have now introduced a separate validator script to help with our smart contract, we need to assign a 'thread token.'

### Thread tokens

Much like a role token is tied to a participant, a thread token is tied to a contract instance.

Thread tokens are required for the validator script to be able to determine which 'thread' of role tokens to track, where 'threads' are instances of a contract. Without it, the script would not know which contract to apply the role tokens to.
