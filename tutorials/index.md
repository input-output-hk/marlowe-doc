---
title: Tutorials
---

# Marlowe tutorials overview

This document gives an overview of the Marlowe tutorials.

| Tutorial | Description | 
| --- | --- | 
| [A simple escrow contract](escrow-ex.md) | This tutorial introduces a simple financial contract in pseudocode, before explaining how it is modified to work in Marlowe, giving the first example of a Marlowe contract. |
| [The Marlowe model](marlowe-model.md) | In this tutorial we look at our general approach to modelling contracts in Marlowe, and the context in which Marlowe contracts are executed: the Cardano blockchain. In doing this we also introduce some of the standard terminology that we will use in describing Marlowe. | 
| [Marlowe step by step](marlowe-step-by-step.md) | This tutorial explains the five ways of building contracts in Marlowe. Four of these -- `Pay`, `Let`, `If` and `When` -- build a complex contract from simpler contracts, and the fifth, `Close`, is a simple contract. In explaining these contracts we will also explain Marlowe *values*, *observations* and *actions*, which are used to supply external information and inputs to a running contract to control how it will evolve. | 
| [Marlowe in Blockly](playground-blockly.md) | This section shows how Marlowe contracts are built using the Blockly visual programming environment. | 
| [The Marlowe data types](marlowe-data.md) | This tutorial formally introduces Marlowe as a Haskell data type, as well as presenting the different types used by the model, and discussing a number of assumptions about the infrastructure in which contracts will be run. | 
| [Marlowe embedded in Haskell](embedded-marlowe.md) | This tutorial shows how to use some simple features of Haskell to write Marlowe contracts that are more readable, maintainable and reusable, illustrated by revisiting the escrow contract. | 
| [Marlowe embedded in JavaScript](javascript-embedding.md) | Marlowe is also embedded in JavaScript, and here we show how Marlowe contracts can be created and edited in JavaScript. | 
| [The Marlowe Playground](playground-overview.md) | This tutorial introduces the Marlowe Playground, an online tool for creating embedded Marlowe contracts and interactively stepping through their execution. | 
| [Potential problems with contracts](potential-problems-with-contracts.md) | This tutorial reviews how not to write Marlowe contracts, and what can go wrong when executing contracts even if they have been written correctly. | 
| [Static analysis](static-analysis.md) | Marlowe contracts can be analysed without running them, and so, for instance, we can verify that a contract will always make the payments that it is required to, irrespective of the inputs that it receives. This tutorial explains this, and how to run an analysis in the playground. | 
| [ACTUS and Marlowe](actus-marlowe.md) | This tutorial gives an introduction to the general idea of the ACTUS taxonomy, plus examples implemented in Marlowe. | 
| [Using Marlowe from the ghci command line](using-marlowe.md) | This tutorial shows you how to use Marlowe from the command line in ghci, and in particular shows how to exercise a contract using the semantics given earlier. | 
| [Using Marlowe Run--Deprecated](marlowe-run.md) | *DEPRECATED* -- This tutorial shows you how to deploy and interact with Marlowe contracts on-chain using Marlowe Run. | 
| [Migrating from earlier versions of Marlowe](migrating.md) | Here we explain how the current version of Marlowe is related to earlier versions. | 
| [Marlowe escrow step-by-step](escrow-step-by-step.md) | **Not previously posted** Need to write a description | 
| [Implementing Marlowe in Plutus](marlowe-plutus.md) | **Not previously posted** Need to write a description | 
| [The semantics of Marlowe 2.0](marlowe-semantics.md) | **Not previously posted** Need to write a description | 

These tutorials address the current version of Marlowe, which is implemented in the [Marlowe Playground](https://play.marlowe-finance.io/#/). 

The version covered in the ISoLA paper, and supported in the original version of the Playground (called Meadow), is tagged as **v1.3** and is available [here](https://github.com/input-output-hk/marlowe/tree/v1.3).
