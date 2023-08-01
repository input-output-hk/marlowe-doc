---
title: Query the runtime
sidebar_position: 12
---

## Query the contract store

```console
Usage: marlowe-runtime-cli query store COMMAND

  Query the contract store

Available options:
  -h,--help                Show this help text

Available commands:
  contract                 Query the (merkleized) source of a contract in the
                           contract store
  closure                  Query the deep dependency closure of a contract in
                           the store.
  adjacency                Query the immediate dependencies of a contract in the
                           store.
```

### Query a contract from the contract store

```console
Usage: marlowe-runtime-cli query store contract CONTRACT_HASH

  Query the (merkleized) source of a contract in the contract store

Available options:
  CONTRACT_HASH            The hash of the contract to query in the store.
  -h,--help                Show this help text
```

### Query the closure of a contract from the contract store

```console
Usage: marlowe-runtime-cli query store closure CONTRACT_HASH

  Query the deep dependency closure of a contract in the store.

Available options:
  CONTRACT_HASH            The hash of the contract to query in the store.
  -h,--help                Show this help text
```

### Query the immediate dependencies of a contract from the contract store

```console
Usage: marlowe-runtime-cli query store adjacency CONTRACT_HASH

  Query the immediate dependencies of a contract in the store.

Available options:
  CONTRACT_HASH            The hash of the contract to query in the store.
  -h,--help                Show this help text
```
