---
title: Marlowe TypeScript SDK
sidebar_position: 2
---

## Introduction
The **[Marlowe TypeScript SDK (TS-SDK)](https://github.com/input-output-hk/marlowe-ts-sdk/)** consists of JavaScript and TypeScript libraries (npm packages). It's engineered to support DApp developers with the tools they need to build and integrate with the Marlowe smart contract ecosystem on the Cardano blockchain. 

## Features at a glance

1. **Smart contract toolkit**: Craft, deploy, and manage Marlowe smart contracts on the Cardano blockchain with the tools and libraries in the TS-SDK.(see [@marlowe.io/language-core-v1](https://input-output-hk.github.io/marlowe-ts-sdk/modules/_marlowe_io_wallet.html](https://input-output-hk.github.io/marlowe-ts-sdk/modules/_marlowe_io_language_core_v1.html)) and [@marlowe.io/marlowe-object](https://input-output-hk.github.io/marlowe-ts-sdk/modules/_marlowe_io_marlowe_object.html)).   
2. **Integration with Marlowe Playground**: The TS-SDK works well with the [Marlowe Playground](https://play.marlowe.iohk.io/), an online interface dedicated to designing, simulating, and scrutinizing Marlowe contracts.
4. **Wallet connectivity**: With built-in modules (`CIP-30`, `Lucid` adapters), the TS-SDK promotes smooth interactions with various wallet extensions ('Lace, `Nami`,`Eternl` etc..). This ensures easy access to wallet data and the efficient integration of Marlowe contracts with a variety of wallet interfaces (see [@marlowe.io/wallet](https://input-output-hk.github.io/marlowe-ts-sdk/modules/_marlowe_io_wallet.html)). 
5. **Integration with the Runtime** : We aim to provide a Runtime Rest Client which is 1-1 feature parity with [`marlowe-runtime-web`](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-runtime-web), so you can benefit from all the Runtime features in a JavaScript and TypeScript Environment (see [@marlowe.io/runtime-rest-client](https://input-output-hk.github.io/marlowe-ts-sdk/modules/_marlowe_io_runtime_rest_client.html)).
6. **Coordination Between Wallets and Runtime** : We provide abstractions over the Runtime Rest Client and the Wallets that remove "plumbing" logic and allows you to focus on your core business logic (see [@marlowe.io/runtime-lifecycle](https://input-output-hk.github.io/marlowe-ts-sdk/modules/_marlowe_io_runtime_lifecycle.html)).    
7. **Prototype DApp examples**: Embark on your DApp journey using the TS-SDK's distilled prototype examples. These prototypes serve as launching pads for your customized applications.

## Getting started

Please look at the [README.md](https://github.com/input-output-hk/marlowe-ts-sdk/) of the Github Repository.. Examples, Detailed Documentation, small tools are available, allowing a quick overview of the Marlowe TS-SDK and its capabilities. 

This **[Marlowe TypeScript SDK (TS-SDK)](https://github.com/input-output-hk/marlowe-ts-sdk/)** is released under an open source license, it can be read, used, deployed, customized, improved, forked at will. Look at different parts of our Github Repository and especially the [Discussions](https://github.com/input-output-hk/marlowe-ts-sdk/discussions) Section.  

Don't hesitate to provide feedback and particapte to its development, the team will be supportive and will continue to progress in that direction. 

## Marlowe Contract Examples 

These contract examples are released under an open source license within our npm package [`@marlowe.io/language-examples`](https://input-output-hk.github.io/marlowe-ts-sdk/modules/_marlowe_io_language_examples.html).They can be read, customized, improved, forked at will. 

Don't hesitate to provide feedback, the team will be supportive and will continue to progress in that direction.

- **[Vesting]([https://github.com/input-output-hk/marlowe-ts-sdk/blob/main/pocs/contract-example/vesting-flow.html](https://input-output-hk.github.io/marlowe-ts-sdk/modules/_marlowe_io_language_examples.vesting.html))**: A Vesting Contrat implementation is available in the TS-SDK. It supports the Token Plans Prototype and give you a full implementation of Marlowe Contract used in a Typescript Web-based DApp Environement.
- **Atomic Swap using Open Roles Feature** ([Coming Soon](https://github.com/input-output-hk/marlowe-ts-sdk/issues/86)) : This  Marlowe Contract allows 2 participants (A Seller and a Buyer) to atomically exchange some tokens A against some token B without knowing the Buyer in advance.  

## Open Source Prototypes using the TS-SDK

These Prototypes are released under an open source license. They can be read, deployed, customized, improved, forked at will. 

Don't hesitate to provide feedback, the team will be supportive and will continue to progress in that direction.

- **[Payouts DApp](payouts-dapp-prototype.md)**: This Prototype is an example of a Decentralized application (DApp) designed to help users discover, track, and withdraw tokens from Marlowe smart contracts that use role tokens. It enables holders of role tokens in Marlowe smart contracts to withdraw the received funds, simplifying the process of tracking and withdrawing their payouts.
- **[Token Plans DApp GitHub Repository](https://github.com/input-output-hk/marlowe-token-plans)**: This prototype is  a demonstration on how to build DApps powered by Marlowe with well-known mainstream web technologies such as `Typescript` and `React Framework`. A use case of a vesting contract developed and available in the Marlowe ts-sdk. allows you to create ₳ Token Plans over Cardano. ₳ Token Plans can be created by a "Token Provider." The Provider will deposit a given ₳ amount with a time-based scheme defining how to release these ₳ over time to a "Claimer" Participant.
- **Order Book Swap Prototype** : (Coming soon) This prototype will demonstrate our new Marlowe Open Roles feature by using a ([new Atomic Swap Contract](https://github.com/input-output-hk/marlowe-ts-sdk/issues/86)).     

  

