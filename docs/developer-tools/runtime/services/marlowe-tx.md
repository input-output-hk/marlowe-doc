---
title: Marlowe transaction service
---

The `marlowe-tx` executable provides services related to building and submitting transactions for Marlowe contracts.

```console
marlowe-tx: Transaction creation server for the Marlowe Runtime.

Usage: marlowe-tx [--version] [--chain-sync-port PORT_NUMBER] 
                  [--chain-sync-query-port PORT_NUMBER] 
                  [--chain-sync-command-port PORT_NUMBER] 
                  [--chain-sync-host HOST_NAME] 
                  [--contract-query-port PORT_NUMBER] 
                  [--contract-host HOST_NAME] [--command-port PORT_NUMBER] 
                  [-h|--host HOST_NAME] [--submit-confirmation-blocks INTEGER] 
                  [--analysis-timeout SECONDS] [--http-port PORT_NUMBER]
                  --minting-policy-cmd CMD

  The transaction creation engine for the Marlowe Runtime. This component exposes
  a job protocol with four commands: create, apply inputs, withdraw, and submit.

  Create Command

  The create command will create an unsigned transaction body that starts a new Marlowe
  contract. The options that can be configured for this command are:

    • Adding a staking credential to the Marlowe script address for the contract.
    • What addresses can be used for coin selection.
    • Which address to send change to.
    • Rules for role tokens in the contract. Includes rules for minting and distributing
      role tokens in the creation transaction and rules for using existing role tokens.
    • Adding metadata to the transaction.
    • The amount that should be deposited in the contract to cover min UTxO rules
      (can be omitted and the runtime will compute a worst-case value automatically.
    • The initial contract or the hash of a contract in the contract store to use as the
      initial contract.

  Apply Inputs Command

  The apply inputs command will create an unsigned transaction body that advances a
  Marlowe contract by applying transaction inputs to it. The options that can be
  configured for this command are:

    • What addresses can be used for coin selection.
    • Which address to send change to.
    • Adding metadata to the transaction.
    • The transaction's validity interval. If omitted, the runtime will compute default
      values from the current contract and the most recent block's slot number.
    • The initial contract or the hash of a contract in the contract store to use as the
      initial contract.

  Withdraw Command

  The withdraw command will create an unsigned transaction body that withdraws role payouts
  from Marlowe contracts from the role payout validators that hold them. When a contract
  makes a payment to a role, it is not sent directly to the holder of the role token. Instead,
  it is sent to an auxiliary Plutus script called a payout validator. The holder of the matching
  role token is then able to spend this script output to withdraw the payout, sending it to an
  address of their choice. That is what withdrawal means in this context. The options that can be
  configured for this command are:

    • What addresses can be used for coin selection.
    • Which address to send change to.
    • Which payout outputs to withdraw.

  Submit Command

  The submit command will submit a signed transaction to a Cardano node via a marlowe-chain-sync
  instance. It waits until the transaction is confirmed and found in a block by marlowe-chain-sync.
  The options that can be configured for this command are:

    • The era of the transaction (babbage or conway)
    • The transaction to submit.

  Dependencies

  marlowe-tx depends on a marlowe-chain-sync instance at various points. First, it runs a
  chain seek client for the lifetime of the service to keep track of what the current tip
  of the blockchain is. Second, it connects via both chain seek and chain query to fetch
  current information about the UTxO for wallets and Marlowe contracts needed to create
  transactions.

  marlowe-tx also depends on a marlowe-contract instance both to create contracts and
  apply inputs to merkleized contracts. For creation, it queries the store for the initial
  contract if a contract hash was provided in the creation command. It also fetches the
  closure of contract continuations from the store to analyze the contract for safety issues.
  Finally, it queries contract hashes found in merkleized cases to build merkleized inputs
  automatically while executing an apply inputs command.

  Scaling

  marlowe-tx is designed to scale horizontally. That is to say, multiple instances can run
  in parallel to scale with demand. A typical setup for this would involve running multiple
  marlowe-tx instances in front of a load balancer.

Available options:
  -h,--help                Show this help text
  --version                Show version.
  --chain-sync-port PORT_NUMBER
                           The port number of the chain sync server.
                           (default: 3715)
  --chain-sync-query-port PORT_NUMBER
                           The port number of the chain sync query server.
                           (default: 3716)
  --chain-sync-command-port PORT_NUMBER
                           The port number of the chain sync job server.
                           (default: 3720)
  --chain-sync-host HOST_NAME
                           The host name of the chain sync server.
                           (default: "127.0.0.1")
  --contract-query-port PORT_NUMBER
                           The port number of the contract query server.
                           (default: 3728)
  --contract-host HOST_NAME
                           The host name of the contract server.
                           (default: "127.0.0.1")
  --command-port PORT_NUMBER
                           The port number to run the job server on.
                           (default: 3723)
  -h,--host HOST_NAME      The host name to run the tx server on.
                           (default: "127.0.0.1")
  --submit-confirmation-blocks INTEGER
                           The number of blocks after a transaction has been
                           confirmed to wait before displaying the block in
                           which was confirmed.
                           (default: BlockNo {unBlockNo = 0})
  --analysis-timeout SECONDS
                           The amount of time allotted for safety analysis of a
                           contract. (default: 15s)
  --http-port PORT_NUMBER  Port number to serve the http healthcheck API on
                           (default: 8080)
  --minting-policy-cmd CMD A command which creates the role token minting policy
                           for a contract. It should read the arguments via the
                           command line and output the serialized script binary
                           to stdout.
```
