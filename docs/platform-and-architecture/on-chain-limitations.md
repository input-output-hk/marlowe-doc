---
title: Marlowe's on-chain limitations
sidebar_position: 7
---

When developing smart contracts for Marlowe, there are a series of considerations to take into account before running them in production on mainnet. Highly recommended documents to review are **[Best Practices for Marlowe on Cardano](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/best-practices.md)** and the **[Marlowe Security Guide](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/security.md)**.

The Marlowe Playground is a useful tool to simulate contracts, to perform static analysis, and to provide warnings. However, there can still be edge cases with certain characteristics that might prevent successful execution. In addition to tooling, it is important to run all execution paths of the contract on testnet and preprod networks. Running a smaller scale version of the contract on mainnet is also a good method for catching any unexpected behavior.

## Marlowe Runtime tooling v0.0.4 and later provides warnings

While Marlowe Runtime tooling version 0.0.4 and later will show warnings for these cases, it is important to be aware of them and to take corrective action when necessary prior to deploying smart contracts on mainnet.

Below is a list of on-chain limitations that have the potential to lock funds in a contract forever. 

## Character limit of role and token names

The length of a role name is limited to 32 bytes.

Marlowe Runtime tooling will show warnings if this limit is exceeded. However, this does not prevent you from submitting the transaction. If this limit is exceeded, parts of the smart contract requiring the role will be unreachable.

## Transaction exceeding UTXO size limits

The Cardano protocol parameters limit the size of a transaction to 16,384 bytes.

Although a contract's initial state can be under this limit, subsequent transactions can exceed this limit and cause funds to be locked permanently. While Marlowe Runtime can emulate transactions and warn if they currently exceed the limit under protocol parameters, it does not guarantee that the transaction will succeed. For example, when a wallet has a large number of UTXOs, these UTXOs contribute to the transaction size. **[Merkleization](./large-contracts.md#when-to-merkleize)** is an approach to reduce transaction size, but Marlowe does not yet support compressing the state of the contract stored on-chain.

## Exceeding transaction cost limits

Execution costs from too much logic in a transaction can potentially lead to funds becoming locked permanently.

Moreover, the Marlowe validator will typically have an upper limit of between 3 and 5 for the number of accounts, depending on the contract state, and payment transactions are limited to 3 accounts. Exceeding the number of accounts in a transaction will lock funds within that contract. While Marlowe Runtime can check for such cases through `marlowe-cli run analyze --execution-cost`, this is an example of a situation where it is worth considering executing all paths of a contract on testnet before deploying on mainnet. 

## Invalid transaction address

Passing an invalid address will cause a transaction to fail.

An **[instance]((https://mainnet.marlowescan.com/contractView?tab=state&contractId=3e5d0ac37fc61e2c635cac9eccd98d5caef8b09eed3e6c6256453eaead093b21%231))** of this occurred when a testnet address was passed into a Marlowe contract on mainnet. The contract failed Cardano's node check for a valid address and locked 2 ada on mainnet. Marlowe Runtime  tooling version 0.0.4 and later will provide a warning if there is an invalid address in the contract.
