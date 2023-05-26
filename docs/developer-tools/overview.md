---
title: Overview
sidebar_position: 0
---

![Developer tools ecosystem](/img/dev-tools-ecosystem.png)

### Marlowe Runtime

Marlowe Runtime consists of a series of services that can be divided into frontend and backend components. Marlowe Runtime Backend Services are off-chain components largely responsible for interfacing with a Cardano node. They offer abstractions to hide many implementation details of Plutus and Cardano node directly.

To interface with Marlowe Runtime, there are two ways:
 - Marlowe Runtime Web's REST API
 - Using `marlowe-cli`

There are two main use cases when considering usage of Marlowe as a layer for smart contract developers. Depending on the complexity of the smart contract and DApp, higher level operations provide a simplified interface for focusing mainly on smart contract logic rather than implementation details. However, more complex workflows might need lower level control where an understanding of Plutus might be required.

#### High level operation

* Supports a straightforward workflow for users that just want to run contracts from the command line.
* Hides details of input and state of Marlowe contracts.
* Hides and automates many aspects of Plutus and interaction with the Cardano node.
* Focuses on the Marlowe contract.

#### Low level operation

* Supports developer workflows for debugging and fine-grained control of each atomic operation involved in running Marlowe contracts.
* Controls modification of Marlowe state and construction of Marlowe input.
* Controls construction and submission of validators, datums, and redeemers.
* Focus on the mechanics of Marlowe on Plutus and Cardano.

## How do I run my Marlowe contract on the Cardano blockchain?

1. Design your contract using [Marlowe Playground](https://play.marlowe.iohk.io/#/).

2. Press the `Send to Simulator` button and then press `Download as JSON` to download your contract in JSON format.

## Running your contract using Marlowe CLI

3. *If you want to run your contract at the command line using `marlowe-cli`,* install [`marlowe-cli`](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/ReadMe.md#installation) and follow the instructions [Running Contracts with Marlowe CLI](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/lectures/04-marlowe-cli-concrete.md). A video lecture playlist [Marlowe CLI](https://www.youtube.com/playlist?list=PLNEK_Ejlx3x0GbvCw-61e9VfRafBT1JSw) provides an overview of the `marlowe-cli` tool.

## Running your contract in a Jupyter notebook

4. *If you want to run your contract in a Jupyter notebook,* then use git to clone [github.com/input-output-hk/marlowe-cardano](https://github.com/input-output-hk/marlowe-cardano), run `nix develop --command jupyter-lab` from the `marlowe-cli/` folder, open the notebook [Marlowe CLI Lecture 4](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/lectures/04-marlowe-cli-concrete.ipynb), and follow the instructions. A video lecture [Running a Marlowe Contract with Marlowe CLI](https://www.youtube.com/watch?v=DmF7dIKmJMo&list=PLNEK_Ejlx3x0GbvCw-61e9VfRafBT1JSw&index=4) demonstrates running a contract from within a Jupyter notebook.

## Running your contract with Marlowe Runtime

5. *If you want to run your contract from the command-line using the Marlowe Runtime backend,* then follow the [tutorial for Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/tutorial.ipynb). A video [Marlowe Runtime Tutorial](https://youtu.be/WlsX9GhpKu8) demonstrates its use.
