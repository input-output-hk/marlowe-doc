---
title: Runtime protocol reference
sidebar_position: 5
---

> NOTE: Draft in progress

## Key Concepts

- Peer Role: either server or client. All protocol sessions take place between
  two peers -- one server and one client.
- Protocol State: A description of the current state of a protocol session.
- Peer Agency: Describes which peer role is able to send messages to the other
  in a given protocol state. Agency is exclusive (either server or client has
  agency, never both).
- Messages: Information / packets of data that a peer can send to the other
  when it has agency. Messages transition the protocol state from one state to
  another.

## Marlowe Protocol

The Marlowe Protocol is defined here: 

* [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/proxy-api/Language/Marlowe/Protocol/Types.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/proxy-api/Language/Marlowe/Protocol/Types.hs)

### Four sub-protocols

The Marlowe Protocol consists of four sub-protocols: 

1. Marlowe Sync sub-protocol
2. Marlowe Header Sync sub-protocol
3. Marlowe Query sub-protocol
4. Tx Job sub-protocol

### Client starts session

The Client starts a session by sending a message to the server saying which sub-protocol it intends to communicate with, then a protocol session for the sub-protocol begins. 

### Protocol states

There are five protocol states: `Init`, `MarloweSync`, `MarloweHeaderSync`, `MarloweQuery`, `TxJob`. 

| Protocol state | Description |
| --- | --- |
| 1. `Init` | The initial state. | 
|     | Client has agency. | 
| 2. `MarloweSync` | The peers are communicating via the Marlowe Sync sub-protocol. | 
|  | Agency depends on the sub-protocol. | 
|  | *Associated data:* a Marlowe Sync protocol state. | 
| 3. `MarloweHeaderSync` | The peers are communicating via the Marlowe Header Sync sub-protocol. | 
|   | Agency depends on sub-protocol. | 
|   | *Associated data:* a Marlowe Header Sync protocol state. | 
| 4. `MarloweQuery` | The peers are communicating via the Marlowe Query sub-protocol. | 
|   | Agency depends on sub-protocol. | 
|   | *Associated data:* a Marlowe Query protocol state. | 
| 5. `TxJob` | The peers are communicating via the Tx Job sub-protocol | 
|   | Agency depends on sub-protocol. | 
|   | *Associated data:* a Tx Job protocol state. | 

### Messages

1. `MsgRunMarloweSync` - Choose to communicate via Marlowe sync
  - Available from `Init`
  - Transitions to `MarloweSync`
2. `MsgRunMarloweHeaderSync` - Choose to communicate via Marlowe header sync
  - Available from `Init`
  - Transitions to `MarloweHeaderSync`
3. `MsgRunMarloweQuery` - Choose to communicate via Marlowe query
  - Available from `Init`
  - Transitions to `MarloweQuery`
4. `MsgRunTxJob` - Choose to communicate via tx job
  - Available from `Init`
  - Transitions to `TxJob`
5. `MsgMarloweSync` - Send a Marlowe Sync message
  - Available from `MarloweSync` (with sub state st)
  - Transitions to `MarloweSync` (with sub state determined by the payload message)
  - Payload: A Marlowe Sync message (available from sub state st)
6. `MsgMarloweHeaderSync` - Send a Marlowe header sync message
  - Available from `MarloweHeaderSync` (with sub state st)
  - Transitions to `MarloweHeaderSync` (with sub state determined by the payload message)
  - Payload: A Marlowe Header Sync message (available from sub state st)
7. `MsgMarloweQuery` - Send a Marlowe Query message
  - Available from `MarloweQuery` (with sub state st)
  - Transitions to `MarloweQuery` (with sub state determined by the payload message)
  - Payload: A Marlowe Query message (available from sub state st)
8. `MsgTxJob` - Send a Tx Job message
  - Available from `TxJob` (with sub state st)
  - Transitions to `TxJob` (with sub state determined by the payload message)
  - Payload: A Tx Job message (available from sub state st)

## Marlowe Sync Protocol

The Marlowe Sync Protocol is defined here: 

* [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/history-api/Language/Marlowe/Protocol/Sync/Types.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/history-api/Language/Marlowe/Protocol/Sync/Types.hs)


### Protocol States

### Messages

## Marlowe Header Sync Protocol

Defined in `marlowe-runtime/discovery-api/Language/Marlowe/Protocol/HeaderSync/Types.hs`

Used to synchronize contract creation transactions. The client receives a stream
of blocks, each of which contain one or more "contract header(s)". A contract
header contains minimal information about a transaction that creates a new
Marlowe contract.

### Protocol States

1. Idle
  - The initial state
  - Agency: client
2. Intersect
  - When the client asks the server to fast-forward to a known chain point.
  - Agency: server
3. Next
  - When the client asks the server to provide the next block of contract headers.
  - Agency: server
4. Wait
  - When the server has no more blocks to send (i.e. the client has reached the tip
    of the chain).
  - Agency: client
5. Done
  - The terminal state
  - Agency: nobody

### Messages

1. RequestNext
  - Available from: Idle
  - Transitions to: Next
  - Description: The client requests the next block of headers from the server.
2. NewHeaders
  - Available from: Next
  - Transitions to: Idle
  - Payload:
    - [0]: A block header (the block the server have advanced the client to)
    - [1]: A list of contract headers that appear in that block
  - Description: The server sends the next block of headers to the client.
3. RollBackward
  - Available from: Next
  - Transitions to: Idle
  - Payload: Chain point (either a block header, or Genesis)
  - Description: The client's current position was rolled back, the server tells
    the client where it was rolled back to.
4. Wait
  - Available from: Next
  - Transitions to: Wait
  - Description: The client is at the chain tip, there are no more Marlowe
    contract headers to send, so the client may choose to wait and poll until
    more are available.
5. Poll
  - Available from: Wait
  - Transitions to: Next
  - Description: The client is checking with the server if there are new headers
    available.
6. Cancel
  - Available from: Wait
  - Transitions to: Idle
  - Description: The client doesn't wish to wait, and returns to the idle state.
7. Done
  - Available from: Idle
  - Transitions to: Done
  - Description: The client disconnects from the server.
8. Intersect
  - Available from: Idle
  - Transitions to: Intersect
  - Payload: List of block headers, in ascending order
  - Description: The client tells the server which blocks it has
    already seen so that the server can start syncing from an appropriate
    point in the chain.
9. IntersectFound
  - Available from: Intersect
  - Transitions to: Idle
  - Payload: A block header (the most recent point the server has in common with the client)
  - Description: The server has found an intersection point with the client and will
    start syncing *after* this point (i.e. the next `NewHeaders` message will be
    after this block).
10. IntersectNotFound
  - Available from: Intersect
  - Transitions to: Idle
  - Description: The server was unable to find an intersection point with the client
    and will start syncing from Genesis.

## Marlowe Query Protocol

Defined in `marlowe-runtime/sync-api/Language/Marlowe/Protocol/Query/Types.hs`

### Protocol States

### Messages

## Tx Job Protocol

Defined in `marlowe-runtime/tx-api/Language/Marlowe/Runtime/Transaction/Api.hs`
  - The `MarloweTxCommand` type describes the available commands for marlowe-tx.
Defined in `marlowe-protocols/src/Network/Protocol/Job/Types.hs`
  - Defines the generic job protocol (command agnostic).

### Protocol States

### Messages