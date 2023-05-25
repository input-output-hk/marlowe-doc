---
title: "Zero-Coupon Bond Using Marlowe's Command-Line Interface"
sidebar_position: 4
---

***Before running this notebook, you might want to use Jupyter's "clear output" function to erase the results of the previous execution of this notebook. That will make more apparent what has been executed in the current session.***

The zero-coupon bond example is a simple Marlowe contract where a lender provides principal to a borrower who repays it back with interest.

[A video works through this Jupyter notebook.](https://youtu.be/ELc72BKf7ec)

You can ask questions about Marlowe in [the #ask-marlowe channel on the IOG Discord](https://discord.com/channels/826816523368005654/936295815926927390) or post problems with this lesson to [the issues list for the Marlowe Starter Kit github repository](https://github.com/input-output-hk/marlowe-starter-kit/issues).

In this demonstration we use Marlowe\'s command-line interface, `marlowe-cli`, to run this contract on Cardano\'s `preprod` public testnet. Marlowe contracts may use either addresses or role tokens for authorization: here we use addresses.

In [Marlowe Playground](https://play.marlowe.iohk.io/), the contract looks like this in Blockly format.

![Zero-coupon bond Marlowe contract](/img/01-zcb-contract.png)

In Marlowe format it appears as
```
When
    [Case
        (Deposit
            (Address "$LENDER_ADDR")
            (Address "$LENDER_ADDR")
            (Token "" "")
            (ConstantParam "$PRINCIPAL")
        )
        (Pay
            (Address "$LENDER_ADDR")
            (Party (Address "$BORROWER_ADDR"))
            (Token "" "")
            (ConstantParam "$PRINCIPAL")
            (When
                [Case
                    (Deposit
                        (Address "$BORROWER_ADDR")
                        (Address "$BORROWER_ADDR")
                        (Token "" "")
                        (AddValue
                            (ConstantParam "$INTEREST")
                            (ConstantParam "$PRINCIPAL")
                        )
                    )
                    (Pay
                        (Address "$BORROWER_ADDR")
                        (Party (Address "$LENDER_ADDR"))
                        (Token "" "")
                        (AddValue
                            (ConstantParam "$INTEREST")
                            (ConstantParam "$PRINCIPAL")
                        )
                        Close 
                    )]
                (TimeParam "$BORROWER_DEADLINE")
                Close 
            )
        )]
    (TimeParam "$LENDER_DEADLINE")
    Close 
```

## Preliminaries

See [Preliminaries](preliminaries.md) for information on setting up one's environment for using this tutorial.

The lesson assumes that the following environment variables have been set.
- `CARDANO_NODE_SOCKET_PATH`: location of Cardano node's socket.
- `CARDANO_TESTNET_MAGIC`: testnet magic number.

It also assumes that the Lender and Borrower parties have addresses, signing keys, and funds.
- Lender
    - `keys/lender.address`: Cardano address for the lender
    - `keys/lender.skey`: location of signing key file for the lender
- Borrower
    - `keys/borrower.address`: Cardano address for the borrower
    - `keys/borrower.skey`: location of signing key file for the borrower

### Access to Cardano node and Marlowe Runtime

If we're using [demeter.run](https://demeter.run/)'s Cardano Marlowe Runtime extension, then we already have access to Cardano Node and Marlowe Runtime. The following commands will set the required environment variables to use a local docker deployment on the default ports. It will also set some supplementary environment variables.


```bash
if [[ -z "$CARDANO_NODE_SOCKET_PATH" ]]
then

  # Only required for `marlowe-cli` and `cardano-cli`.
  export CARDANO_NODE_SOCKET_PATH="$(docker volume inspect marlowe-starter-kit_shared | jq -r '.[0].Mountpoint')/node.socket"
  export CARDANO_TESTNET_MAGIC=1 # Note that preprod=1 and preview=2. Do not set this variable if using mainnet.

fi

# FIXME: This should have been inherited from the parent environment.
if [[ -z "$CARDANO_NODE_SOCKET_PATH" ]]
then
  export CARDANO_NODE_SOCKET_PATH=/ipc/node.socket
fi

# FIXME: This should have been set in the parent environment.
if [[ -z "$CARDANO_TESTNET_MAGIC" ]]
then
  export CARDANO_TESTNET_MAGIC=$CARDANO_NODE_MAGIC
fi

case "$CARDANO_TESTNET_MAGIC" in
  1)
    export "EXPLORER_URL=https://preprod.cardanoscan.io"
    ;;
  2)
    export "EXPLORER_URL=https://preview.cardanoscan.io"
    ;;
  *)
    # Use `mainnet` as the default.
    export "EXPLORER_URL=https://cardanoscan.io"
    ;;
esac

echo "CARDANO_NODE_SOCKET_PATH = $CARDANO_NODE_SOCKET_PATH"
echo "CARDANO_TESTNET_MAGIC = $CARDANO_TESTNET_MAGIC"
```

    CARDANO_NODE_SOCKET_PATH = ~/.local/share/containers/storage/volumes/marlowe-starter-kit_shared/_data/node.socket
    CARDANO_TESTNET_MAGIC = 1


Note the test network magic number:
- `preprod` = 1
- `preview` = 2

### Lender address and funds

Check that an address and key has been created for the lender. If not, see "Creating Addresses and Signing Keys" in [Preliminaries](preliminaries.md).


```bash
LENDER_SKEY=keys/lender.skey
LENDER_ADDR=$(cat keys/lender.address)
echo "LENDER_ADDR = $LENDER_ADDR"
```

    LENDER_ADDR = addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck


Check that the lender has at least one hundred ada.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$LENDER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    ffb18377900e003285f9cf357f96b1691eac3e32a89916e6c49a35bd9a11cdf2     1        1000000000 lovelace + TxOutDatumNone


One can view the address on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/address/"$LENDER_ADDR"
```

    https://preprod.cardanoscan.io/address/addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck


### Borrower address and funds

Check that an address and key has been created for the borrower. If not, see "Creating Addresses and Signing Keys" in [Preliminaries](preliminaries.md).


```bash
BORROWER_SKEY=keys/borrower.skey
BORROWER_ADDR=$(cat keys/borrower.address)
echo "BORROWER_ADDR = $BORROWER_ADDR"
```

    BORROWER_ADDR = addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d


Check that the borrower has at least one hundred ada.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$BORROWER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    ffb18377900e003285f9cf357f96b1691eac3e32a89916e6c49a35bd9a11cdf2     2        1000000000 lovelace + TxOutDatumNone


One can view the address on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/address/"$BORROWER_ADDR"
```

    https://preprod.cardanoscan.io/address/addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d


## Design the contract

The zero-coupon bond contract can be downloaded from the [Marlowe Playground](https://play.marlowe.iohk.io/) as a JSON file, or it can be generated using [Marlowe CLI](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-cli#readme) using the `marlowe-cli template` command.

Here we generate the contract using Marlowe CLI.

First, set the loan's principal to 80 ada and its interest to 5 ada.


```bash
ADA=1000000  # 1 ada = 1,000,000 lovelace

PRINCIPAL=$((80 * ADA))
INTEREST=$((5 * ADA))

echo "PRINCIPAL = $PRINCIPAL lovelace"
echo "INTEREST = $INTEREST lovelace"
```

    PRINCIPAL = 80000000 lovelace
    INTEREST = 5000000 lovelace


On the Cardano blockchain, the protocol parameters require that each UTxO contain at least some ada. Here we will start the contract with 2 ada.


```bash
MIN_LOVELACE="$((2 * ADA))"
echo "MIN_LOVELACE = $MIN_LOVELACE lovelace"
```

    MIN_LOVELACE = 2000000 lovelace


Next find the current time, measured in [POSIX milliseconds](https://en.wikipedia.org/wiki/Unix_time).


```bash
SECOND=1000 # 1 second = 1000 milliseconds
MINUTE=$((60 * SECOND)) # 1 minute = 60 seconds
HOUR=$((60 * MINUTE)) # 1 hour = 60 minutes

NOW="$((`date -u +%s` * SECOND))"
echo NOW = "$NOW" POSIX milliseconds = "`date -d @$((NOW / SECOND))`"
```

    NOW = 1679661079000 POSIX milliseconds = Fri Mar 24 06:31:19 AM MDT 2023


The contract has a lending deadline and a repayment deadline. For convenience in this example, set the deadlines to the near future.


```bash
LENDER_DEADLINE="$((NOW + 1 * HOUR))"
BORROWER_DEADLINE="$((NOW + 3 * HOUR))"
echo LENDER_DEADLINE = "$LENDER_DEADLINE" POSIX milliseconds = "`date -d @$((LENDER_DEADLINE / SECOND))`"
echo BORROWER_DEADLINE = "$BORROWER_DEADLINE" POSIX milliseconds = "`date -d @$((BORROWER_DEADLINE / SECOND))`"
```

    LENDER_DEADLINE = 1679664679000 POSIX milliseconds = Fri Mar 24 07:31:19 AM MDT 2023
    BORROWER_DEADLINE = 1679671879000 POSIX milliseconds = Fri Mar 24 09:31:19 AM MDT 2023


Now create the JSON file for the contract, `zcb-contract.json`.


```bash
marlowe-cli template zcb \
  --minimum-ada "$MIN_LOVELACE" \
  --lender "$LENDER_ADDR" \
  --borrower "$BORROWER_ADDR" \
  --principal "$PRINCIPAL" \
  --interest "$INTEREST" \
  --lending-deadline "$LENDER_DEADLINE" \
  --repayment-deadline "$BORROWER_DEADLINE" \
  --out-contract-file zcb-contract.json \
  --out-state-file zcb-state.json
```

The various command-line options are described by the help system.


```bash
marlowe-cli template zcb --help
```

    Usage: marlowe-cli template zcb --minimum-ada INTEGER --lender PARTY
                                    --borrower PARTY --principal INTEGER
                                    --interest INTEGER --lending-deadline TIMEOUT
                                    --repayment-deadline TIMEOUT
    
      Create a zero-coupon bond.
    
    Available options:
      --minimum-ada INTEGER    Lovelace that the lender contributes to the initial
                               state.
      --lender PARTY           The lender.
      --borrower PARTY         The borrower.
      --principal INTEGER      The principal, in lovelace.
      --interest INTEGER       The interest, in lovelace.
      --lending-deadline TIMEOUT
                               The lending deadline. POSIX milliseconds or duration:
                               `INTEGER[s|m|d|w|h]`.
      --repayment-deadline TIMEOUT
                               The repayment deadline. POSIX milliseconds or
                               duration: `INTEGER[s|m|d|w|h]`.
      -h,--help                Show this help text


## Examine the contract

View the contract file as YAML.


```bash
json2yaml zcb-contract.json
```

    timeout: 1679664679000
    timeout_continuation: close
    when:
    - case:
        deposits: 80000000
        into_account:
          address: addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck
        of_token:
          currency_symbol: ''
          token_name: ''
        party:
          address: addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck
      then:
        from_account:
          address: addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck
        pay: 80000000
        then:
          timeout: 1679671879000
          timeout_continuation: close
          when:
          - case:
              deposits:
                add: 80000000
                and: 5000000
              into_account:
                address: addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d
              of_token:
                currency_symbol: ''
                token_name: ''
              party:
                address: addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d
            then:
              from_account:
                address: addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d
              pay:
                add: 80000000
                and: 5000000
              then: close
              to:
                party:
                  address: addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck
              token:
                currency_symbol: ''
                token_name: ''
        to:
          party:
            address: addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d
        token:
          currency_symbol: ''
          token_name: ''


### \[Optional, but recommended\] Check the safety of the contract

If we were running the contract on the Cardano `mainnet`, then we\'d want to check its safety before creating it, so that there is no chance that we might lose funds.

Here are the steps for checking the safety of a contract:

1. Understand the [Marlowe Language](https://marlowe-finance.io/).
2. Understand Cardano\'s [Extended UTxO Model](https://docs.cardano.org/learn/eutxo-explainer).
3. Read and understand the [Marlowe Best Practices Guide](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/best-practices.md).
4. Read and understand the [Marlowe Security Guide](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/security.md).
5. Use [Marlowe Playground](https://play.marlowe.iohk.io/) to flag warnings, perform static analysis, and simulate the contract.
6. Use [Marlowe CLI\'s](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/ReadMe.md) `marlowe-cli run analyze` tool to study whether the contract can run on a Cardano network.
7. Run *all execution paths* of the contract on a [Cardano testnet](https://docs.cardano.org/cardano-testnet/overview).

See [Lesson 1](runtime-cli.md) for an example of performing step 6.

## Transaction 1. Create the Contract

Marlowe CLI\'s command `marlowe-cli run initialize` will build the creation information for a Marlowe contract. We provide it the JSON files containing the contract and initial state. Anyone could create the contract, but in this example the lender will be doing so, so we provide their address to fund the transaction and to receive the change from it.


```bash
marlowe-cli run initialize --help
```

    Usage: marlowe-cli run initialize [--testnet-magic INTEGER] 
                                      [--socket-path SOCKET_FILE] 
                                      [--stake-address ADDRESS] 
                                      [--roles-currency CURRENCY_SYMBOL]
                                      --contract-file CONTRACT_FILE
                                      --state-file STATE_FILE 
                                      [--at-address ADDRESS | 
                                        --permanently STAKING_ADDRESS | 
                                        --permanently-without-staking] 
                                      [--out-file OUTPUT_FILE] [--merkleize] 
                                      [--print-stats]
    
      Initialize the first transaction of a Marlowe contract and write output to a
      JSON file.
    
    Available options:
      --testnet-magic INTEGER  Network magic. Defaults to the CARDANO_TESTNET_MAGIC
                               environment variable's value.
      --socket-path SOCKET_FILE
                               Location of the cardano-node socket file. Defaults to
                               the CARDANO_NODE_SOCKET_PATH environment variable's
                               value.
      --stake-address ADDRESS  Stake address, if any.
      --roles-currency CURRENCY_SYMBOL
                               The currency symbol for roles, if any.
      --contract-file CONTRACT_FILE
                               JSON input file for the contract.
      --state-file STATE_FILE  JSON input file for the contract state.
      --at-address ADDRESS     Publish script at a given address. This is a default
                               strategy which uses change address as a destination.
      --permanently STAKING_ADDRESS
                               Publish permanently at unspendable script address
                               staking the min. ADA value.
      --permanently-without-staking
                               Publish permanently at unspendable script address
                               without min. ADA staking.
      --out-file OUTPUT_FILE   JSON output file for initialize.
      --merkleize              Whether to deeply merkleize the contract.
      --print-stats            Print statistics.
      -h,--help                Show this help text



```bash
marlowe-cli run initialize \
  --permanently-without-staking \
  --contract-file zcb-contract.json \
  --state-file zcb-state.json \
  --out-file marlowe-1.json
```

We now use Marlowe CLI\'s `marlowe-cli run auto-execute` command to construct and submit the creation transaction.


```bash
marlowe-cli run auto-execute --help
```

    Usage: marlowe-cli run auto-execute 
             [--testnet-magic INTEGER] [--socket-path SOCKET_FILE] 
             [--marlowe-in-file MARLOWE_FILE --tx-in-marlowe TXID#TXIX]
             --marlowe-out-file MARLOWE_FILE --change-address ADDRESS
             (--required-signer SIGNING_FILE) [--metadata-file METADATA_FILE]
             --out-file FILE [--submit SECONDS] [--print-stats] [--script-invalid]
    
      [EXPERIMENTAL] Run a Marlowe transaction, selecting transaction inputs and
      outputs automatically.
    
    Available options:
      --testnet-magic INTEGER  Network magic. Defaults to the CARDANO_TESTNET_MAGIC
                               environment variable's value.
      --socket-path SOCKET_FILE
                               Location of the cardano-node socket file. Defaults to
                               the CARDANO_NODE_SOCKET_PATH environment variable's
                               value.
      --marlowe-in-file MARLOWE_FILE
                               JSON file with the Marlowe initial state and initial
                               contract, if any.
      --tx-in-marlowe TXID#TXIX
                               UTxO spent from Marlowe contract, if any.
      --marlowe-out-file MARLOWE_FILE
                               JSON file with the Marlowe inputs, final state, and
                               final contract.
      --change-address ADDRESS Address to receive ADA in excess of fee.
      --required-signer SIGNING_FILE
                               File containing a required signing key.
      --metadata-file METADATA_FILE
                               JSON file containing metadata.
      --out-file FILE          Output file for transaction body.
      --submit SECONDS         Also submit the transaction, and wait for
                               confirmation.
      --print-stats            Print statistics.
      --script-invalid         Assert that the transaction is invalid.
      -h,--help                Show this help text



```bash
TX_1=$(
marlowe-cli run auto-execute \
  --marlowe-out-file marlowe-1.json \
  --change-address "$LENDER_ADDR" \
  --required-signer "$LENDER_SKEY" \
  --out-file tx-1.signed \
  --submit 600 \
  --print-stats \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_1 = $TX_1"
```

    
    Fee: Lovelace 212185
    Size: 941 / 16384 = 5%
    Execution units:
      Memory: 0 / 14000000 = 0%
      Steps: 0 / 10000000000 = 0%
    TX_1 = f36feb37473ec171d9a79553b9a7f729b78076e97be20f54aaca88094a1752d5


One can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_1?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/f36feb37473ec171d9a79553b9a7f729b78076e97be20f54aaca88094a1752d5?tab=utxo


One can also examine the contract's UTxO using `cardano-cli`.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --tx-in "$TX_1#1"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    f36feb37473ec171d9a79553b9a7f729b78076e97be20f54aaca88094a1752d5     1        2000000 lovelace + TxOutDatumHash ScriptDataInBabbageEra "c4bf1737c9a1f88ae66c9d00d66d54d201c2c932ab13767889758ba28c8f5f19"


## Transaction 2. The lender deposits the principal

The lender deposits their 80 ada of principal into the contract using Marlowe CLI\'s `marlowe-cli run prepare` command. The lender is providing the funding for and receiving the change from this transaction, so we provide their address.


```bash
marlowe-cli run prepare --help
```

    Usage: marlowe-cli run prepare --marlowe-file MARLOWE_FILE 
                                   [--deposit-account PARTY --deposit-party PARTY 
                                     [--deposit-token TOKEN]
                                     --deposit-amount INTEGER |
                                     --choice-name NAME --choice-party PARTY
                                     --choice-number INTEGER |
                                     --notify] --invalid-before POSIX_TIME
                                   --invalid-hereafter POSIX_TIME 
                                   [--out-file OUTPUT_FILE] [--print-stats]
    
      Prepare the next step of a Marlowe contract and write the output to a JSON
      file.
    
    Available options:
      --marlowe-file MARLOWE_FILE
                               JSON input file for the Marlowe state and contract.
      --deposit-account PARTY  The account for the deposit.
      --deposit-party PARTY    The party making the deposit.
      --deposit-token TOKEN    The token being deposited, if not Ada.
      --deposit-amount INTEGER The amount of token being deposited.
      --choice-name NAME       The name of the choice made.
      --choice-party PARTY     The party making the choice.
      --choice-number INTEGER  The number chosen.
      --notify                 Notify the contract.
      --invalid-before POSIX_TIME
                               Minimum time for the input, in POSIX milliseconds.
      --invalid-hereafter POSIX_TIME
                               Maximum time for the input, in POSIX milliseconds.
      --out-file OUTPUT_FILE   JSON output file for contract.
      --print-stats            Print statistics.
      -h,--help                Show this help text



```bash
marlowe-cli run prepare \
  --deposit-account "$LENDER_ADDR" \
  --deposit-party "$LENDER_ADDR" \
  --deposit-amount "$PRINCIPAL" \
  --invalid-before "$((`date -u +%s` * SECOND - 1 * MINUTE))" \
  --invalid-hereafter "$((`date -u +%s` * SECOND + 5 * MINUTE))" \
  --marlowe-file marlowe-1.json \
  --out-file marlowe-2.json
```

    Rounding  `TransactionInput` txInterval boundries to:(POSIXTime {getPOSIXTime = 1679661371000},POSIXTime {getPOSIXTime = 1679661731999})
    TransactionInput {txInterval = (POSIXTime {getPOSIXTime = 1679661371000},POSIXTime {getPOSIXTime = 1679661731999}), txInputs = [NormalInput (IDeposit "\"addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck\"" "\"addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck\"" (Token "" "") 80000000)]}
    Payment 1
      Acccount: "\"addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck\""
      Payee: Party "\"addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d\""
      Ada: Lovelace {getLovelace = 80000000}


Once again, use `marlowe-cli run auto-execute` to build and submit the transaction and then wait for confirmation.


```bash
TX_2=$(
marlowe-cli run auto-execute \
  --tx-in-marlowe "$TX_1#1" \
  --marlowe-in-file marlowe-1.json \
  --marlowe-out-file marlowe-2.json \
  --change-address "$LENDER_ADDR" \
  --required-signer "$LENDER_SKEY" \
  --out-file tx-2.signed \
  --submit 600 \
  --print-stats \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_2 = $TX_2"
```

    
    Fee: Lovelace 758511
    Size: 1570 / 16384 = 9%
    Execution units:
      Memory: 6730260 / 14000000 = 48%
      Steps: 1806177146 / 10000000000 = 18%
    TX_2 = 017c068bf76aba6ef57b6b5aab592cd9d861c4903e100794ca7451d16c701a02


One can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_2?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/017c068bf76aba6ef57b6b5aab592cd9d861c4903e100794ca7451d16c701a02?tab=utxo


One can see that the lender has 82 ada less than originally. Two ada were deposited in the contract when it was created and 80 ada were paid to the borrower in the second transaction.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$LENDER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    017c068bf76aba6ef57b6b5aab592cd9d861c4903e100794ca7451d16c701a02     0        917029304 lovelace + TxOutDatumNone


The borrower has an additional 80 ada (the loan's principal) now.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$BORROWER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    017c068bf76aba6ef57b6b5aab592cd9d861c4903e100794ca7451d16c701a02     2        80000000 lovelace + TxOutDatumNone
    ffb18377900e003285f9cf357f96b1691eac3e32a89916e6c49a35bd9a11cdf2     2        1000000000 lovelace + TxOutDatumNone


The Marlowe contract still has the 2 ada from its creation.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --tx-in "$TX_2#1"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    017c068bf76aba6ef57b6b5aab592cd9d861c4903e100794ca7451d16c701a02     1        2000000 lovelace + TxOutDatumHash ScriptDataInBabbageEra "49f4b85150d30d1b9a1cd06dacf45dbabcf0719a34f5286a03c7c52760880c2e"


## Transaction 3. The borrower repays the loan

After some time passes, the borrower repays principal plus interest. Thus, they fund the transaction and receive the change at their address.


```bash
marlowe-cli run prepare \
  --deposit-account "$BORROWER_ADDR" \
  --deposit-party "$BORROWER_ADDR" \
  --deposit-amount "$((PRINCIPAL+INTEREST))" \
  --invalid-before "$((`date -u +%s` * SECOND - 1 * MINUTE))" \
  --invalid-hereafter "$((`date -u +%s` * SECOND + 5 * MINUTE))" \
  --marlowe-file marlowe-2.json \
  --out-file marlowe-3.json
```

    Rounding  `TransactionInput` txInterval boundries to:(POSIXTime {getPOSIXTime = 1679661602000},POSIXTime {getPOSIXTime = 1679661962999})
    TransactionInput {txInterval = (POSIXTime {getPOSIXTime = 1679661602000},POSIXTime {getPOSIXTime = 1679661962999}), txInputs = [NormalInput (IDeposit "\"addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d\"" "\"addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d\"" (Token "" "") 85000000)]}
    Payment 1
      Acccount: "\"addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d\""
      Payee: Party "\"addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck\""
      Ada: Lovelace {getLovelace = 85000000}
    Payment 2
      Acccount: "\"addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck\""
      Payee: Party "\"addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck\""
      Ada: Lovelace {getLovelace = 2000000}


Once again, use `marlowe-cli run auto-execute` to build and submit the transaction and then wait for confirmation.


```bash
TX_3=$(
marlowe-cli run auto-execute \
  --tx-in-marlowe "$TX_2#1" \
  --marlowe-in-file marlowe-2.json \
  --marlowe-out-file marlowe-3.json \
  --change-address "$BORROWER_ADDR" \
  --required-signer "$BORROWER_SKEY" \
  --out-file tx-3.signed \
  --submit 600 \
  --print-stats \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_3 = $TX_3"
```

    
    Fee: Lovelace 569736
    Size: 827 / 16384 = 5%
    Execution units:
      Memory: 4674622 / 14000000 = 33%
      Steps: 1258378941 / 10000000000 = 12%
    TX_3 = b2486f82eaccef641a3b44de4c07146304238b25b0678ab1bfb70e3bc244c338


One can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_3?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/b2486f82eaccef641a3b44de4c07146304238b25b0678ab1bfb70e3bc244c338?tab=utxo


One can see that the lender received back the 80 ada of principal and the 2 ada deposited when the contract was created, along with the additional 5 ada of interest, totalling 87 ada.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$LENDER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    017c068bf76aba6ef57b6b5aab592cd9d861c4903e100794ca7451d16c701a02     0        917029304 lovelace + TxOutDatumNone
    b2486f82eaccef641a3b44de4c07146304238b25b0678ab1bfb70e3bc244c338     1        87000000 lovelace + TxOutDatumNone


The borrower now has about 5 ada (the loan's interest) less than originally.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$BORROWER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    017c068bf76aba6ef57b6b5aab592cd9d861c4903e100794ca7451d16c701a02     2        80000000 lovelace + TxOutDatumNone
    b2486f82eaccef641a3b44de4c07146304238b25b0678ab1bfb70e3bc244c338     0        914430264 lovelace + TxOutDatumNone


The Marlowe contract has closed, so there is no output to its script address.
