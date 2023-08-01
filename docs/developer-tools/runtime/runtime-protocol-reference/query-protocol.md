---
title: Generic query protocol
sidebar_position: 9
---

The Query protocol is defined here: 

- **[https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-protocols/src/Language/Network/Protocol/Query/Types.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-protocols/src/Language/Network/Protocol/Query/Types.hs)**

The `Query` protocol allows clients to send queries to a server. It is
parameterized by the type of query that the server supports.

### Protocol states

| Protocol state | Agency | Parameter | Description |
| --- | --- | --- | --- |
| 1. `Req` | `Client` | | The client is preparing a request to send. |
| 2. `Res a` | `Server` | | The server handling a request from the client. |
| | | `a` | The type of the response. |
| 3. `Done` | `Nobody` | | The terminal state. |

### Query Protocol messages

| Message | Begin state | End state | Parameter | Description |
| --- | --- | --- | --- | --- |
| 1. `Request req` | `Req` | `Res a` |  | Sends a request to the server. |
| | | | `req` | A request tree with a result of type `a`. |
| 2. `Respond a` | `Res a` | `Req` |  | Sends a response to the client. |
| | | | `a` | The response type. |
| 3. `Done` | `Req` | `Done` |  | Terminates the session. |

### Request trees

The `RequestTree` structure allows multiple requests of a given request type to
be sent in parallel, and combines the associated response types for those
requests. For a request type `req`, the following request tree types are
supported:

| Request | Parameter | Result | Description |
| --- | --- | --- | --- |
| `Leaf req` |  | `a` | A single request at the leaf of the tree with result type `a`. |
|  | `req` |  | A request with result type `a`. |
| `Bin tree1 tree2` |  | `(a, b)` | Two request sub-trees with a combined result type `(a, b)`. |
|  | `tree1` |  | A request tree with result type `a`. |
|  | `tree2` |  | A request tree with result type `b`. |
