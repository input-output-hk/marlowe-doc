---
title: Marlowe's On-Chain Limitations
sidebar_position: 7
---

When developing smart contracts for Marlowe, there are a series of considerations before running in production on mainnet. Highly recommended documentation to review are [best practices](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/best-practices.md) and [security](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/security.md) considerations.

The Marlowe Playground is a useful tool to simulate contracts, perform static analysis, and provide warnings. However, there can still be edge cases that might prevent successful execution. In addition to tooling, it is important to run all execution paths of the contract on testnet and preprod networks. Running a smaller scale of the contract on mainnet is also a good idea to catch any unexpected behavior.

Below are a list of on-chain limitations that could potentially lock funds in a contract forever. While Marlowe runtime tooling at versions >0.0.4 will show warnings for these cases, it is important to be aware of them and take corrective action prior to deployment on mainnet.

## Character limit of role and token names

The length of a role name is limited to 32 bytes.

Marlowe runtime tooling will show warnings if this limit is exceeded. However this does not prevent submitting the transaction. If this limit is exceeded, parts of the smart contract requiring the role will be unreachable.

## Transaction exceeding UTXO size limits

The Cardano protocol parameters limit the size of a transaction to 16,384 bytes.

Although a contracts initial state can be under this limit, subsequent transactions can exceed this limit and cause funds to be locked permanently. While Marlowe runtime can emulate transactions and warn if they currently exceed the limit under protocol parameters, it does not guarantee the transaction will succeed. An example of how this happens is a wallet with a large number of UTXOs. These UTXOs contribute to the transaction size. [Merkelization](./large-contracts.md#when-to-merkleize) is an approach to reduce transaction size, but Marlowe does not yet support compressing the state of the contract stored on-chain.

## Exceeding transaction cost limits

Execution costs from too much logic in a transaction can potentially lead to funds becoming locked permanently.

Moreover, the Marlowe validator will typically have an upper limit to the number of accounts between 3 to 5 depending on the contract state, and payment transactions are limited to 3 accounts. Exceeding the number of accounts in a transaction will look funds within that contract. Marlowe runtime can check for such cases through `marlowe-cli run analyze --execution-cost`, but this is also another case to consider executing all paths of a contract on a testnet.

## Invalid Transaction Address

Passing an invalid address will cause a transaction to fail.

A case study is when a testnet address was passed into a Marlowe contract on mainnet. A [contract](https://mainnet.marlowescan.com/contractView?tab=state&contractId=3e5d0ac37fc61e2c635cac9eccd98d5caef8b09eed3e6c6256453eaead093b21%231) failed Cardano's node check for a valid address and locked 2 ada on mainnet. Marlowe runtime will provide a warning if there is an invalid address in the contract.
