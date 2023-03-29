---
title: Runtime protocol API reference
sidebar_position: 5
---

> NOTE: Draft in progress

> * Add examples

## Introduction

Marlowe Runtime is the application backend for managing Marlowe contracts on the Cardano blockchain. 
The term "Runtime" refers to the whole system, its components and sub-components. 
Runtime and its protocols and sub-protocols communicate with one another to enable Runtime's core functions, which are discovering and querying on-chain Marlowe contracts, and creating Marlowe transactions. 

The Runtime API protocol enables communicating with Runtime directly. 
The Marlowe Runtime protocol API defines everything you can do with the Runtime. 
Anything that can't be done through these protocols can't be done with the Runtime. 

These protocols, and specifically this root-level Marlowe protocol, is the primary API for the Runtime. 
If you want to communicate with the Runtime, ultimately, you will be using the Marlowe protocol and its sub-protocols. 

In the larger context of working with Runtime, you don't necessarily need to be aware of the protocols to be able to communicate with the Runtime. 
For example, if you are using the REST API, Runtime CLI or Marlowe CLI, under the hood, they all communicate with the Runtime using this protocol, as does everything that communicates with the Runtime. 

### Intended audience

This document is intended for developers who are writing client applications that interact with the Runtime. 
You may be writing scripts, command-line tools, servers for DApps that communicate with the Runtime, or something similar. 
If you don't want to use the REST API, Runtime CLI or Marlowe CLI, or any other intermediary, but instead want to connect directly to the TCP socket that the Runtime exposes, this document is a useful reference because it describes the behavior and syntax of these protocols, their states and messages. 

## Key concepts

| Concepts | Description |
| --- | --- |
| Peer Role | The peer role is either server or client. All protocol sessions take place between two peers -- one server and one client. | 
| Protocol State | A description of the current state of a protocol session. | 
| Peer Agency | Describes which peer role is able to send messages to the other in a given protocol state. Agency is exclusive (either server or client has agency, never both). When one peer is able to send a message to the other peer, it has agency. When a peer is in a state of only being able to receive a message, we say it does not have agency. | 
| Messages | Packets of data that a peer can send to another peer when it has agency. When a message is sent, that event transitions the protocol state from one state to another state. | 

### About messages and agency

Certain message types are only available from certain states, and when a peer sends a message to the other peer, it changes the state of the protocol, potentially changing the peer agency as well. 
In the majority of cases, agency alternates when a peer sends a message to the other peer. 
For example, the client will send a message to the server, then the server will gain agency. 
Then the server sends a message back to the client and the client will gain agency again. 
There are some cases in which one peer will send multiple messages and keep agency between them, but for the most part it is a back and forth process. 

## Marlowe protocol

The top-level protocol is the Marlowe protocol. It is defined here: 

* [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/proxy-api/Language/Marlowe/Protocol/Types.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/proxy-api/Language/Marlowe/Protocol/Types.hs)

### Four sub-protocols

The Marlowe protocol consists of four sub-protocols: 

1. Marlowe Sync 
2. Marlowe Header Sync 
3. Marlowe Query 
4. Tx Job 

### Client starts session

The Client starts a session by sending a message to the server saying which sub-protocol it intends to communicate with, then a protocol session for the sub-protocol begins. 

### Marlowe protocol states

At any given time, the Marlowe protocol can be in one of five states: 

1. `Init` 
2. `MarloweSync` 
3. `MarloweHeaderSync` 
4. `MarloweQuery` 
5. `TxJob`  

There is an `init` state, then there is one protocol state per sub-protocol. 
These states transition in a fairly straightforward manner. 

The protocol starts in the `init` state, and then via one of the message types, it will transition into either the `MarloweSync`, the `MarloweHeaderSync`, the `MarloweQuery` or the `TxJob` state. 

Once in that protocol state, the protocol stays there for the rest of the session, communicating in that protocol. 

### Descriptions of the Marlowe protocol states

| Marlowe protocol state | Description |
| --- | --- |
| 1. `Init` | The initial state. | 
|     | Client has agency. | 
| 2. `MarloweSync` | The peers are communicating via the `MarloweSync` sub-protocol. | 
|  | Agency depends on sub-protocol. | 
|  | *Associated data:* a `MarloweSync` sub-protocol state. | 
| 3. `MarloweHeaderSync` | The peers are communicating via the `MarloweHeaderSync` sub-protocol. | 
|   | Agency depends on sub-protocol. | 
|   | *Associated data:* a `MarloweHeaderSync` sub-protocol state. | 
| 4. `MarloweQuery` | The peers are communicating via the `MarloweQuery` sub-protocol. | 
|   | Agency depends on sub-protocol. | 
|   | *Associated data:* a `MarloweQuery` sub-protocol state. | 
| 5. `TxJob` | The peers are communicating via the `TxJob` sub-protocol. | 
|   | Agency depends on sub-protocol. | 
|   | *Associated data:* a `TxJob` sub-protocol state. | 

### Eight message types

There are eight message types in the Marlowe protocol. 
Each of them, described below, has a message type that is a carrier for that sub-protocol. 
For example, the `MsgMarloweSync` message type embeds a message from the sub-protocol in the Marlowe protocol. 

| Message | Description |
| --- | --- |
| 1. `MsgRunMarloweSync` | Choose to communicate via `MarloweSync`. | 
|   |  Available from `Init`. | 
|   | Transitions to `MarloweSync`. | 
| 2. `MsgRunMarloweHeaderSync` | Choose to communicate via `MarloweHeaderSync`. | 
|   | Available from `Init`. | 
|   | Transitions to `MarloweHeaderSync`. | 
| 3. `MsgRunMarloweQuery` | Choose to communicate via `MarloweQuery`. | 
|   |  Available from `Init`. | 
|   |  Transitions to `MarloweQuery`. | 
| 4. `MsgRunTxJob` | Choose to communicate via `TxJob`. | 
|   |  Available from `Init`. | 
|   |  Transitions to `TxJob`. | 
| 5. `MsgMarloweSync` | Send a `MarloweSync` message. | 
|   |  Available from `MarloweSync` (with sub state st). | 
|   |  Transitions to `MarloweSync` (with sub state determined by the payload message). | 
|   |  Payload: A `MarloweSync` message (available from sub state st). | 
| 6. `MsgMarloweHeaderSync` | Send a `MarloweHeaderSync` message. | 
|   |  Available from `MarloweHeaderSync` (with sub state st). | 
|   |  Transitions to `MarloweHeaderSync` (with sub state determined by the payload message). | 
|   |  Payload: A `MarloweHeaderSync` message (available from sub state st). | 
| 7. `MsgMarloweQuery` | Send a `MarloweQuery` message. | 
|   |  Available from `MarloweQuery` (with sub state st). | 
|   |  Transitions to `MarloweQuery` (with sub state determined by the payload message). | 
|   |  Payload: A `MarloweQuery` message (available from sub state st). | 
| 8. `MsgTxJob` | Send a `TxJob` message. | 
|   |  Available from `TxJob` (with sub state st). | 
|   |  Transitions to `TxJob` (with sub state determined by the payload message). | 
|   |  Payload: A `TxJob` message (available from sub state st). | 


### Binary format for sending messages over TCP

Use the binary format for the Marlowe protocol to send messages over TCP. 
The binary format describes how each message type is converted into binary data, then read and decoded. 

> 
> Jamie will write this up. 
> 

## Messaging behavior

On a functional level, the Marlowe protocol multiplexes the four sub-protocols into one. 
The client always sends one of these four message types (`MsgRunMarloweSync`, `MsgRunMarloweHeaderSync`, `MsgRunMarloweQuery`, `MsgRunTxJob`) to start. 
Depending on which one it started the session with, it will then continuously send that message type between client and server. 
If it starts with `MsgRunMarloweSync`, the client and server will then just exchange `MsgMarloweSync` messages back and forth. 
Inside each of those is a message from the underlying `MarloweSync` protocol. 
When finished, it disconnects and the session is over. 

## About the Haskell source files

There is a data structure in the Haskell source files that describes the different states of the protocol. 
There is a message type that shows what all the available messages are for that protocol. 
Each message indicates the initial state of the message. 
For example, `MsgRunMarloweSync` starts in the state `StInit`, then transitions into the `MarloweSync.StInit` state. 

## 1. MarloweSync sub-protocol

The MarloweSync sub-protocol is defined here: 

* [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/history-api/Language/Marlowe/Protocol/Sync/Types.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/history-api/Language/Marlowe/Protocol/Sync/Types.hs)

For example, for `MsgMarloweSync`, the data you can put in there is one of the messages from the Marlowe Sync protocol. 
Every message from the Marlowe Sync protocol is contained inside this message type. 

### Sub-protocol states

Init

Follow

Done

Idle

Next

Wait

Intersect

### Messages

MsgFollowContract

MsgIntersect

MsgContractNotFound

MsgContractFound

MsgDone

MsgRequestNext

MsgRollForward

MsgRollBackward

MsgRollBackCreation

MsgWait

MsgPoll

MsgCancel

MsgIntersectFound

MsgIntersectNotFound

## 2. MarloweHeaderSync sub-protocol

The MarloweHeaderSync sub-protocol is defined here: 

* [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/discovery-api/Language/Marlowe/Protocol/HeaderSync/Types.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/discovery-api/Language/Marlowe/Protocol/HeaderSync/Types.hs)

The MarloweHeaderSync sub-protocol is used to synchronize contract creation transactions. 
The client receives a stream of blocks, each of which contains one or more "contract header(s)". 
A contract header contains minimal information about a transaction that creates a new Marlowe contract. 

This is like the "subscribe to all of the contracts" protocol. 
This is what you would use to stay synchronized with the contracts on-chain. 
As the chain advances, and as new contracts are found, it will deliver them to the client. 

### Sub-protocol states

| Sub-protocol state | Description |
| --- | --- |
| 1. `Idle` | The initial state. | 
|   | Client has agency. | 
| 2. `Intersect` | When the client asks the server to fast-forward to a known chain point. | 
|   | Server has agency. | 
| 3. `Next` | When the client asks the server to provide the next block of contract headers. | 
|   | Server has agency. | 
| 4. `Wait` | When the server has no more blocks to send (i.e., the client has reached the tip of the chain). | 
|   | Client has agency. | 
| 5. `Done` | The terminal state. | 
|   | Nobody has agency. | 

### The Intersect state 

The intersect is when the client asks the server to fast forward to a known chain point. 
For example, in a situation where the client has already done a fair amount of synchronization, and then quits, when it starts up again, rather than starting over from the beginning of the chain, it can instead start from the point where it last left off. 
The Intersect is the server recognizing a point that both it and the client know about, then starting from there. 
On the other hand, if the server does not or cannot recognize what the client is referencing, it will start from the beginning of the chain (from genesis). 

### MarloweHeaderSync sub-protocol messages

| Sub-protocol messages | Attributes/Description |
| --- | --- |
| 1. `RequestNext` | Available from: `Idle`. | 
|   | Transitions to: `Next` | 
|   | Description: The client requests the next block of headers from the server. | 
| 2. `NewHeaders` | Available from: `Next` | 
|   | Transitions to: `Idle` | 
|   | Payload: | 
|   | [0]: A block header (the block to which the server has advanced the client) | 
|   | [1]: A list of contract headers that appear in that block. The typical synchronization loop behavior is that the client sends a request, `next`; the server sends new headers, then goes back into idle; the client sends another request `next`; the server sends new headers; the client continues to grab more headers from the server one block at a time until it catches up to the tip, when the server says `wait`. As the tip keeps getting extended with new blocks, the client has to pull new information and the cycle continues. | 
|   | Description: The server sends the next block of headers to the client.  | 
| 3. `RollBackward` | Available from: `Next` | 
|   | Transitions to: `Idle` | 
|   | Payload: Chain point (either a block header or Genesis if the chain has rolled all the way back to Genesis). 
|   | Description: The client's current position was rolled back, the server tells the client of the point to which it was rolled back. | 
| 4. `Wait` | Available from: `Next` | 
|   | Transitions to: `Wait` | 
|   | Description: The client is at the chain tip. There are no more Marlowe contract headers to send. The client may choose to wait and poll until more are available. | 
| 5. `Poll` | Available from: `Wait` | 
|   | Transitions to: `Next` | 
|   | Description: The client is checking with the server to find out if there are new headers available. | 
| 6. `Cancel` | Available from: `Wait` | 
|   | Transitions to: `Idle` | 
|   | Description: The client doesn't wish to wait, and returns to the idle state. Usually, when you send a `cancel`, in nearly all cases, it is followed by a `done` message. This is the case for clients that are only concerned about getting everything that is currently on the chain. Once that point is reached, when it reaches the tip, it communicates `done`. | 
| 7. `Done` | Available from: `Idle` | 
|   | Transitions to: `Done` | 
|   | Description: The client disconnects from the server. | 
| 8. `Intersect` | Available from: `Idle` | 
|   | Transitions to: `Intersect` | 
|   | Payload: A list of block headers in ascending order. It is a list because the client may be communicating with the server. These block headers represent the most recent blocks that the client has. It sees the last header that it sees after it detaches. The server might pull that block back. There is a chance that the client will send the most recent block and the server won't recognize it. Instead we allow the client to send a list of blocks. The server tries to find the most recent one that it also knows about, a mutually known reference point where it begins syncing from.  | 
|   | Description: The client tells the server which blocks it has already seen so that the server can start syncing from an appropriate point in the chain. | 
| 9. `IntersectFound` | Available from: `Intersect` | 
|   | Transitions to: `Idle` | 
|   | Payload: A block header (the most recent point the server has in common with the client). | 
|   | Description: The server has found an intersection point with the client and will start syncing *after* this point (i.e., the next `NewHeaders` message will be after this block). | 
| 10. `IntersectNotFound` | Available from: `Intersect` | 
|   | Transitions to: `Idle` | 
|   | Description: The server was unable to find an intersection point with the client and will start syncing from Genesis. |

## 3. MarloweQuery sub-protocol

The MarloweQuery sub-protocol is defined here: 

* [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/sync-api/Language/Marlowe/Protocol/Query/Types.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/sync-api/Language/Marlowe/Protocol/Query/Types.hs)

### Sub-protocol states

ReqContractHeaders

ReqContractState

ReqTransaction

ReqTransactions

ReqWithdrawal

ReqWithdrawals

ReqBoth

### MarloweQuery sub-protocol messages

TO DO

## 4. TxJob sub-protocol

The TxJob protocol is defined in two places. It is an instance of the generic Job protocol, which is a protocol that allows jobs to be run and their progress to be monitored. But it leaves abstract, what are the jobs and the commands that are available. In Marlowe Tx we have a specific set of commands that can be run. 

The TxJob sub-protocol is defined here: 

* [marlowe-runtime/tx-api/Language/Marlowe/Runtime/Transaction/Api.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/tx-api/Language/Marlowe/Runtime/Transaction/Api.hs)

  - The `MarloweTxCommand` type describes the available commands for marlowe-tx.

It is also defined in `marlowe-protocols/src/Network/Protocol/Job/Types.hs`

  - Defines the generic job protocol (command agnostic). 

### Sub-protocol states

TO DO

### TxJob sub-protocol messages

TO DO 
