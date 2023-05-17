---
title: Development and deployment overview
sidebar_position: 2
---

## How do I run my Marlowe contract on the Cardano blockchain?

1. Design your contract using [Marlowe Playground](https://play.marlowe-finance.io/#/).

2. Press the `Send to Simulator` button and then press `Download as JSON` to download your contract in JSON format.

## Running your contract using Marlowe CLI

3. *If you want to run your contract at the command line using `marlowe-cli`,* install [`marlowe-cli`](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/ReadMe.md#installation) and follow the instructions [Running Contracts with Marlowe CLI](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/lectures/04-marlowe-cli-concrete.md). A video lecture playlist [Marlowe CLI](https://www.youtube.com/playlist?list=PLNEK_Ejlx3x0GbvCw-61e9VfRafBT1JSw) provides an overview of the `marlowe-cli` tool.

## Running your contract in a Jupyter notebook

4. *If you want to run your contract in a Jupyter notebook,* then use git to clone [github.com/input-output-hk/marlowe-cardano](https://github.com/input-output-hk/marlowe-cardano), run `nix develop --command jupyter-lab` from the `marlowe-cli/` folder, open the notebook [Marlowe CLI Lecture 4](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/lectures/04-marlowe-cli-concrete.ipynb), and follow the instructions. A video lecture [Running a Marlowe Contract with Marlowe CLI](https://www.youtube.com/watch?v=DmF7dIKmJMo&list=PLNEK_Ejlx3x0GbvCw-61e9VfRafBT1JSw&index=4) demonstrates running a contract from within a Jupyter notebook.

## Running your contract with Marlowe Runtime

5. *If you want to run your contract from the command-line using the Marlowe Runtime backend,* then follow the [tutorial for Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/tutorial.ipynb). A video [Marlowe Runtime Tutorial](https://youtu.be/WlsX9GhpKu8) demonstrates its use.

