---
title: Domain Specific Language
sidebar_position: 2
---

Marlowe is a domain-specific language (DSL) that you can use to create blockchain applications that are specifically designed for financial contracts. It allows you to apply your domain expertise to write and manage contracts conveniently, without the steep learning curve associated with software development, blockchain, or smart contracts. 

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

## Embedded DSL

Marlowe is an *embedded* DSL, hosted in both [JavaScript](https://www.javascript.com/) and [Haskell](https://www.haskell.org/), offering you a choice of editors depending on your preference and skillset. 

Javascript offers flexibility and speed of use with a thriving ecosystem, while Haskell is a functional programming language with its own established ecosystem and solid testing framework. 

While it is possible to use "pure" Marlowe if you wish, being embedded in a general-purpose language allows contract writers to selectively exploit features of JavaScript or Haskell in writing Marlowe contracts, making them easier to read and re-use. 

## Putting Marlowe in perspective -- general purpose programming languages vs. DSL

The first computers were programmed in "machine code." 
Each kind of system used a different code, and these codes were low-level and inexpressive: programs were long sequences of very simple instructions, incomprehensible to anyone who had not written them. 

Today we are able to use higher-level languages like C, Java and Haskell to program systems. 
The same languages can be used on widely different machines, and the structure of the programs reflects what they do. 

On blockchain, their equivalents are languages like Plutus, Solidity and Simplicity. 
These higher-level languages are general purpose -- they can be used to solve all sorts of different problems -- but the solutions they express are still programs, and they still require programming skills to use them effectively. 

