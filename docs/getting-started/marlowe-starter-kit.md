---
title: Marlowe starter kit
sidebar_position: 3
---

To help jumpstart your Marlowe contract creation experience, we encourage you to fork and clone the **[Marlowe starter kit repository](https://github.com/input-output-hk/marlowe-starter-kit)**. 

The Marlowe starter kit provides tutorials for developers to learn and run simple Marlowe contracts on the Cardano blockchain. 

If you are unfamiliar with the Marlowe language, you may want to experiment with **[Marlowe Playground](https://play.marlowe.iohk.io/#/)** before trying the starter kit. 

The starter kit includes the following three on-chain example contracts along with instructions for setting up your environment for running them. 

## 1. Zero-coupon bond

A zero-coupon bond (ZCB) is a loan where the principal is lent at the start of the contract and repaid with interest at the end of the contract. The borrower makes no periodic payments along the way. 

The example ZCB uses three methods:

- **[Marlowe Runtime CLI](https://github.com/input-output-hk/marlowe-starter-kit/blob/main/01-runtime-cli.ipynb)**
- **[Marlowe Runtime REST API](https://github.com/input-output-hk/marlowe-starter-kit/blob/main/02-runtime-rest.ipynb)**
- **[Marlowe CLI](https://github.com/input-output-hk/marlowe-starter-kit/blob/main/03-marlowe-cli.ipynb)**

## 2. Escrow

An escrow contract is a purchase in which: (i) the contract holds funds until the buyer and seller agree that the goods were delivered faithfully; (ii) a mediator resolves any dispute. 

- **[Escrow contract using Marlowe Runtime REST API](https://github.com/input-output-hk/marlowe-starter-kit/blob/main/04-escrow-rest.ipynb)**

## 3. Swap contract

A swap contract is a trade of one commodity for another. 

- **[Swap contract for ada and djed using Marlowe Runtime REST API](https://github.com/input-output-hk/marlowe-starter-kit/blob/main/05-swap-rest.ipynb)**
