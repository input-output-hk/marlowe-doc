---
title: Runtime protocol API reference
sidebar_position: 5
---

> NOTE: Draft in progress

> * Add examples and use cases
> * Add more details to message descriptions

## Introduction

Marlowe Runtime is the application backend for managing Marlowe contracts on the Cardano blockchain. 
The term "Runtime" refers to the whole system, its components and sub-components. 
The Runtime API protocol enables communicating with Runtime directly. 
The Marlowe Runtime protocol API defines everything you can do with the Runtime. 
Anything that can't be done through these protocols can't be done the Runtime. 

### Use case

If you want to write a client application that interacts with the Runtime, and you don't want to use the REST API, Runtime CLI or Marlowe CLI, or any other intermediary, but instead want to connect directly to the TCP socket that the Runtime exposes, this Runtime protocol API reference document is for you. 
You may be writing scripts, command-line tools, servers for DApps that communicate with the Runtime, or anything that needs to communicate with the Runtime. 
This document describes the protocols, sub-protocols, states and messages to inform your code development. 

### Intended audience

This document is intended for someone who needs to understand the behavior of these protocols and how to work with them. 
Runtime and its protocols and sub-protocols communicate with one another to enable Runtime's core mission, which is discovering and querying on-chain Marlowe contracts, and creating Marlowe transactions. 

The components communicate internally with one another. 
These protocols, and specifically this root-level protocol, is the primary API for the Runtime. 
If you want to communicate with the Runtime, ultimately, you will be using these protocols. 
You don't necessarily need to be aware of the protocols to be able to communicate with the Runtime. 
For example, you could be using the REST API, Runtime CLI or Marlowe CLI. 
Under the hood, the REST API communicates with the Runtime using this protocol. 
Everything that communicates with the Runtime uses this protocol. 

### History

Why do we have this Marlowe protocol rather than the four individual protocols? We didn't use to have this Marlowe protocol. You used to have to connect to different TCP ports to speak to the different protocols. That requires you to have some knowledge of the topology of the system -- which socket to connect to for which protocol -- this abstracts that away. From the perspective of someone using the Runtime, there is ONE TCP port, they speak this protocol to it. Behind the scenes, the proxy component routes the specific sub-protocols to the correct back-end service that will serve that protocol. 

Marlowe protocol allows clients to treat the Runtime as one single entity that they are communicating with. 

## Key concepts

| Concepts | Description |
| --- | --- |
| Peer Role | Either server or client. All protocol sessions take place between two peers -- one server and one client. | 
| Protocol State | A description of the current state of a protocol session. | 
| Peer Agency | Describes which peer role is able to send messages to the other in a given protocol state. Agency is exclusive (either server or client has agency, never both). When one peer is able to send a message to the other peer, it has agency. When a peer is in a state of only being able to receive a message, we say it does not have agency. | 
| Messages | Information / packets of data that a peer can send to the other when it has agency. When a message is sent, that event transitions the protocol state from one state to another state. | 

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

1. Marlowe Sync sub-protocol
2. Marlowe Header Sync sub-protocol
3. Marlowe Query sub-protocol
4. Tx Job sub-protocol

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
| 2. `MarloweSync` | The peers are communicating via the Marlowe Sync sub-protocol. | 
|  | Agency depends on sub-protocol. | 
|  | *Associated data:* a `MarloweSync` sub-protocol state. | 
| 3. `MarloweHeaderSync` | The peers are communicating via the Marlowe Header Sync sub-protocol. | 
|   | Agency depends on sub-protocol. | 
|   | *Associated data:* a `MarloweHeaderSync` sub-protocol state. | 
| 4. `MarloweQuery` | The peers are communicating via the Marlowe Query sub-protocol. | 
|   | Agency depends on sub-protocol. | 
|   | *Associated data:* a `MarloweQuery` sub-protocol state. | 
| 5. `TxJob` | The peers are communicating via the Tx Job sub-protocol. | 
|   | Agency depends on sub-protocol. | 
|   | *Associated data:* a `TxJob` sub-protocol state. | 

### Messages

There are eight message types in the Marlowe protocol, described as follows: 

| Message | Description |
| --- | --- |
| 1. `MsgRunMarloweSync` | Choose to communicate via Marlowe Sync. | 
|   |  Available from `Init`. | 
|   | Transitions to `MarloweSync`. | 
| 2. `MsgRunMarloweHeaderSync` | Choose to communicate via Marlowe Header Sync. | 
|   | Available from `Init`. | 
|   | Transitions to `MarloweHeaderSync`. | 
| 3. `MsgRunMarloweQuery` | Choose to communicate via Marlowe Query. | 
|   |  Available from `Init`. | 
|   |  Transitions to `MarloweQuery`. | 
| 4. `MsgRunTxJob` | Choose to communicate via Tx Job. | 
|   |  Available from `Init`. | 
|   |  Transitions to `TxJob`. | 
| 5. `MsgMarloweSync` | Send a Marlowe Sync message. | 
|   |  Available from `MarloweSync` (with sub state st). | 
|   |  Transitions to `MarloweSync` (with sub state determined by the payload message). | 
|   |  Payload: A Marlowe Sync message (available from sub state st). | 
| 6. `MsgMarloweHeaderSync` | Send a Marlowe Header Sync message. | 
|   |  Available from `MarloweHeaderSync` (with sub state st). | 
|   |  Transitions to `MarloweHeaderSync` (with sub state determined by the payload message). | 
|   |  Payload: A Marlowe Header Sync message (available from sub state st). | 
| 7. `MsgMarloweQuery` | Send a Marlowe Query message. | 
|   |  Available from `MarloweQuery` (with sub state st). | 
|   |  Transitions to `MarloweQuery` (with sub state determined by the payload message). | 
|   |  Payload: A Marlowe Query message (available from sub state st). | 
| 8. `MsgTxJob` | Send a Tx Job message. | 
|   |  Available from `TxJob` (with sub state st). | 
|   |  Transitions to `TxJob` (with sub state determined by the payload message). | 
|   |  Payload: A Tx Job message (available from sub state st). | 

For each of them, there is a message type that is a carrier for that sub-protocol. 
You can think of this MsgMarloweSync message type as embedding a message from the sub-protocol in the Marlowe protocol. 

There is also a binary format for the Marlowe protocol. 
The binary format describes how each message type is converted into binary data and then read and decoded from binary data.
That is important to know in order to send messages over TCP. 

> Jamie will write this up. 

The Marlowe multi-plexes 4 protocols into one protocol. 
The client always sends one of these 4 messages to start. 
Depending on which of these 4 it started the session with, it will then continuously send ... if it starts with MsgRunMarloweSync, the client and server will then just exchange MsgMarloweSync back and forth. 
Inside each of those is a message from the underlying Marlowe Sync protocol. 

When finished, it disconnects and the session is over. 

> The next step is to go down into each sub-protocol and document it in a similar way as in the above case. 

For example, for MsgMarloweSync, the data you can put in there is one of the messages from the Marlowe Sync protocol. 
Every message from the Marlowe Sync protocol is contained inside this message type here. 

Talking about the source files: 
There is a data structure here that describes the different states of the protocol. 
There is a message type that says, "These are all the various messages available for this protocol." 
Each message says what is the initial state of the message. 
For example, the MsgRunMarloweSync all start in StInit, then they transition into the ... 

23:00 in the recording -- talking about the source files. 

## Marlowe Sync sub-protocol

The Marlowe Sync sub-protocol is defined here: 

* [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/history-api/Language/Marlowe/Protocol/Sync/Types.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/history-api/Language/Marlowe/Protocol/Sync/Types.hs)

### Sub-protocol states

TO DO

### Messages

TO DO

## Marlowe Header Sync sub-protocol

The Marlowe Header Sync sub-protocol is defined here: 

* [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/discovery-api/Language/Marlowe/Protocol/HeaderSync/Types.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/discovery-api/Language/Marlowe/Protocol/HeaderSync/Types.hs)

The Marlowe Header Sync sub-protocol is used to synchronize contract creation transactions. 
The client receives a stream of blocks, each of which contains one or more "contract header(s)". 
A contract header contains minimal information about a transaction that creates a new Marlowe contract. 

This is like the "subscribe to all of the contracts" protocol. 
This is what you would use to stay synchronized with the contracts on-chain. 
As the chain advances, as new contracts are found, it will deliver them to the client. 

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

### More about the Intersect state 

The intersect is when the client asks the server to fast forward to a known chain point. 
Imagine that the client has already done a fair amount of synchronization and then quits. 
When it starts up again, rather than start again from the beginning, it can say, here is where I last left off, so start from here. 
The Intersect is the server recognizing I know about that point too, let's start from there. 
Or, I don't know what you're talking about, start from the beginning. 

### Marlowe Header Sync sub-protocol messages

| Sub-protocol messages | Attributes/Description |
| --- | --- |
| 1. `RequestNext` | Available from: `Idle`. | 
|   | Transitions to: `Next` | 
|   | Description: The client requests the next block of headers from the server. | 
| 2. `NewHeaders` | Available from: `Next` | 
|   | Transitions to: `Idle` | 
|   | Payload: | 
|   | [0]: A block header (the block to which the server has advanced the client) | 
|   | [1]: A list of contract headers that appear in that block. The typial synchronization loop is the client sends a request 'next', server sends new headers, goes back into idle, client sends another request next, server sends new headers, grabs the headers one block at a time from the server until it catches up to the tip, when the server says 'wait', then the client has to pull new information. | 
|   | Description: The server sends the next block of headers to the client.  | 
| 3. `RollBackward` | Available from: `Next` | 
|   | Transitions to: `Idle` | 
|   | Payload: Chain point (either a block header or Genesis if the chain has rolled all the way back to genesis)
|   | Description: The client's current position was rolled back, the server tells the client where it was rolled back to. | 
| 4. `Wait` | Available from: `Next` | 
|   | Transitions to: `Wait` | 
|   | Description: The client is at the chain tip, there are no more Marlowe contract headers to send, so the client may choose to wait and poll until more are available. | 
| 5. `Poll` | Available from: `Wait` | 
|   | Transitions to: `Next` | 
|   | Description: The client is checking with the server to find out if there are new headers available. | 
| 6. `Cancel` | Available from: `Wait` | 
|   | Transitions to: `Idle` | 
|   | Description: The client doesn't wish to wait, and returns to the idle state. Usually, when you send a 'cancel', in 90% of cases, it is followed by a 'done' message. This is the case where the particular client you are writing, all it is concerned with getting everything that is currently on the chain and when it reaches the tip, it says "I'm done." | 
| 7. `Done` | Available from: `Idle` | 
|   | Transitions to: `Done` | 
|   | Description: The client disconnects from the server. | 
| 8. `Intersect` | Available from: `Idle` | 
|   | Transitions to: `Intersect` | 
|   | Payload: List of block headers, in ascending order. These block headers represent the most recent blocks that I have as the client. It is a list because the client may be communicating with the server, it sees the last header that it sees after it detaches, the server might pull that block back. There is a chance that the client will send the most recent block and the server won't recognize it. Instead we allow the client to send a list of blocks, the server tries to find the most recent one that it also knows about, and that is where it begins syncing from. A mutually known reference point. | 
|   | Description: The client tells the server which blocks it has already seen so that the server can start syncing from an appropriate point in the chain. | 
| 9. `IntersectFound` | Available from: `Intersect` | 
|   | Transitions to: `Idle` | 
|   | Payload: A block header (the most recent point the server has in common with the client) | 
|   | Description: The server has found an intersection point with the client and will start syncing *after* this point (i.e., the next `NewHeaders` message will be after this block). | 
| 10. `IntersectNotFound` | Available from: `Intersect` | 
|   | Transitions to: `Idle` | 
|   | Description: The server was unable to find an intersection point with the client and will start syncing from Genesis. |

## Marlowe Query sub-protocol

The Marlowe Query sub-protocol is defined here: 

* [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/sync-api/Language/Marlowe/Protocol/Query/Types.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/sync-api/Language/Marlowe/Protocol/Query/Types.hs)

### Sub-protocol states

TO DO

### Marlowe Query sub-protocol messages

TO DO

## Tx Job sub-protocol

The TxJob protocol is defined in two places. It is an instance of the generic Job protocol, which is a protocol that allows jobs to be run and their progress to be monitored. But it leaves abstract, what are the jobs and the commands that are available. In Marlowe Tx we have a specific set of commands that can be run. 

The Tx Job sub-protocol is defined here: 

* [marlowe-runtime/tx-api/Language/Marlowe/Runtime/Transaction/Api.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/tx-api/Language/Marlowe/Runtime/Transaction/Api.hs)

  - The `MarloweTxCommand` type describes the available commands for marlowe-tx.

It is also defined in `marlowe-protocols/src/Network/Protocol/Job/Types.hs`
  - Defines the generic job protocol (command agnostic). 

### Sub-protocol states

TO DO

### Tx Job sub-protocol messages

TO DO 
