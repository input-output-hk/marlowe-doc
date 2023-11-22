---
title: Runner
sidebar_position: 6
---

## A developer tool and a DApp for running contracts on the blockchain

Runner is a user-friendly developer tool and a simple DApp you can use to deploy and execute your contract on Cardano right from the browser, whether you are deploying to the preview, pre-production or mainnet network. 

Runner makes contract deployment simple for both DApp builders and traditional developers, enabling the execution of contracts created in Playground without requiring any backend orchestration or programming knowledge. 

## Customizable DApp template

Furthermore, Marlowe Runner is an [**open-source developer application**](https://github.com/input-output-hk/marlowe-runner), making it easy for you to replicate it to create a customized end-user interface. So, not only does it serve as a tool for running contracts on the blockchain, but also as a customizable DApp template that you can use to create your own custom DApp for your precise use case.

## Simple to use

Using Runner requires no knowledge of command-line tools, so it is quite simple and intuitive to use. You will only need to specify the network you want to work with, connect a wallet that is on the same network, and have your password details available so that you can sign transactions with your wallet. You will also need to have any required tokens or funds available in your wallet. 

### Deploying your contract

Once you have finished creating, simulating and testing your Marlowe smart contract in the Playground, you can deploy your smart contract to Runner by using one of these methods: 

1. From the Playground, select 'Send to Simulator,' then 'Export to Marlowe Runner.'
2. Alternatively, download your contract from the Playground as a JSON file, then upload it to Runner. 

> * [**Access Runner on the preview network**](https://preview.runner.marlowe.iohk.io/)
> * [**Access Runner on the pre-production network**](https://preprod.runner.marlowe.iohk.io/)

## Technical details

### Roles 

When a contract that uses roles is submitted to Runner, Runner will always prompt the user to provide addresses for each role. 

### Minting role tokens 

Runner will mint the role tokens that are required by the contract. Whoever has the tokens will have authorization to be a party to that contract. (The actual minting is performed by Runtime.) 

### Source graph view 

When building a contract DApp from the TS-SDK, Haskell, PureScript, or other languages, viewing it in Runner can be useful for analyzing the contract’s logic from the 'Source' graph view. 

### Advancing the contract

Buttons become active when actions are available for the contract role that is associated with your wallet address. If an action button is not activated, it means that the contract state is waiting for another party to the contract to take an action. 

### Deposits and choices

Depending on the conditions of the contract and your role, you may have options to make certain choices and to deposit funds. 

### Withdrawal

When a contract provides for ada or other tokens to be withdrawn, the withdrawal functionality displays in Runner. An authorized wallet and signature is required to make a withdrawal. 

### Merkleization 

While Marlowe supports merkleization, Runner does not yet support it. 

### State 

The state of Marlowe contracts is determined by the inputs to the contract at each step, making the contract’s behavior easier to understand and predict. 

## Wallets

Runner supports web3 wallets [**Lace**](https://www.lace.io/), [**Nami**](https://namiwallet.io/), and [**Eternl**](https://eternl.io/app/mainnet/welcome).  

Currently, Runner does not work with hardware wallets such as Ledger and Trezor. 

## More complex and sophisticated contracts

For especially complex and sophisticated contract scenarios, you may need to customize your approach. Runner is not intended yet to be able to manage very complex contracts. 

### Suitable contracts for Runner

Contracts that fit and execute on the chain will work in Runner. Contract examples that are included within Playground are suitable for Runner. 

## Considerations before you deploy

### On-chain limitations

There are certain on-chain limitations relating to character limits of role and token names, transaction size, transaction cost limits, the number of accounts, invalid transaction addresses, Runtime tooling warnings, and testing that are recommended to be aware of. For details, please see: 

- **[Marlowe's on-chain limitations](../platform-and-architecture/on-chain-limitations)**

- **[A comprehensive guide to Marlowe's security: audit outcomes, built-in functional restrictions, and ledger security features](https://iohk.io/en/blog/posts/2023/06/27/a-comprehensive-guide-to-marlowes-security-audit-outcomes-built-in-functional-restrictions-and-ledger-security-features/)**

