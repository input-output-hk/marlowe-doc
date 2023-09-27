---
title: MarloweQuery sub-protocol
sidebar_position: 4
---

The MarloweQuery sub-protocol is defined here:

- **[https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/sync-api/Language/Marlowe/Protocol/Query/Types.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/sync-api/Language/Marlowe/Protocol/Query/Types.hs)**

The `MarloweSyncRequest` type is a set of requests for use with the
**[generic query protocol](query-protocol.md)** that allows clients to query
the current state of on-chain Marlowe contracts.

### Request types

The following requests are supported:

| Request                        | Parameter | Description                                                                                                                                  |
| ------------------------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `Status`                       |           | Returns status information about the runtime, including node, chain indexer and marlowe indexer tip blocks, network ID, and runtime version. |
| `ContractHeaders filter range` |           | Returns a page of contract headers, or nothing if the range specified an invalid starting point.                                             |
|                                | `filter`  | A list of tags, a list of role token currencies, and a list of parties to limit the results.                                                 |
|                                | `range`   | The ID of the contract to start from, offset, size, and sort direction that describes the page to fetch.                                     |
| `ContractState id`             |           | Returns the current state of a contract by its ID.                                                                                           |
|                                | `id`      | The ID of the contract.                                                                                                                      |
| `Transactions id`              |           | Returns the apply inputs transaction of a contract by its ID.                                                                                |
|                                | `id`      | The ID of the contract.                                                                                                                      |
| `Transaction id`               |           | Returns an apply inputs transaction by its ID.                                                                                               |
|                                | `id`      | The ID of the transaction.                                                                                                                   |
| `Withdrawals filter range`     |           | Returns a page of withdrawal transactions, or nothing if the range specified an invalid starting point.                                      |
|                                | `filter`  | A list of role token currencies to limit the results.                                                                                        |
|                                | `range`   | The ID of the withdrawal to start from, offset, size, and sort direction that describes the page to fetch.                                   |
| `Withdrawal id`                |           | Returns a withdraw transaction by its ID.                                                                                                    |
|                                | `id`      | The ID of the withdraw transaction.                                                                                                          |
| `PayoutHeaders filter range`   |           | Returns a page of role payout headers, or nothing if the range specified an invalid starting point.                                          |
|                                | `filter`  | A list of contract IDs, a list of role tokens, and an optional status (withdrawn or available) to limit the results.                         |
|                                | `range`   | The ID of the payout to start from, offset, size, and sort direction that describes the page to fetch.                                       |
| `Payout id`                    |           | Returns a role payout transaction output by its ID.                                                                                          |
|                                | `id`      | The ID of the role payout transaction output.                                                                                                |
