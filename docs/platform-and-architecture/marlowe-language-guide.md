---
title: Marlowe language guide
sidebar_position: 4
---

Marlowe is designed to create the following building blocks of financial contracts: 

* payments to and deposits from participants, 
* choices by participants, and 
* real-world information. 

Marlowe is a small language, with a handful of different constructs that, for each contract, describe behaviour involving a fixed, finite set of roles. When a contract is run, the roles it involves are fulfilled by participants, which are identities on the blockchain. Each role is represented by a token on-chain. Roles can be transferred during contract execution, meaning that they can essentially be traded. 

Contracts are built by putting together a small number of these constructs that, in combination, describe and model many different kinds of financial contracts. 

Some examples include: 

* a running contract that can make a payment to a role or to a public key, 
* a contract that can wait for an action by one of the roles, such as a deposit of currency, or 
* a choice from a set of options. 

See the sample escrow contract below.

Crucially, a contract cannot wait indefinitely for an action: if no action has been initiated by a set time (the timeout), then the contract will continue with an alternative behavior, such as, for example, refunding any funds in the contract as a remedial action. 

Marlowe contracts can branch based on alternatives and have a finite lifetime, at the end of which any remaining money is returned to the participants. This feature means that money cannot be locked forever in a contract. Depending on the current state of a contract, it may make a choice between two alternative future courses of action, which are themselves contracts. When no further actions are required, the contract will close, and any remaining currency in the contract will be refunded.

## Using Haskell types

Haskell types represent the various components of the contract, including *accounts*, *values*, *observations*, and *actions*. These Marlowe elements are used to supply external information and inputs to a running contract to control how it will evolve.

In modeling basic parts of Marlowe, a combination of Haskell `data` types are used, that define *new* types, and `type` synonyms that give a new name to an existing type.

## Programming environments

In addition to writing contracts in the textual version of Marlowe, you can also use one of the following visual programming environments:

1. Blockly
2. JavaScript (TypeScript)
3. Haskell

See **[Marlowe Playground](../developer-tools/playground.md)** for details. 

## About a Marlowe contract

A contract is built in Marlowe by combining a small number of *building* blocks to describe many different kinds of financial contracts, like making a payment, making an observation, waiting until a certain condition becomes true, and so on. The contract is then run on a blockchain, like Cardano, and interacts with the outside world. 

Marlowe itself is embedded in Haskell and is modelled as a collection of algebraic data types in Haskell, with contracts defined by the *Contract* type:

```data Contract = Close
data Contract = Close
              | Pay Party Payee Token Value Contract
              | If Observation Contract Contract
              | When [Case] Timeout Contract
              | Let ValueId Value Contract
              | Assert Observation Contract
```

Marlowe has *six* ways of building contracts. Five of these methods – `Pay`, `Let`, `If`, `When`, and `Assert` – build a complex contract from simpler contracts, and the sixth method, `Close`, is a simple contract. At each step of execution, besides returning a new state and continuation contract, it is possible that effects – payments – and warnings can also be generated.

### Pay

A payment contract `Pay a p t v cont` will make a payment of value `v` of token `t` from the account `a` to a payee `p`, which will be one of the contract participants or another account in the contract. Warnings will be generated if the value `v` is not positive, or if there is not enough in the account to make the payment in full (even if there are positive balances of other tokens in the account). In the latter case, a partial payment (of all the money available) is made. The continuation contract is the one given in the contract: `cont`.

### Close

A contract `Close` provides for the contract to be closed (or terminated). The only action that it performs is providing refunds to the owners of accounts with a positive balance. This is performed one account per step, but all accounts will be refunded in a single transaction.

Before moving onto other forms of contracts, we need to outline *values*, *observations*, and *actions*:

- Values - include quantities that change with time, including “the current slot interval”, “the current balance of some token in an account”, and any choices that have already been made (*volatile values*). Values can also be combined using addition, subtraction, and negation, and can be conditional on an observation.
- Observations - are boolean values derived by comparing values, and can be combined using the standard boolean operators. It is also possible to observe whether any choice has been made (for a particular identified choice). Observations will have a value at every step of execution. 
- Actions - happen at particular points during execution, for example:
    - depositing money
    - making a choice between various alternatives, including an *oracle* value
    - notifying the contract about an observation that became true
- Oracles - are being developed for the Cardano blockchain, and will be available for use within Marlowe on Cardano. Until then we have introduced an *oracle prototype*, which is implemented in the Marlowe Playground. We model oracles as choices made by a participant with a specific Oracle role, "kraken".

### If

The conditional If `obs cont1 cont2` will continue as `cont1` or `cont2`, depending on the boolean value of the observation `obs` when this construct is executed.

### When

This is the most complex constructor for contracts, with the form `When cases timeout cont`. It is a contract *triggered on actions*, which may or may not happen at any particular slot: what happens when various actions happen is described by the cases in the contract.

In the contract `When cases timeout cont`, the list `cases` contains a collection of cases. Each case has the form `Case ac co` where `ac` is an action and `co` a continuation (another contract). When a particular action, for example, `ac`, happens, the state is updated accordingly and the contract will continue as the corresponding continuation `co`.

To make sure that the contract makes progress eventually, the contract `When cases timeout cont` will continue as `cont` once the `timeout`, a slot number, is reached.

### Let

A let contract `Let id val cont` allows a contract to *record* a value, at a particular point in time, and gives it a name using an identifier. In this case, the expression `val` is evaluated and stored with the name `id`. The contract then continues as `cont`.

As well as allowing us to use abbreviations, this mechanism also means that we can capture and save volatile values that might change over time, e.g., the current price of oil, or the current slot number, at a particular point in the execution of the contract, to be used later on in contract execution.

### Assert

An assert contract `Assert obs cont` does not have any effect on the state of the contract, it immediately continues as `cont`, but it issues a warning when the observation `obs` is false. It can be used to ensure that a property holds in any given point of the contract, since static analysis will fail if any execution causes an assert to be false.

## Sample escrow contract

Suppose that `alice` wants to buy a cat from `bob`, but neither of them trusts the other. Fortunately, they have a mutual friend `carol` whom they both trust to be neutral (but not enough to give her the money and act as an intermediary). They therefore agree on the following contract, written using simple functional pseudocode. This kind of contract is a simple example of *escrow*:
              
     When aliceChoice
          (When bobChoice
                (If (aliceChosen 'ValueEQ' bobChosen)
                    agreement
                    arbitrate))

The contract is described using the *constructors* of a Haskell data type. The outermost constructor `When` has two arguments: the first is an observation and the second is another contract. The intended meaning of this is that when the action happens, the second contract is activated.

The second contract is itself another `When` – asking for a decision from bob – but inside that, there is a choice: If `alice` and `bob` agree on what to do, it is done; if not, `carol` is asked to arbitrate and make a decision.

In general, `When` offers a list of cases, each with an action and a corresponding contract triggered when that action happens. Using this we can allow for the option of `bob` making the first choice, rather than `alice`, like this:     
                     
     When [ Case aliceChoice
                  (When [ Case bobChoice
                              (If (aliceChosen 'ValueEQ' bobChosen)
                                 agreement
                                 arbitrate) ],
                    
            Case bobChoice
                  (When [ Case aliceChoice
                               (If (aliceChosen 'ValueEQ' bobChosen)
                                  agreement
                                  arbitrate) ],
           ]

In this contract, either Alice or Bob can make the first choice; the other then makes a choice. If they agree, then that is done; if not, Carol arbitrates. 

### Escrow in Marlowe

Marlowe contracts incorporate extra constructs to ensure that they progress properly. Each time we see a `When`, we need to provide two additional things:

- a *timeout* after which the contract will progress, and
- the *continuation* contract to which it progresses

### Using timeouts

Timeouts are used where the condition of the `When` never becomes true. So, timeout and continuation values are added to each `When` occurring in the contract:
                            
     When [ Case aliceChoice
                  (When [ Case bobChoice
                              (If (aliceChosen 'ValueEQ' bobChosen)
                                 agreement
                                 arbitrate) ],
                        60              -- ADDED
                        arbitrate       -- ADDED
            ]
            40          -- ADDED
            Close       -- ADDED
                    
The outermost `When` calls for the first choice to be made by Alice: if Alice has not made a choice by slot 40, the contract is closed and all the funds in the contract are refunded.

### Marlowe accounts and token usage

A Marlowe account holds amounts of multiple currencies and/or fungible and non-fungible tokens. A concrete amount is indexed by a `Token`, which is a pair of `CurrencySymbol` and `TokenName`. You can think of an account as a map token integer, where:
`data Token = Token CurrencySymbol TokenName`

The ada token of Cardano is represented as `Token adaSymbol adaToken`, however, you can create your own currencies and tokens. 