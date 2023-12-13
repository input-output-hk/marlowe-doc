---
title: MarloweBulkSync sub-protocol
sidebar_position: 3
---

The MarloweBulkSync sub-protocol is defined here: 

- **[https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/sync-api/Language/Marlowe/Protocol/BulkSync/Types.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/sync-api/Language/Marlowe/Protocol/BulkSync/Types.hs)**

The MarloweBulkSync sub-protocol is used to synchronize all marlowe contract transactions. 
The client receives a stream of blocks, each of which contains collections of create, apply inputs, and withdraw transactions.

This is a firehose protocol. It gives far more information than the header sync
or regular sync protocols, but it may be inefficient for following a small set of contracts.

### Sub-protocol states

| Protocol state | Agency | Description |
| --- | --- | --- |
| 1. `Idle` | `Client` | The initial state. | 
| 2. `Intersect` | `Server` | When the client asks the server to fast forward to a known chain point. | 
| 3. `Next` | `Server` | When the client asks the server to provide the next block of Marlowe transactions. | 
| 4. `Poll` | `Client` | When the server has no more blocks to send (i.e., the client has reached the tip of the chain). | 
| 5. `Done` | `Nobody` | The terminal state. | 

### The Intersect state 

The Intersect is when the client asks the server to fast forward to a known chain point. 
For example, in a situation where the client has already done a fair amount of synchronization and then quits, when it starts up again, rather than starting over from Genesis, it can start from where it last left off.
The Intersect is the server recognizing a point that both it and the client know about, then starting from there. 
On the other hand, if the server does not or cannot recognize what the client is referencing, it will start from the beginning of the chain (from Genesis). 

### MarloweHeaderSync sub-protocol messages

| Message | Begin state | End state | Parameter | Description |
| --- | --- | --- | --- | --- |
| 1. `RequestNext` | `Idle` | `Next` | | The client requests the next block of headers from the server. |
| | | | `extraCount` | a number in the range [0, 255] that represents the number of *extra* blocks to fetch (0 = 1 block will be fetched). |
| 2. `RollForward blks blockHeader` | `Next` | `Idle` | | The server sends the next n blocks of transactions to the client. |
| | | | `blks` | The next extraCount + 1 blocks in the chain. |
| | | | `tip` | The tip of the chain. |
| 3. `RollBackward point tip` | `Next` | `Idle` | | The client's current position was rolled back, the server tells the client of the point to which it was rolled back. |
| | | | `point` | Chain point (either a block header or Genesis if the chain has rolled all the way back to Genesis). |
| | | | `tip` | The tip of the chain (either a block header or Genesis). |
| 4. `Wait` | `Next` | `Poll` | | The client is at the chain tip. There are no more Marlowe contract transactions to send. The client may choose to wait and poll until more are available. |
| 5. `Poll` | `Poll` | `Next` | | The client is checking with the server to find out if there are new blocks available. |
| 6. `Cancel` | `Poll` | `Idle` | | The client doesn't wish to wait, and returns to the idle state. Usually, when you send a `cancel`, in nearly all cases, it is followed by a `done` message. This is the case for clients that are only concerned about getting everything that is currently on the chain. Once that point is reached, when it reaches the tip, it communicates `done`. |
| 7. `Done` | `Idle` | `Done` | | Terminates the session. |
| 8. `Intersect blks` | `Idle` | `Intersect` | | The client tells the server which blocks it has already seen so that the server can start syncing from an appropriate point in the chain. |
| | | | `blks` | A contiguous list of block headers in ascending order. These block headers represent the most recent blocks from the client's chain. |
| 9. `IntersectFound blk` | `Intersect` | `Idle` | | The server has found an intersection point with the client and will start syncing *after* this point (i.e., the next `RollForward` message will be after this block). |
| | | | `blk` | The most recent block contained in both the client's chain and the server's chain. |
| 10. `IntersectNotFound` | `Intersect` | `Idle` | |The server was unable to find an intersection point with the client and will start syncing from Genesis. |

