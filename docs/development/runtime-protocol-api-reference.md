---
title: Runtime protocol API reference
sidebar_position: 5
---

> NOTE: Draft in progress
> Add examples and use cases
> If possile, add more details to message descriptions

This is the core reference material for the Runtime. Everything else is tangential. This defines everything you can do with the Runtime. If you can't do it through these protocols, then you can't do it with the Runtime. 

Provisioning, connecting services to one another, is another topic. But in terms of "the Runtime," this *is* the Runtime. 

Marlowe runtime binary protocol | may be a bit more descriptive. "binary" could be a turn-off. 
Marlowe runtime | runtime protocol reference. 

Reference documentation for the Runtime protocol. Not a user manual, it is the API reference for the Runtime protocol. 

Runtime protocol API reference

## Key Concepts

| Concepts | Description |
| --- | --- |
| Peer Role | Either server or client. All protocol sessions take place between two peers -- one server and one client. | 
| Protocol State | A description of the current state of a protocol session. | 
| Peer Agency | Describes which peer role is able to send messages to the other in a given protocol state. Agency is exclusive (either server or client has agency, never both). | 
| Messages | Information / packets of data that a peer can send to the other when it has agency. Messages transition the protocol state from one state to another. | 

Certain message types are only available from certain states, and when a peer sends a message to the other peer, it changes the state of the protocol and that potentially changes the peer agency as well. In the majority of cases, agency alternates. For example, the client will send a message to the server, then the server will gain agency. Then the server sends a message back to the client and the client will gain agency again. There are some cases where one peer will send multiple messages and keep agency between them, but for the most part it is a back and forth sort of thing. 

## Marlowe Protocol

The top-level protocol is the Marlowe protocol. It is defined here: 

* [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/proxy-api/Language/Marlowe/Protocol/Types.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/proxy-api/Language/Marlowe/Protocol/Types.hs)

### Four sub-protocols

The Marlowe Protocol consists of four sub-protocols: 

1. Marlowe Sync sub-protocol
2. Marlowe Header Sync sub-protocol
3. Marlowe Query sub-protocol
4. Tx Job sub-protocol

### Client starts session

The Client starts a session by sending a message to the server saying which sub-protocol it intends to communicate with, then a protocol session for the sub-protocol begins. 

### Marlowe protocol states

There are five Marlowe protocol states: `Init`, `MarloweSync`, `MarloweHeaderSync`, `MarloweQuery`, `TxJob` that the Marlowe protocol can be in. 

There is an `init` state, then there is one protocol state per sub-protocol. It is fairly straight forward how these states transition. The protocol starts in the `init` state, and then via one of the message types, it will transition into either the Marlowe Sync, the Marlowe Header Sync, the Marlowe Query or the TxJob state. Once in that state, it stays there for the rest of the session. You're just talking in that protocol. 

The message types that are available are ... (jumps to info further below). 



| Marlowe protocol state | Description |
| --- | --- |
| 1. `Init` | The initial state. | 
|     | Client has agency. | 
| 2. `MarloweSync` | The peers are communicating via the Marlowe Sync sub-protocol. | 
|  | Agency depends on the sub-protocol. | 
|  | *Associated data:* a Marlowe Sync sub-protocol state. | 
| 3. `MarloweHeaderSync` | The peers are communicating via the Marlowe Header Sync sub-protocol. | 
|   | Agency depends on sub-protocol. | 
|   | *Associated data:* a Marlowe Header Sync sub-protocol state. | 
| 4. `MarloweQuery` | The peers are communicating via the Marlowe Query sub-protocol. | 
|   | Agency depends on sub-protocol. | 
|   | *Associated data:* a Marlowe Query sub-protocol state. | 
| 5. `TxJob` | The peers are communicating via the Tx Job sub-protocol | 
|   | Agency depends on sub-protocol. | 
|   | *Associated data:* a Tx Job sub-protocol state. | 

--> Broader context: For someone needing to understand what's going on with these protocols. Runtime and its protocols and sub-protocols have ways of communicating with one another so that it all works. For people out there wanting to use Marlowe, what are they needing to understand? 

yes, you described how the components communicate internally with one another. These protocols and specifically this root-level protocl is THE primary API for the Runtime. So if someone wants to communicate with the Runtime, ultimately, they are going to be using the protocols. You don't necessarily need to be aware of the protocols to be able to communicate with the Runtime. For example, you could be using REST API. The REST API under the hood communicates with the Runtime using this protocol. So does the CLI, and everything that communicates with the Runtime uses this protocol. 

The use case here is that if someone wanted to write a client application that interacts with the Runtime, but they don't want to use the REST API and they don't want to use another intermediary, they want to connect directly to the TCP socket that the Runtime exposes and talk with it using this binary protocol. 

This is the more granular level API (THE API for Runtime), you have to use this protocol. 

The Marlowe protocol. It is about communicating with Runtime. Runtime has its various sub components. Runtime is the whole system. 

Why do we have this Marlowe protocol rather than the four individual protocols? We didn't use to have this Marlowe protocol. You used to have to connect to different TCP ports to speak to the different protocols. That requires you to have some knowledge of the topology of the system -- which socket to connect to for which protocol -- this abstracts that away. From the perspective of someone using the Runtime, there is ONE TCP port, they speak this protocol to it. Behind the scenes, the proxy component routes the specific sub-protocols to the correct back-end service that will serve that protocol. 

Marlowe protocol allows clients to treat the Runtime as one single entity that they are communicating with. 




### Messages

There are eight messages: 

| Message | Description |
| --- | --- |
| 1. `MsgRunMarloweSync` | Choose to communicate via Marlowe sync. | 
|   |  Available from `Init`. | 
|   | Transitions to `MarloweSync`. | 
| 2. `MsgRunMarloweHeaderSync` | Choose to communicate via Marlowe header sync. | 
|   | Available from `Init`. | 
|   | Transitions to `MarloweHeaderSync`. | 
| 3. `MsgRunMarloweQuery` | Choose to communicate via Marlowe query. | 
|   |  Available from `Init`. | 
|   |  Transitions to `MarloweQuery`. | 
| 4. `MsgRunTxJob` | Choose to communicate via Tx Job. | 
|   |  Available from `Init`. | 
|   |  Transitions to `TxJob`. | 
| 5. `MsgMarloweSync` | Send a Marlowe Sync message. | 
|   |  Available from `MarloweSync` (with sub state st). | 
|   |  Transitions to `MarloweSync` (with sub state determined by the payload message). | 
|   |  Payload: A Marlowe Sync message (available from sub state st). | 
| 6. `MsgMarloweHeaderSync` | Send a Marlowe header sync message. | 
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

For each of them, there is a message type that is a carrier for that sub-protocol. You can think of this MsgMarloweSync message type as embedding a message from the sub-protocol in the Marlowe protocol. 

Someone may be writing scripts, command-line ::: could write either. Could write command-line tools, could write servers for DApps that communicate with the Runtime, could write scripts, anything that needs to communicate with the Runtime. 

These (above) are the 8 message types in the Marlowe protocol. 

There is also a binary format for the Marlowe protocol. The binary format describes how each message type is converted into binary data and then read and decoded from binary data. That is important to know in order to send messages over TCP. Jamie will write this up. 

The Marlowe multi-plexes 4 protocols into one protocol. The way that it goes is that the client always sends one of these 4 messages to start. Depending on which of these 4 it started the session with, it will then continuously send ... if it starts with MsgRunMarloweSync, the client and server will then just exchange MsgMarloweSync back and forth. Inside each of those is a message from the underlying Marlowe Sync protocol. 

When finished, it disconnects and the session is over. 

The next step is to go down into each sub-protocol and document it in a similar way as we've just done above. 

For example, for MsgMarloweSync, the data you can put in there is one of the messages from the Marlowe Sync protocol. Every message from the Marlowe Sync protocol is contained inside this message type here. 

Talking about the source files: There is a data structure here that describes the different states of the protocol. There is a message type that says these are all the various messages available for this protocol. Each message says what is the initial state of the message. For example, the MsgRunMarloweSync all start in StInit, then they transition into the 

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

The Marlowe Header Sync sub-protocol is used to synchronize contract creation transactions. The client receives a stream of blocks, each of which contains one or more "contract header(s)". A contract header contains minimal information about a transaction that creates a new Marlowe contract. 

### Sub-protocol states

| Sub-protocol state | Description |
| --- | --- |
| 1. Idle | The initial state. | 
|   | Agency: client. | 
| 2. Intersect | When the client asks the server to fast-forward to a known chain point. | 
|   | Agency: server. | 
| 3. Next | When the client asks the server to provide the next block of contract headers. | 
|   | Agency: server. | 
| 4. Wait | When the server has no more blocks to send (i.e., the client has reached the tip of the chain). | 
|   | Agency: client. | 
| 5. Done | The terminal state. | 
|   | Agency: nobody. | 

### Messages

| Sub-protocol messages | Attributes/Description |
| --- | --- |
| 1. RequestNext | Available from: Idle. | 
|   | Transitions to: Next | 
|   | Description: The client requests the next block of headers from the server. | 
| 2. NewHeaders | Available from: Next | 
|   | Transitions to: Idle | 
|   | Payload: | 
|   | [0]: A block header (the block to which the server has advanced the client) | 
|   | [1]: A list of contract headers that appear in that block | 
|   | Description: The server sends the next block of headers to the client. | 
| 3. RollBackward | Available from: Next | 
|   | Transitions to: Idle | 
|   | Payload: Chain point (either a block header or Genesis)
|   | Description: The client's current position was rolled back, the server tells the client where it was rolled back to. | 
| 4. Wait | Available from: Next | 
|   | Transitions to: Wait | 
|   | Description: The client is at the chain tip, there are no more Marlowe contract headers to send, so the client may choose to wait and poll until more are available. | 
| 5. Poll | Available from: Wait | 
|   | Transitions to: Next | 
|   | Description: The client is checking with the server if there are new headers available. | 
| 6. Cancel | Available from: Wait | 
|   | Transitions to: Idle | 
|   | Description: The client doesn't wish to wait, and returns to the idle state. | 
| 7. Done | Available from: Idle | 
|   | Transitions to: Done | 
|   | Description: The client disconnects from the server. | 
| 8. Intersect | Available from: Idle | 
|   | Transitions to: Intersect | 
|   | Payload: List of block headers, in ascending order | 
|   | Description: The client tells the server which blocks it has already seen so that the server can start syncing from an appropriate point in the chain. | 
| 9. IntersectFound | Available from: Intersect | 
|   | Transitions to: Idle | 
|   | Payload: A block header (the most recent point the server has in common with the client) | 
|   | Description: The server has found an intersection point with the client and will start syncing *after* this point (i.e., the next `NewHeaders` message will be after this block). | 
| 10. IntersectNotFound | Available from: Intersect | 
|   | Transitions to: Idle | 
|   | Description: The server was unable to find an intersection point with the client and will start syncing from Genesis. |

## Marlowe Query sub-protocol

The Marlowe Query sub-protocol is defined here: 

* [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/sync-api/Language/Marlowe/Protocol/Query/Types.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/sync-api/Language/Marlowe/Protocol/Query/Types.hs)

### Sub-protocol states

TO DO

### Messages

TO DO

## Tx Job sub-protocol

The Tx Job sub-protocol is defined here: 

* [marlowe-runtime/tx-api/Language/Marlowe/Runtime/Transaction/Api.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/tx-api/Language/Marlowe/Runtime/Transaction/Api.hs)

  - The `MarloweTxCommand` type describes the available commands for marlowe-tx.

Defined in `marlowe-protocols/src/Network/Protocol/Job/Types.hs`
  - Defines the generic job protocol (command agnostic).

### Sub-protocol states

TO DO

### Messages

TO DO 
