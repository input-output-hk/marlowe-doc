---
title: Marlowe chain indexer service
---

The `marlowe-chain-indexer` executable follows a local blockchain node and writes the blocks and transactions to a database.

```console
marlowe-chain-indexer: Chain indexer for the Marlowe Runtime.

Usage: marlowe-chain-indexer [--version] (-s|--socket-path SOCKET_FILE)
                             [-m|--testnet-magic INTEGER]
                             (-d|--database-uri DATABASE_URI)
                             --genesis-config-file-hash CONFIG_HASH
                             --genesis-config-file CONFIG_FILE
                             --shelley-genesis-config-file CONFIG_FILE
                             [--block-cost COST_UNITS] [--tx-cost COST_UNITS]
                             [--max-cost COST_UNITS] [--http-port PORT_NUMBER]

  The chain indexer for the Marlowe Runtime. This component connects to a local
  Cardano Node and follows the chain. It copies a subset of the information
  contained in every block to a postgresql database. This database can be queried
  by downstream components, such as marlowe-chain-sync.

  There should only be one instance of marlowe-chain-indexer writing data to a
  given chain database. There is no need to run multiple indexers. If you would
  like to scale runtime services, it is recommended to deploy a postgres replica
  cluster, run one indexer to populate it, and as many marlowe-chain-sync
  instances as required to read from it.

  Before running the indexer, the database must be created and migrated using
  sqitch. The migration plan and SQL scripts are included in the source code
  folder for marlowe-chain-indexer.

Available options:
  -h,--help                Show this help text
  --version                Show version.
  -s,--socket-path SOCKET_FILE
                           Location of the cardano-node socket file. Defaults to
                           the CARDANO_NODE_SOCKET_PATH environment variable.
  -m,--testnet-magic INTEGER
                           Testnet network ID magic. Defaults to the
                           CARDANO_TESTNET_MAGIC environment variable.
  -d,--database-uri DATABASE_URI
                           URI of the database where the chain information is
                           saved.
  --genesis-config-file-hash CONFIG_HASH
                           Hash of the Byron Genesis Config JSON file.
  --genesis-config-file CONFIG_FILE
                           Path to the Byron Genesis Config JSON File.
  --shelley-genesis-config-file CONFIG_FILE
                           Path to the Shelley Genesis Config JSON File.
  --block-cost COST_UNITS  The number of cost units to associate with persisting
                           a block when computing the cost model. (default: 1)
  --tx-cost COST_UNITS     The number of cost units to associate with persisting
                           a transaction when computing the cost model.
                           (default: 10)
  --max-cost COST_UNITS    The maximum number of cost units that can be batched
                           when persisting blocks. If the cost of the current
                           batch would exceed this value, the chain sync client
                           will wait until the current batch is persisted before
                           requesting another block. (default: 1000000)
  --http-port PORT_NUMBER  Port number to serve the http healthcheck API on
                           (default: 8080)
```
