---
title: Marlowe TypeScript SDK
sidebar_position: 2
---

## Introduction
The **[Marlowe TypeScript SDK (TS-SDK)](https://github.com/input-output-hk/marlowe-ts-sdk/)** consists of JavaScript and TypeScript libraries. It's engineered to support DApp developers with the tools they need to build and integrate with the Marlowe smart contract ecosystem on the Cardano blockchain. 

## Features at a glance

1. **Smart contract toolkit**: Craft, deploy, and manage Marlowe smart contracts on the Cardano blockchain with the tools and libraries in the TS-SDK.
2. **Integration with Marlowe Playground**: The TS-SDK works well with the Marlowe Playground, an online interface dedicated to designing, simulating, and scrutinizing Marlowe contracts.
3. **Wallet connectivity**: With built-in modules, the TS-SDK promotes smooth interactions with various wallet extensions. This ensures easy access to wallet data and the efficient integration of Marlowe contracts with a variety of wallet interfaces.
4. **Prototype DApp examples**: Embark on your DApp journey using the TS-SDK's distilled prototype examples. These prototypes serve as launching pads for your customized applications.

## Getting started
To use the capabilities of the Marlowe TS-SDK, you will need to have a URL to a running instance of the Marlowe Runtime and a compatible wallet extension installed in your browser. Please refer to the **[Marlowe starter kit](https://github.com/input-output-hk/marlowe-starter-kit)** for guidance about accessing a running instance of the Runtime. 

## Prototype examples

- **[Payouts DApp prototype](payouts-dapp-prototype.md)**: Engineered with the Marlowe TS-SDK, this DApp offers a streamlined approach to discerning and extracting payouts from Marlowe contracts on the Cardano blockchain. With a commitment to user experience, it ensures intuitive interactions and unhindered connectivity to the Cardano network.
- **[Vesting prototype repo](https://github.com/input-output-hk/marlowe-vesting)**: Manages the phased allocation of shares over a designated time frame. Users can easily retrieve shares upon vesting. Tailored for projects that require the following sorts of capabilities: 
  - Tokenomics orchestration
  - Timed fund safeguards
  - Pre-planned fund distributions to diverse stakeholders. 
  
- **[Vesting prototype example](https://github.com/input-output-hk/marlowe-ts-sdk/blob/main/pocs/contract-example/vesting-flow.html)**: Shows you a concrete instance of how to use the vesting prototype repo and the kinds of use cases it enables. 
