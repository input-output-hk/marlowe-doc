---
sidebar_position: 1
---

# Introducing Marlowe

## Intended for financial contracts experts

Marlowe is a special purpose or domain-specific language (DSL), designed to be used by experts in the domain of financial contracts. They do not need to be programmers. 

## Advantages of using Marlowe DSL

Beyond the notable benefit of being usable by non-programmers, the Marlowe DSL has many other advantages:

*   Ensures that certain sorts of bad programs cannot even be written by designing those possibilities out of the language. 
*   Avoids some of the unanticipated exploits which have been a problem for existing blockchains.
*   More easily checks that programs have the intended properties. 
*   Makes sure that the contract will never fail to make a payment that it should.
*   Helps people write programs in the language using special-purpose tools. 
*   Emulates how a contract will behave before it is run for real on the blockchain, ensuring that the contract performs as intended through static analysis.
*   Provides valuable diagnostics to potential participants before they commit to a contract. 
*   Formally proves properties of Marlowe contracts, giving the highest level of assurance that contracts behave as intended through using logic tools. 

## What is a Marlowe contract? 

A Marlowe contract is built by combining a small number of building blocks that describe making a payment, making an observation of something in the "real world," waiting until a certain condition becomes true, and other similar types of concepts. 

## Putting Marlowe in perspective -- general purpose programming languages vs. DSL

The first computers were programmed in "machine code." 
Each kind of system used a different code, and these codes were low-level and inexpressive: programs were long sequences of very simple instructions, incomprehensible to anyone who had not written them. 

Today we are able to use higher-level languages like C, Java and Haskell to program systems. 
The same languages can be used on widely different machines, and the structure of the programs reflects what they do. 

On blockchain, their equivalents are languages like Plutus, Solidity and Simplicity. 
These higher-level languages are general purpose -- they can be used to solve all sorts of different problems -- but the solutions they express are still programs, and they still require programming skills to use them effectively. 

## Developing and modeling Marlowe

Marlowe is modelled on special-purpose financial contract languages popularised in the last decade or so by academics and enterprises such as LexiFi, which provides contract software in the financial sector. 

In developing Marlowe, we have adapted these languages to work on blockchain. 
Marlowe is implemented on the Cardano blockchain, but could equally well be implemented on Ethereum or other blockchain platforms;
in this respect it is "platform agnostic" just like modern programming languages such as Java and C++. 

The Marlowe Playground online simulation allows you to experiment with, develop, simulate and analyze Marlowe contracts in your web browser, without having to install any software.
Marlowe Runtime is an API with a service behind it that programmers can use to run Marlowe contracts. 
Marlowe DApps use Marlowe Runtime to interact with and create Marlowe contracts on-chain. 

## Embedded DSL

Marlowe is an *embedded* DSL, hosted in the [Haskell](https://www.haskell.org) programming language. 
While it is possible to use "pure" Marlowe if we wish, being embedded in a general-purpose language allows contract writers to selectively exploit features of Haskell in writing Marlowe contracts, making them easier to read and re-use. 
In fact, Marlowe is not tied to Haskell, and we have also developed a JavaScript environment for Marlowe. 
The Marlowe Playground, the online tool to help you build Marlowe contracts, supports both Haskell and JavaScript, as well as a visual way of writing Marlowe using Blockly.

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

## Looking ahead

We are working on a production release of Marlowe on the Cardano blockchain early in 2023. 
There already exists a prototype of Marlowe and it can be used on top of Cardano, but we are working on making sure it is stable and, therefore, we don\'t recommend using it in production at this stage. 

You are invited to explore Marlowe for yourself, either by downloading it and using the Haskell implementation directly, by using the online Marlowe Playground development tool, and the [marlowe-cli](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-cli). 
These are all covered in subsequent tutorials. 
We will also cover the details of Marlowe, introduce a series of examples, and look deeper into the tools for Marlowe.

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

## Finding out more

Systems

-   [The Marlowe Playground](https://play.marlowe-finance.io), an in-browser development, analysis and simulation environment.
-   [Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-runtime), the backend API used for creating Marlowe transactions, and discovering and querying on-chain Marlowe contracts. 
-   [The Marlowe github repository](https://github.com/input-output-hk/marlowe) from which you can download Marlowe.

Videos

-   [Marlowe video tutorials](tutorials/video-tutorials.md)
