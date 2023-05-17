---
title: MarloweQuery sub-protocol
sidebar_position: 4
---

The MarloweQuery sub-protocol is defined here: 

* [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/sync-api/Language/Marlowe/Protocol/Query/Types.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/sync-api/Language/Marlowe/Protocol/Query/Types.hs)

The `MarloweQuery` protocol allows clients to query the current state of on-chain Marlowe contracts.

### Sub-protocol states

| Protocol state | Agency | Parameter | Description |
| --- | --- | --- | --- |
| 1. `Req` | `Client` | | The client is preparing a request to send. |
| 2. `Res a` | `Server` | | The server handling a request from the client. |
| | | `a` | The type of the response. |
| 3. `Done` | `Nobody` | | The terminal state. |

### MarloweQuery sub-protocol messages

| Message | Begin state | End state | Parameter | Description |
| --- | --- | --- | --- | --- |
| 1. `Request req` | `Req` | `Res a` |  | Send a request to the server. |
| | | | `req` | A request with a result of type `a`. |
| 2. `Respond a` | `Res a` | `Req` |  | Send a response to the client. |
| | | | `a` | The response. |
| 3. `Done` | `Req` | `Done` |  | Terminate the session. |

### Request Types

The `Request` message type accepts a request payload which has an associated
result type. The following requests are supported:


| Request | Parameter | Description |
| --- | --- | --- |
| `ContractHeaders filter range` |  | Returns a page of contract headers, or Nothing if the range specified an invalid start point. |
|  | `filter` | A list of tags to and a list of role token currencies to limit the results. |
|  | `range` | The ID of the contract to start from, offset, size, and sort direction that describes the page to fetch. |
| `ContractState id` |  | Returns the current state of a contract by its ID. |
|  | `id` | The ID of the contract. |
| `Transactions id` |  | Returns the apply inputs transaction of a contract by its ID. |
|  | `id` | The ID of the contract. |
| `Transaction id` |  | Returns an apply inputs transaction by its ID. |
|  | `id` | The ID of the transaction. |
| `Withdrawals filter range` |  | Returns a page of withdrawal transactions, or Nothing if the range specified an invalid start point. |
|  | `filter` | A list of role token currencies to limit the results. |
|  | `range` | The ID of the withdrawal to start from, offset, size, and sort direction that describes the page to fetch. |
| `Withdrawal id` |  | Returns a withdraw transaction by its ID. |
|  | `id` | The ID of the withdraw transaction. |
| `Both req1 req2` |  | Run two requests in parallel and return the results from both. |
|  | `req1` | The first request. |
|  | `req2` | The second request. |

