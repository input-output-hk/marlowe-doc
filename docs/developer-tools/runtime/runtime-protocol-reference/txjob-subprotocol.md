---
title: TxJob sub-protocol
sidebar_position: 5
---

The TxJob protocol is defined in two places. It is an instance of the generic job protocol, which is a protocol that allows jobs to be run and their progress to be monitored. It is parameterized by the set of commands it supports. `marlowe-tx` has a set of commands called `MarloweTxCommand`.

The TxJob sub-protocol is defined here:

- **[marlowe-runtime/tx-api/Language/Marlowe/Runtime/Transaction/Api.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/tx-api/Language/Marlowe/Runtime/Transaction/Api.hs)**

  - The `MarloweTxCommand` type describes the available commands for marlowe-tx.

It is also defined in **[`marlowe-protocols/src/Network/Protocol/Job/Types.hs`](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-protocols/src/Network/Protocol/Job/Types.hs)**

- Defines the generic job protocol (command agnostic).

:::note

The TxJob sub-protocol is intended for developers using Haskell. If you are interested in working with the protocol with a binary approach using a different language, reach out to us and let us know. We can discuss possibilities with you.

:::

### Sub-protocol states

| Protocol state             | Agency   | Parameter | Description                                                                            |
| -------------------------- | -------- | --------- | -------------------------------------------------------------------------------------- |
| 1. `Init`                  | `Client` |           | The initial state.                                                                     |
| 2. `Cmd status err res`    | `Server` |           | The server has received a command and is preparing a job status update for the client. |
|                            |          | `status`  | The type of progress the job reports in status updates.                                |
|                            |          | `err`     | The type of errors the job can fail with.                                              |
|                            |          | `res`     | The result type of the job when it completes successfully.                             |
| 3. `Attach status err res` | `Server` |           | The server is processing a request to attach to an already running job.                |
|                            |          | `status`  | The type of progress the job reports in status updates.                                |
|                            |          | `err`     | The type of errors the job can fail with.                                              |
|                            |          | `res`     | The result type of the job when it completes successfully.                             |
| 4. `Await status err res`  | `Client` |           | The client is waiting for the job to complete.                                         |
|                            |          | `status`  | The type of progress the job reports in status updates.                                |
|                            |          | `err`     | The type of errors the job can fail with.                                              |
|                            |          | `res`     | The result type of the job when it completes successfully.                             |
| 5. `Done`                  | `Nobody` |           | The terminal state.                                                                    |

### Job sub-protocol messages

| Message              | Begin state             | End state               | Parameter | Description                                                                                        |
| -------------------- | ----------------------- | ----------------------- | --------- | -------------------------------------------------------------------------------------------------- |
| 1. `Exec cmd`        | `Init`                  | `Cmd status err res`    |           | Requests the server to execute a command.                                                          |
|                      |                         |                         | `cmd`     | A command with status type `status`, error type `err`, and result type `res`                       |
| 2. `Attach id`       | `Init`                  | `Attach status err res` |           | Requests to attach to running job by its ID.                                                       |
|                      |                         |                         | `id`      | The ID of the job to attach to, with status type `status`, error type `err`, and result type `res` |
| 3. `Attached`        | `Attach status err res` | `Cmd status err res`    |           | The server has found the requested job and has attached the client to it.                          |
| 4. `AttachFailed`    | `Attach status err res` | `Done`                  |           | The server could not find the requested job or is refusing to attach the client to it.             |
| 5. `Fail err`        | `Cmd status err res`    | `Done`                  |           | The job has failed.                                                                                |
|                      |                         |                         | `err`     | The error that caused the job to fail.                                                             |
| 6. `Succeed res`     | `Cmd status err res`    | `Done`                  |           | The job has completed successfully.                                                                |
|                      |                         |                         | `res`     | The result of the job.                                                                             |
| 7. `Await status id` | `Cmd status err res`    | `Await status err res`  |           | The job is not complete and the server is providing a status update to the client.                 |
|                      |                         |                         | `status`  | The progress of the job.                                                                           |
|                      |                         |                         | `id`      | The ID of the job so the client can attach to it later if it wants to.                             |
| 8. `Poll`            | `Await status err res`  | `Cmd status err res`    |           | Requests a status update from the server.                                                          |
| 9. `Detach`          | `Await status err res`  | `Done`                  |           | Detaches from the job and terminates the session.                                                  |

### `MarloweTxCommand` commands

:::note

The first three commands have no status type (technically their status type is the uninhabited type `Void`). This means that a client will never be told to wait for a response; they will receive either a `Fail` or a `Success`. It also means that these commands have no job IDs, and hence cannot be attached to.

:::

For more details on the types mentioned, please see:

- **[marlowe-runtime/tx-api/Language/Marlowe/Runtime/Transaction/Api.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/tx-api/Language/Marlowe/Runtime/Transaction/Api.hs)**

| Command          | Status         | Error              | Result            | Parameter          | Description                                                                                                                                                          |
| ---------------- | -------------- | ------------------ | ----------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. `Create`      | none           | `CreateError`      | `ContractCreated` |                    | Builds a transaction that starts a new Marlowe contract.                                                                                                             |
|                  |                |                    |                   | `stakeCredential`  | An optional stake credential to attach to the script address for this contract.                                                                                      |
|                  |                |                    |                   | `v`                | The version of the contract.                                                                                                                                         |
|                  |                |                    |                   | `wallet`           | A `WalletAddresses` record of the wallet authorizing the transaction.                                                                                                |
|                  |                |                    |                   | `threadName`       | [Optional] The role name for the contract's thread token, if it uses open roles.                                                                                     |
|                  |                |                    |                   | `roles`            | A `RoleTokensConfig` that describes how role tokens are to be minted and distributed in this contract.                                                               |
|                  |                |                    |                   | `metadata`         | A `MarloweTransactionMetadata` record to attach to the transaction's metadata.                                                                                       |
|                  |                |                    |                   | `minAdaDeposit`    | [Optional] The **[min ada deposit for the contract](https://docs.marlowe.iohk.io/docs/platform-and-architecture/marlowe-language-guide#minimum-ada-requirements-minutxo)**.                                                                                     |
|                  |                |                    |                   | `contract`         | The Marlowe contract to run.                                                                                                                                         |
| 2. `ApplyInputs` | none           | `ApplyInputsError` | `InputsApplied`   |                    | Builds a transaction that applies inputs to a running Marlowe contract.                                                                                              |
|                  |                |                    |                   | `v`                | The version of the contract.                                                                                                                                         |
|                  |                |                    |                   | `wallet`           | A `WalletAddresses` record of the wallet authorizing the transaction.                                                                                                |
|                  |                |                    |                   | `contractID`       | The ID of the contract to apply the inputs to.                                                                                                                       |
|                  |                |                    |                   | `metadata`         | A `MarloweTransactionMetadata` record to attach to the transaction's metadata.                                                                                       |
|                  |                |                    |                   | `invalidBefore`    | An optional date + time in UTC before when the transaction is invalid. If omitted, the server will compute a sensible default.                                       |
|                  |                |                    |                   | `invalidHereafter` | An optional date + time in UTC that describes the point when the transaction is no longer valid (inclusive). If omitted, the server will compute a sensible default. |
|                  |                |                    |                   | `inputs`           | A list of inputs to apply to the contract.                                                                                                                           |
| 3. `Withdraw`    | none           | `WithdrawError`    | `WithdrawTx`      |                    | Builds a transaction that withdraws role payouts.                                                                                                                    |
|                  |                |                    |                   | `v`                | The version of the contract.                                                                                                                                         |
|                  |                |                    |                   | `wallet`           | A `WalletAddresses` record of the wallet authorizing the transaction. Funds will be sent to the change address.                                                      |
|                  |                |                    |                   | `payouts`          | The IDs of the payouts to withdraw.                                                                                                                                  |
| 4. `Submit`      | `SubmitStatus` | `SubmitError`      | `BlockHeader`     |                    | Submits a transaction to the upstream node and waits for confirmation.                                                                                               |
|                  |                |                    |                   | `tx`               | A transaction to submit to the upstream node.                                                                                                                        |
