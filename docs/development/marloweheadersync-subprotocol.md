---
title: MarloweHeaderSync sub-protocol
---

The MarloweHeaderSync sub-protocol is defined here: 

* [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/discovery-api/Language/Marlowe/Protocol/HeaderSync/Types.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/discovery-api/Language/Marlowe/Protocol/HeaderSync/Types.hs)

The MarloweHeaderSync sub-protocol is used to synchronize contract creation transactions. 
The client receives a stream of blocks, each of which contains one or more "contract header(s)". 
A contract header contains minimal information about a transaction that creates a new Marlowe contract. 

This is like the "subscribe to all of the contracts" protocol. 
This is what you would use to stay synchronized with the contracts on-chain. 
As the chain advances, and as new contracts are found, it will deliver them to the client. 

### Sub-protocol states

| Protocol state | Agency | Description |
| --- | --- | --- |
| 1. `Idle` | `Client` | The initial state. | 
| 2. `Intersect` | `Server` | When the client asks the server to fast-forward to a known chain point. | 
| 3. `Next` | `Server` | When the client asks the server to provide the next block of contract headers. | 
| 4. `Wait` | `Client` | When the server has no more blocks to send (i.e., the client has reached the tip of the chain). | 
| 5. `Done` | `Nobody` | The terminal state. | 

### The Intersect state 

The intersect is when the client asks the server to fast forward to a known chain point. 
For example, in a situation where the client has already done a fair amount of synchronization, and then quits, when it starts up again, rather than starting over from genesis, it can instead start from the point where it last left off. 
The Intersect is the server recognizing a point that both it and the client know about, then starting from there. 
On the other hand, if the server does not or cannot recognize what the client is referencing, it will start from the beginning of the chain (from genesis). 

### MarloweHeaderSync sub-protocol messages

| Message | Begin State | End State | Parameter | Description |
| --- | --- | --- | --- | --- |
| 1. `RequestNext` | `Idle` | `Next` | | The client requests the next block of headers from the server. |
| 2. `NewHeaders blk headers` | `Next` | `Idle` | | The server sends the next block of headers to the client. |
| | | | `blk` | A block header (the block to which the server has advanced the client) |
| | | | `headers` | A list of contract headers that appear in that block. |
| 3. `RollBackward point` | `Next` | `Idle` | | The client's current position was rolled back, the server tells the client of the point to which it was rolled back. |
| | | | `point` | Chain point (either a block header or Genesis if the chain has rolled all the way back to Genesis). |
| 4. `Wait` | `Next` | `Wait` | | The client is at the chain tip. There are no more Marlowe contract headers to send. The client may choose to wait and poll until more are available. |
| 5. `Poll` | `Wait` | `Next` | | The client is checking with the server to find out if there are new headers available. |
| 6. `Cancel` | `Wait` | `Idle` | | The client doesn't wish to wait, and returns to the idle state. Usually, when you send a `cancel`, in nearly all cases, it is followed by a `done` message. This is the case for clients that are only concerned about getting everything that is currently on the chain. Once that point is reached, when it reaches the tip, it communicates `done`. |
| 7. `Done` | `Idle` | `Done` | | Terminate the session. |
| 8. `Intersect blks` | `Idle` | `Intersect` | | The client tells the server which blocks it has already seen so that the server can start syncing from an appropriate point in the chain. |
| | | | `blks` | A contiguous list of block headers in ascending order. These block headers represent the most recent blocks from the client' chain. |
| 9. `IntersectFound blk` | `Intersect` | `Idle` | | The server has found an intersection point with the client and will start syncing *after* this point (i.e., the next `NewHeaders` message will be after this block). |
| | | | `blk` | The most recent block contained in both the client's chain and the server's chain. |
| 10. `IntersectNotFound` | `Intersect` | `Idle` | |The server was unable to find an intersection point with the client and will start syncing from Genesis. |

