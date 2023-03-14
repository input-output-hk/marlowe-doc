---
title: Platform
sidebar_position: 3
---

## The Marlowe platform

When compared to a [Turing-complete](https://en.wikipedia.org/wiki/Turing_completeness) language, the Marlowe DSL provides significantly greater security, certainty, [guarantees of termination](https://en.wikipedia.org/wiki/Halting_problem), and behavior correctness.

The design guarantees the following:
- Contracts are finite. No recursion or loops.
- Contracts will terminate. Timeout on all actions.
- Contracts have a defined lifetime. 
- No assets retained on close. 
- Conservation of value.

## Developing and modeling Marlowe

Marlowe is modelled on special-purpose financial contract languages popularised in the last decade or so by academics and enterprises such as LexiFi, which provides contract software in the financial sector. 

In developing Marlowe, we have adapted these languages to work on blockchain. 
Marlowe is implemented on the Cardano blockchain, but could equally well be implemented on Ethereum or other blockchain platforms;
in this respect it is "platform agnostic" just like modern programming languages such as Java and C++. 

Marlowe has been designed as an industry-scale solution and embodies examples from the [ACTUS](https://www.actusfrf.org/) taxonomy and standard for financial contracts. Contracts written in Marlowe can be integrated on Cardano or an alternative blockchain. 

Marlowe can interact with real-world data – such as oracles – and the participants in the contract make choices within the contract flow to determine what happens both on- and off- chain, such as in a wallet. Marlowe is blockchain-agnostic: it enables the expression of smart contacts on top of an account-based model, such as Ethereum, and on the [extended unspent transaction output (EUTXO)](https://docs.cardano.org/learn/eutxo-explainer) model of [Cardano](https://cardano.org/).

The Marlowe Playground online simulation allows you to experiment with, develop, simulate and analyze Marlowe contracts in your web browser, without having to install any software.
Marlowe Runtime is an API with a service behind it that programmers can use to run Marlowe contracts. 
Marlowe DApps use Marlowe Runtime to interact with and create Marlowe contracts on-chain. 

## How Marlowe contracts are protected

To make sure that contracts are followed, Marlowe uses a different method than non-blockchain approaches. *Commitments* and *timeouts* are central to how Marlowe works in a blockchain context. 

All the constructs of Marlowe that require user participation -- including user deposits and user choices -- are protected by **timeouts**.
The **commitment** made by a participant to a contract is *finite*: we can predict when the contract will have nothing left to do -- when it can be closed. 

Prospective contract participants can easily understand the *lifetime* of the contract and when it will terminate before choosing to take part. 

The instructions of the contract are adhered to. The participants take part rather than walk away early, preventing money from being locked up in the contract forever. 

A contract can ask a participant to make a **deposit** of some funds, but the contract cannot actually force a participant to make a deposit. 
Instead, the contract can wait for a period of time for the participant to commit to the contract: when that period of time expires, the contract moves on to follow some alternative instructions. 
This prevents a participant from being able to stop a contract merely by choosing to not take part. 

At this point any unspent funds left in the contract are **refunded** to participants, and the contract stops, or *terminates*. 
Any funds put into the contract by a participant *can\'t be locked up forever*: at this point the commitment effectively ends.

In Marlowe, a running contract cannot force a deposit or a choice to happen: all it can do is to request a deposit or choice from a participant. 
In other words, for these actions it cannot "*push*," but it can "*pull*." 
On the other hand, it *can* make payments automatically, so some aspects of a Marlowe contract can "push" to make some things happen; for example, ensuring that a payment is made to a participant by constructing an appropriate transaction output.

## Research-based

Marlowe is based on original, peer-reviewed research conducted by the Marlowe team, initially at the University of Kent supported by a research grant from IOHK, and latterly as an internal engineering team in the company. 
We are also working jointly with Wyoming Advanced Blockchain R&D Laboratory (WABL) at the University of Wyoming. 
If you are interested in working with us, please get in touch.

Our research work is reported in these published papers.

*   [Marlowe: financial contracts on blockchain](https://iohk.io/en/research/library/papers/marlowefinancial-contracts-on-blockchain/)
    The paper that introduced the Marlowe language. 
    It is an earlier version, but nevertheless it explains the principles and rationale behind its design and implementation.
*   [Marlowe: implementing and analysing financial contracts on blockchain](https://iohk.io/en/research/library/papers/marloweimplementing-and-analysing-financial-contracts-on-blockchain/)
    This paper describes the implementation of Marlowe on the Cardano blockchain, and the analysis supported by the Marlowe Playground web-based development and simulation environment.
*   [Efficient static analysis of Marlowe contracts](https://iohk.io/en/research/library/papers/efficient-static-analysis-of-marlowe-contracts/)
    This paper explains how we optimised the static analysis explained in the previous paper.
*   [Standardized crypto-loans on the Cardano blockchain](https://iohk.io/en/research/library/papers/standardized-crypto-loans-on-the-cardano-blockchain/)
    In this paper we explore a smart contract framework for building standardized crypto-loans using Marlowe, with the ACTUS standard at its core.

and in this eprints survey paper.

*   [Scripting smart contracts for distributed ledger technology](https://iohk.io/en/research/library/papers/scripting-smart-contracts-for-distributed-ledger-technology/)
    Here we give an overview of the scripting languages used in existing cryptocurrencies.

## Further important information

### [Best Practices for Marlowe on Cardano](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/best-practices.md)

### [Marlowe Security Guide](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/security.md)
