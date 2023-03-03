---
title: Example Contracts
---

## Intended environment for running examples

Q: What is the default entry point for new Marlowe users? REST API? 

* Marlowe Runtime's command-line interface, [`marlowe`](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/ReadMe.md) 
* [Curl command-line tool](https://curl.se)

## Running contracts on a testnet

* Include documentation for how to run contracts on a testnet

## 1. Test of a Zero-Coupon Bond

### Features of Marlowe that are expressed through the Zero-Coupon Bond contract

* Content TBD

### Jupyter notebook, Marlowe CLI, Cookbook

> * [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/cookbook/zcb.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/cookbook/zcb.ipynb) 
> * We introduce new variants of `marlowe-cli run execute` and `marlowe-cli run withdraw` that automatically handle the UTxOs management, coin selection, and balancing, so that one doesn't need to specify `--tx-in` and `--tx-out` for Marlowe transactions. 

## 2. Swap

### Features of Marlowe that are expressed through the Swap contract

* Content TBD

### Marlowe "Swap" Contract Run on Mainnet Using a Reference Script 

> * [marlowe-cli/cookbook/marlowe-1st-reference-script.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/cookbook/marlowe-1st-reference-script.ipynb) 

## 3. Escrow

### Features of Marlowe that are expressed through the Escrow contract

* Content TBD

### Set of escrow contracts bundled together

* [Example Escrow Contract](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/examples/escrow/ReadMe.md)

> * [Example Escrow Contract, Everything is alright](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/examples/escrow/everything-is-alright.md)

> * [Example Escrow Contract, Confirm Problem](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/examples/escrow/confirm-problem.md)

> * [Example Escrow Contract, Dismiss Claim](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/examples/escrow/dismiss-claim.md)

> * [Example Escrow Contract, Confirm Claim](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/examples/escrow/confirm-claim.md)

> * [`module Marlowe.Contracts.Escrow | Escrow.hs`](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-contracts/src/Marlowe/Contracts/Escrow.hs)

---

Comment from Brian: 

* Can we present the examples above in parallel alternative formats?

> * Marlowe Runtime's command-line interface, `marlowe`.

> * Marlowe CLI, `marlowe-cli`

> * Maybe there could be tabs or something that folks could click to see REST vs `marlowe` vs `marlowe-cli`. 

