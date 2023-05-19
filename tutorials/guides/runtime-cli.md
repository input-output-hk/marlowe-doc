---
title: "Zero-Coupon Bond Using Marlowe Runtime's Command-Line Interface"
sidebar_position: 2
---

***Before running this notebook, you might want to use Jupyter's "clear output" function to erase the results of the previous execution of this notebook. That will make more apparent what has been executed in the current session.***

The zero-coupon bond example is a simple Marlowe contract where a lender provides principal to a borrower who repays it back with interest.

In this demonsration we use Marlowe Runtime\'s command-line interface, `marlowe-runtime-cli`, to run this contract on Cardano\'s `preprod` public testnet. Marlowe contracts may use either addresses or role tokens for authorization: here we use addresses.

[A video works through this Jupyter notebook.](https://youtu.be/pjDtuD5rimI)

You can ask questions about Marlowe in [the #ask-marlowe channel on the IOG Discord](https://discord.com/channels/826816523368005654/936295815926927390) or post problems with this lesson to [the issues list for the Marlowe Starter Kit github repository](https://github.com/input-output-hk/marlowe-starter-kit/issues).

In [Marlowe Playground](https://play.marlowe-finance.io/), the contract looks like this in Blockly format.

![Zero-coupon bond Marlowe contract](images/01-zcb-contract.png)

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

See [Lesson 0. Preliminaries](00-preliminaries.md) for information on setting up one's environment for using this tutorial.

The lesson assumes that the following environment variables have been set.
- `CARDANO_NODE_SOCKET_PATH`: location of Cardano node's socket.
- `CARDANO_TESTNET_MAGIC`: testnet magic number.
- `MARLOWE_RT_HOST`: IP address of the Marlowe Runtime proxy server.
- `MARLOWE_RT_PORT`: Port number for the Marlowe Runtime proxy server.

It also assumes that the Lender and Borrower parties have addresses, signing keys, and funds.
- Lender
    - [keys/lender.address](keys/lender.address): Cardano address for the lender
    - [keys/lender.skey](keys/lender.skey): location of signing key file for the lender
- Borrower
    - [keys/borrower.address](keys/borrower.address): Cardano address for the borrower
    - [keys/borrower.skey](keys/borrower.skey): location of signing key file for the borrower

### Access to Cardano node and Marlowe Runtime

If we're using [demeter.run](https://demeter.run/)'s Cardano Marlowe Runtime extension, then we already have access to Cardano Node and Marlowe Runtime. The followind commands will set the required environment variables to use a local docker deployment on the default ports. It will also set some supplementary environment variables.


```bash
if [[ -z "$MARLOWE_RT_PORT" ]]
then

  # Only required for `marlowe-cli` and `cardano-cli`.
  export CARDANO_NODE_SOCKET_PATH="$(docker volume inspect marlowe-starter-kit_shared | jq -r '.[0].Mountpoint')/node.socket"
  export CARDANO_TESTNET_MAGIC=1 # Note that preprod=1 and preview=2. Do not set this variable if using mainnet.

  # Only required for `marlowe-runtime-cli`.
  export MARLOWE_RT_HOST="127.0.0.1"
  export MARLOWE_RT_PORT=3700

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
echo "MARLOWE_RT_HOST = $MARLOWE_RT_HOST"
echo "MARLOWE_RT_PORT = $MARLOWE_RT_PORT"
```

    CARDANO_NODE_SOCKET_PATH = ~/.local/share/containers/storage/volumes/marlowe-starter-kit_shared/_data/node.socket
    CARDANO_TESTNET_MAGIC = 1
    MARLOWE_RT_HOST = 127.0.0.1
    MARLOWE_RT_PORT = 3700


Note the test network magic number:
- `preprod` = 1
- `preview` = 2

### Lender address and funds

Check that an address and key has been created for the lender. If not, see "Creating Addresses and Signing Keys" in [Lesson 0. Preliminaries](00-preliminaries.md).


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
    8461a35e612b38d4cb592e4ba1b7f13c2ff2825942d66e7200acc575cd4c8f1c     1        1000000000 lovelace + TxOutDatumNone


One can view the address on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/address/"$LENDER_ADDR"
```

    https://preprod.cardanoscan.io/address/addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck


### Borrower address and funds

Check that an address and key has been created for the borrower. If not, see "Creating Addresses and Signing Keys" in [Lesson 0. Preliminaries](00-preliminaries.md).


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
    8461a35e612b38d4cb592e4ba1b7f13c2ff2825942d66e7200acc575cd4c8f1c     2        1000000000 lovelace + TxOutDatumNone


One can view the address on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/address/"$BORROWER_ADDR"
```

    https://preprod.cardanoscan.io/address/addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d


## Design the contract

The zero-coupon bond contract can be downloaded from the [Marlowe Playground](https://play.marlowe-finance.io/) as a JSON file, or it can be generated using [Marlowe CLI](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-cli#readme) using the `marlowe-cli template` command.

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

    NOW = 1679602725000 POSIX milliseconds = Thu Mar 23 02:18:45 PM MDT 2023


The contract has a lending deadline and a repayment deadline. For convenience in this example, set the deadlines to the near future.


```bash
LENDER_DEADLINE="$((NOW + 1 * HOUR))"
BORROWER_DEADLINE="$((NOW + 3 * HOUR))"
echo LENDER_DEADLINE = "$LENDER_DEADLINE" POSIX milliseconds = "`date -d @$((LENDER_DEADLINE / SECOND))`"
echo BORROWER_DEADLINE = "$BORROWER_DEADLINE" POSIX milliseconds = "`date -d @$((BORROWER_DEADLINE / SECOND))`"
```

    LENDER_DEADLINE = 1679606325000 POSIX milliseconds = Thu Mar 23 03:18:45 PM MDT 2023
    BORROWER_DEADLINE = 1679613525000 POSIX milliseconds = Thu Mar 23 05:18:45 PM MDT 2023


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

    timeout: 1679606325000
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
          timeout: 1679613525000
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


Also view the initial state of the contract. Note that Marlowe Runtime overrides this with a state that it builds.


```bash
json2yaml zcb-state.json
```

    accounts:
    - - - address: addr_test1vz3w7jtrmx550r4eqfqxnka8c9r763z9hxc6s3hc5wl68qq0kxt5e
        - currency_symbol: ''
          token_name: ''
      - 2000000
    boundValues: []
    choices: []
    minTime: 1


### \[Optional, but recommended\] Check the safety of the contract

If we were running the contract on the Cardano `mainnet`, then we\'d want to check its safety before creating it, so that there is no chance that we might lose funds.

Here are the steps for checking the safety of a contract:

1. Understand the [Marlowe Language](https://marlowe-finance.io/).
2. Understand Cardano\'s [Extended UTxO Model](https://docs.cardano.org/learn/eutxo-explainer).
3. Read and understand the [Marlowe Best Practices Guide](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/best-practices.md).
4. Read and understand the [Marlowe Security Guide](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/security.md).
5. Use [Marlowe Playground](https://play.marlowe-finance.io/) to flag warnings, perform static analysis, and simulate the contract.
6. Use [Marlowe CLI\'s](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/ReadMe.md) `marlowe-cli run analyze` tool to study whether the contract can run on a Cardano network.
7. Run *all execution paths* of the contract on a [Cardano testnet](https://docs.cardano.org/cardano-testnet/overview).

Here we\'ll perform step 6. First we bundle the contract and its initial state into a single file.


```bash
marlowe-cli run initialize \
  --permanently-without-staking \
  --contract-file zcb-contract.json \
  --state-file zcb-state.json \
  --out-file zcb-marlowe.json
```

Now we analyze the contract and its execution paths.


```bash
marlowe-cli run analyze \
  --marlowe-file zcb-marlowe.json
```

    Note that path-based analysis ignore the initial state of the contract and instead start with an empty state.
    Starting search for execution paths . . .
     . . . found 3 execution paths.
    - Preconditions:
        Duplicate accounts: []
        Duplicate bound values: []
        Duplicate choices: []
        Invalid account parties: []
        Invalid account tokens: []
        Invalid choice parties: []
        Invalid roles currency: false
        Non-positive account balances: []
    - Role names:
        Blank role names: false
        Invalid role names: []
    - Tokens:
        Invalid tokens: []
    - Maximum value:
        Actual: 88
        Invalid: false
        Maximum: 5000
        Percentage: 1.76
        Unit: byte
    - Minimum UTxO:
        Requirement:
          lovelace: 1120600
    - Execution cost:
        Memory:
          Actual: 6588250
          Invalid: false
          Maximum: 14000000
          Percentage: 47.058928571428574
        Steps:
          Actual: 1767311958
          Invalid: false
          Maximum: 10000000000
          Percentage: 17.67311958
    - Transaction size:
        Actual: 1630
        Invalid: false
        Maximum: 16384
        Percentage: 9.94873046875


In the above report, we see that the contract doesn\'t have any duplicate or invalid values, and it does not exceed any of the blockchain\'s protocol parameters. In particular, note that our previously chosen `MIN_LOVELACE` value of 2 ada is greater than the 1.120600 ada that the analysis tool says is needed. Thus, it is safe to execute any path in the contract.

## Transaction 1. Create the Contract

Marlowe Runtime\'s command `marlowe-runtime-cli create` will build the creation transaction for a Marlowe contract. We provide it the JSON file containing the contract and tell it the `MIN_LOVELACE` value that we previously chose. Anyone could create the contract, but in this example the lender will be doing so, so we provide their address to fund the transaction and to receive the change from it.


```bash
marlowe-runtime-cli create --help
```

    Usage: marlowe-runtime-cli create --change-address ADDRESS [-a|--address ADDRESS] 
                          [--collateral-utxo UTXO] --manual-sign FILE_PATH 
                          [-m|--metadata-file FILE_PATH] [--tags-file FILE_PATH] 
                          [--v1] 
                          [(-r|--role ROLE=ADDRESS) | 
                            --roles-config-file FILE_PATH | 
                            --role-token-policy-id POLICY_ID] 
                          (--core-file FILE_PATH | --contract-file FILE_PATH 
                            [--args-file FILE_PATH | 
                              [--timeout-arg NAME=POSIX_TIMESTAMP] 
                              [--value-arg NAME=INTEGER]]) --min-utxo LOVELACE
    
      Create a new Marlowe Contract
    
    Available options:
      --change-address ADDRESS The address to which the change of the transaction
                               should be sent.
      -a,--address ADDRESS     An address whose UTXOs can be used as inputs to the
                               transaction
      --collateral-utxo UTXO   A UTXO which may be used as a collateral input
      --manual-sign FILE_PATH  Sign the transaction manually. Writes the CBOR bytes
                               of the unsigned transaction to the specified file for
                               manual signing. Use the submit command to submit the
                               signed transaction.
      -m,--metadata-file FILE_PATH
                               A JSON file containing a map of integer indexes to
                               arbitrary JSON values that will be added to the
                               transaction's metadata.
      --tags-file FILE_PATH    A JSON file containing a map of tags indexes to
                               optional JSON-encoded metadata values that will be
                               added to the transaction's 1564 metadata key. Note
                               that the entire 1564 key will be overridden if also
                               specified in --metadata-file.
      --v1                     Run command in Marlowe V1
      -r,--role ROLE=ADDRESS   The name of a role in the contract with the address
                               to send the token to
      --roles-config-file FILE_PATH
                               A JSON file containing a map of role token names to a
                               roles configuration object. The roles configuration
                               object has two keys, "address" and "metadata", where
                               "address" is the address to send the newly minted
                               role token and "metadata" is the CIP-25 metadata
                               object to associate with the token.
      --role-token-policy-id POLICY_ID
                               The hexadecimal-encoded policy ID of the role tokens
                               for this contract. This option is used to support
                               role tokens minted in a separate transaction.
      --core-file FILE_PATH    A file containing the Core Marlowe JSON definition of
                               the contract to create.
      --contract-file FILE_PATH
                               A file containing the Extended Marlowe JSON
                               definition of the contract to create.
      --args-file FILE_PATH    A file containing the Extended Marlowe arguments to
                               apply to the contract.
      --timeout-arg NAME=POSIX_TIMESTAMP
                               The name of a timeout parameter in the contract and a
                               value to assign to it (in POSIX milliseconds).
      --value-arg NAME=INTEGER The name of a numeric parameter in the contract and a
                               value to assign to it.
      --min-utxo LOVELACE      An amount which should be used as min ADA requirement
                               for the Contract UTxO.
      -h,--help                Show this help text



```bash
CONTRACT_ID=$(
marlowe-runtime-cli create \
  --core-file zcb-contract.json \
  --min-utxo "$MIN_LOVELACE" \
  --change-address "$LENDER_ADDR" \
  --manual-sign tx-1.unsigned \
| jq -r 'fromjson | .contractId' \
)
echo "CONTRACT_ID = $CONTRACT_ID"
```

    CONTRACT_ID = 3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895#1


Marlowe Runtime uses the first (creation) UTxO of the contract to identify it throughout its lifecycle.

The result of building the transaction is the identifier for the contract and the file `tx-1.unsigned`, which contains the Cardano unsigned transaction for creating the contract, in text-envelope format.


```bash
json2yaml tx-1.unsigned
```

    cborHex: 86a400818258208461a35e612b38d4cb592e4ba1b7f13c2ff2825942d66e7200acc575cd4c8f1c010182a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a3b793fffa300581d702ed2631dbb277c84334453c5c437b86325d371f0835a28b910a91a6e011a001e84800282005820a3d7e66932dd99e0a1ca6eb6f3f72d1ac2810f04f62571ed817f9559ad12feb1021a000305810b58206f2e3fee174fcd550f939e9badb11bf3cf549203070c67bc7ddc376926f9f98d9fff81d8799fd8799f40ffd8799fa1d8799fd8799fd87980d8799fd8799f581c1b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59ffd87a80ffffd8799f4040ffff1a001e8480a0a000ffd87c9f9fd8799fd8799fd8799fd87980d8799fd8799f581c1b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59ffd87a80ffffd8799fd87980d8799fd8799f581c1b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59ffd87a80ffffd8799f4040ffd87a9f1a04c4b400ffffd87a9fd8799fd87980d8799fd8799f581c1b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59ffd87a80ffffd87a9fd8799fd87980d8799fd8799f581c4959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a1ffd87a80ffffffd8799f4040ffd87a9f1a04c4b400ffd87c9f9fd8799fd8799fd8799fd87980d8799fd8799f581c4959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a1ffd87a80ffffd8799fd87980d8799fd8799f581c4959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a1ffd87a80ffffd8799f4040ffd87c9fd87a9f1a04c4b400ffd87a9f1a004c4b40ffffffd87a9fd8799fd87980d8799fd8799f581c4959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a1ffd87a80ffffd87a9fd8799fd87980d8799fd8799f581c1b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59ffd87a80ffffffd8799f4040ffd87c9fd87a9f1a04c4b400ffd87a9f1a004c4b40ffffd87980ffffff1b0000018710c47c08d87980ffffffff1b0000018710569f08d87980ffff80f5f6
    description: ''
    type: TxBodyBabbage


There are many ways to sign and submit Cardano transactions:
- `cardano-cli` at the command line
- `cardano-wallet` at the command line or as a REST service
- `cardano-hw-cli` for a hardware wallet at the command line
- a Babbage-compatible CIP-30 wallet in a web browser
- `marlowe-cli` at the command line

For convenience, here we use `marlowe-cli transaction submit`. One may have to wait a minute or so for the transactions to be confirmed on the blockchain.


```bash
TX_1=$(
marlowe-cli transaction submit \
  --tx-body-file tx-1.unsigned \
  --required-signer "$LENDER_SKEY" \
  --timeout 600 \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_1 = $TX_1"
```

    TX_1 = 3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895


One can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_1?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895?tab=utxo


One can also examine the contract's UTxO using `cardano-cli`.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --tx-in "$TX_1#1"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895     1        2000000 lovelace + TxOutDatumHash ScriptDataInBabbageEra "a3d7e66932dd99e0a1ca6eb6f3f72d1ac2810f04f62571ed817f9559ad12feb1"


## View the details of the contract on the blockchain

Marlowe Runtime\'s command `marlowe-runtime-cli log` can fetch a contract from the blockchain and print information about it.


```bash
marlowe-runtime-cli log --show-contract "$CONTRACT_ID"
```

    [93mtransaction 3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895 (creation)
    [0mContractId:      3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895#1
    SlotNo:          23920017
    BlockNo:         755074
    BlockId:         3235ba612d6df4e536da88890b39cc0fbb96ff3313643dd999ef31ed699f3af2
    ScriptAddress:   addr_test1wqhdyccahvnheppng3fut3phhp3jt5m37zp4529ezz535ms2u9jqv
    Marlowe Version: 1
    
        When [
          (Case
             (Deposit (Address "addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck") (Address "addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck")
                (Token "" "")
                (Constant 80000000))
             (Pay (Address "addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck")
                (Party (Address "addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d"))
                (Token "" "")
                (Constant 80000000)
                (When [
                   (Case
                      (Deposit (Address "addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d") (Address "addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d")
                         (Token "" "")
                         (AddValue
                            (Constant 80000000)
                            (Constant 5000000)))
                      (Pay (Address "addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d")
                         (Party (Address "addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck"))
                         (Token "" "")
                         (AddValue
                            (Constant 80000000)
                            (Constant 5000000)) Close))] 1679613525000 Close)))] 1679606325000 Close
    


More detail can be retrieved using `marlowe-pipe`.


```bash
echo '{"request" : "get", "contractId" : "'"$CONTRACT_ID"'"}' | marlowe-pipe 2> /dev/null | json2yaml
```

    creation:
      output:
        address: 702ed2631dbb277c84334453c5c437b86325d371f0835a28b910a91a6e
        assets:
          ada: 2000000
          tokens: []
        datum:
          marloweContract:
            timeout: 1679606325000
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
                  timeout: 1679613525000
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
          marloweParams:
            rolesCurrency: ''
          marloweState:
            accounts:
            - - - address: addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck
                - currency_symbol: ''
                  token_name: ''
              - 2000000
            boundValues: []
            choices: []
            minTime: 0
        utxo:
          txId: 3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895
          txIx: 1
      payoutValidatorHash: e165610232235bbbbeff5b998b233daae42979dec92a6722d9cda989
    response: info
    steps: []


## Transaction 2. The lender deposits the principal

The lender deposits their 80 ada of principal into the contract using Marlowe Runtime\'s `marlowe-runtime-cli deposit` command. The lender is providing the funding for and receiving the change from this transaction, so we provide their address. We provide the contract identifier and save the unsigned transaction in the file `tx-2.unsigned`.


```bash
marlowe-runtime-cli deposit --help
```

    Usage: marlowe-runtime-cli deposit --change-address ADDRESS [-a|--address ADDRESS] 
                           [--collateral-utxo UTXO] --manual-sign FILE_PATH 
                           [-m|--metadata-file FILE_PATH] [--tags-file FILE_PATH]
                           (-c|--contract CONTRACT_ID) --to-party ROLE_NAME|ADDRESS
                           --from-party ROLE_NAME|ADDRESS 
                           ((-c|--currency MINTING_POLICY_ID)
                             (-n|--token-name TOKEN_NAME) (-q|--quantity INTEGER) |
                             (-l|--lovelace INTEGER)) 
                           [--continuation-file FILE_PATH] 
                           [-l|--validity-lower-bound TIMESTAMP] 
                           [-u|--validity-upper-bound TIMESTAMP]
    
      Deposit funds into a contract
    
    Available options:
      --change-address ADDRESS The address to which the change of the transaction
                               should be sent.
      -a,--address ADDRESS     An address whose UTXOs can be used as inputs to the
                               transaction
      --collateral-utxo UTXO   A UTXO which may be used as a collateral input
      --manual-sign FILE_PATH  Sign the transaction manually. Writes the CBOR bytes
                               of the unsigned transaction to the specified file for
                               manual signing. Use the submit command to submit the
                               signed transaction.
      -m,--metadata-file FILE_PATH
                               A JSON file containing a map of integer indexes to
                               arbitrary JSON values that will be added to the
                               transaction's metadata.
      --tags-file FILE_PATH    A JSON file containing a map of tags indexes to
                               optional JSON-encoded metadata values that will be
                               added to the transaction's 1564 metadata key. Note
                               that the entire 1564 key will be overridden if also
                               specified in --metadata-file.
      -c,--contract CONTRACT_ID
                               The ID of the Marlowe contract to deposit funds into
      --to-party ROLE_NAME|ADDRESS
                               The party into whose account to deposit the funds.
      --from-party ROLE_NAME|ADDRESS
                               The party depositing the funds.
      -c,--currency MINTING_POLICY_ID
                               The minting policy ID of the token(s) to deposit.
      -n,--token-name TOKEN_NAME
                               The name of the token(s) to deposit.
      -q,--quantity INTEGER    The quantity of tokens to deposit.
      -l,--lovelace INTEGER    The quantity of lovelace to deposit.
      --continuation-file FILE_PATH
                               A file containing the continuation contract JSON for
                               making a choice in a Merkleized contract.
      -l,--validity-lower-bound TIMESTAMP
                               The lower bound of the transaction validity interval
                               in POSIX milliseconds. If not specified, the current
                               time (as determined by the Cardano node) will be
                               used.
      -u,--validity-upper-bound TIMESTAMP
                               The upper bound of the transaction validity interval
                               in POSIX milliseconds. If not specified, the next
                               timeout in the contract will be used (bounded by the
                               maximum value allowed by the Cardano node).
      -h,--help                Show this help text



```bash
TX_2=$(
marlowe-runtime-cli deposit \
  --contract "$CONTRACT_ID" \
  --from-party "$LENDER_ADDR" \
  --to-party "$LENDER_ADDR" \
  --lovelace "$PRINCIPAL" \
  --change-address "$LENDER_ADDR" \
  --manual-sign tx-2.unsigned \
| jq -r 'fromjson | .txId' \
)
echo "TX_2 = $TX_2"
```

    TX_2 = bc286bb53f50a7355e2765462546e03d17cabde30420b6bfd1531617386facf4


Note that if the transaction would violate the logic of the Marlowe contract, one would receive an error message. For example, let\'s say that we deposit the incorrect amount or deposit it to the wrong party\'s internal account.


```bash
marlowe-runtime-cli deposit \
  --contract "$CONTRACT_ID" \
  --from-party "$LENDER_ADDR" \
  --to-party "$LENDER_ADDR" \
  --lovelace 80 \
  --change-address "$LENDER_ADDR" \
  --manual-sign /dev/null
```

    ApplyFailed (ApplyInputsConstraintsBuildupFailed (MarloweComputeTransactionFailed "TEApplyNoMatchError"))





```bash
marlowe-runtime-cli deposit \
  --contract "$CONTRACT_ID" \
  --from-party "$LENDER_ADDR" \
  --to-party "$BORROWER_ADDR" \
  --lovelace "$PRINCIPAL"\
  --change-address "$LENDER_ADDR" \
  --manual-sign /dev/null
```

    ApplyFailed (ApplyInputsConstraintsBuildupFailed (MarloweComputeTransactionFailed "TEApplyNoMatchError"))




The [Marlowe Debugging Cookbook](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/debugging-cookbook.md) guides interpretation of error messages. Also, one can determine the possible actions for the contract at its current stage of execution by studing the contract\'s current state or by using Marlowe playground to simulate the contract.

![Simulation of zero-coupon bond contract in Marlowe Playground](images/zcb-simulation.png)

Once again, use `marlowe-cli` to submit the transaction and then wait for confirmation.


```bash
marlowe-cli transaction submit \
  --tx-body-file tx-2.unsigned \
  --required-signer "$LENDER_SKEY" \
  --timeout 600
```

    TxId "bc286bb53f50a7355e2765462546e03d17cabde30420b6bfd1531617386facf4"


One can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_2?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/bc286bb53f50a7355e2765462546e03d17cabde30420b6bfd1531617386facf4?tab=utxo


One can see that the lender has 82 ada less than originally. Two ada were deposited in the contract when it was created and 80 ada were paid to the borrower in the second transaction.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$LENDER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    bc286bb53f50a7355e2765462546e03d17cabde30420b6bfd1531617386facf4     0        917043702 lovelace + TxOutDatumNone


The borrower has an additional 80 ada (the loan's principal) now.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$BORROWER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    8461a35e612b38d4cb592e4ba1b7f13c2ff2825942d66e7200acc575cd4c8f1c     2        1000000000 lovelace + TxOutDatumNone
    bc286bb53f50a7355e2765462546e03d17cabde30420b6bfd1531617386facf4     2        80000000 lovelace + TxOutDatumNone


The Marlowe contract still has the 2 ada from its creation.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --tx-in "$TX_2#1"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    bc286bb53f50a7355e2765462546e03d17cabde30420b6bfd1531617386facf4     1        2000000 lovelace + TxOutDatumHash ScriptDataInBabbageEra "a93e880b40ff61cda04fd23696b1abe3d8ee13591896aaad3f42441ced75f5b2"


## View the further progress of the contract on the blockchain

Marlowe Runtime\'s command `marlowe-runtime-cli log` can fetch a contract from the blockchain and print information about it.


```bash
marlowe-runtime-cli log --show-contract "$CONTRACT_ID"
```

    [93mtransaction 3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895 (creation)
    [0mContractId:      3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895#1
    SlotNo:          23920017
    BlockNo:         755074
    BlockId:         3235ba612d6df4e536da88890b39cc0fbb96ff3313643dd999ef31ed699f3af2
    ScriptAddress:   addr_test1wqhdyccahvnheppng3fut3phhp3jt5m37zp4529ezz535ms2u9jqv
    Marlowe Version: 1
    
        When [
          (Case
             (Deposit (Address "addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck") (Address "addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck")
                (Token "" "")
                (Constant 80000000))
             (Pay (Address "addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck")
                (Party (Address "addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d"))
                (Token "" "")
                (Constant 80000000)
                (When [
                   (Case
                      (Deposit (Address "addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d") (Address "addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d")
                         (Token "" "")
                         (AddValue
                            (Constant 80000000)
                            (Constant 5000000)))
                      (Pay (Address "addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d")
                         (Party (Address "addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck"))
                         (Token "" "")
                         (AddValue
                            (Constant 80000000)
                            (Constant 5000000)) Close))] 1679613525000 Close)))] 1679606325000 Close
    
    [93mtransaction bc286bb53f50a7355e2765462546e03d17cabde30420b6bfd1531617386facf4
    [0mContractId: 3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895#1
    SlotNo:     23920533
    BlockNo:    755085
    BlockId:    afb9ca1ee1d06282e65943ae57d09622ca8d648a63d69eab1dd186fa5b3b7bc4
    Inputs:     [NormalInput (IDeposit "\"addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck\"" "\"addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck\"" (Token "" "") 80000000)]
    
        When [
          (Case
             (Deposit (Address "addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d") (Address "addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d")
                (Token "" "")
                (AddValue
                   (Constant 80000000)
                   (Constant 5000000)))
             (Pay (Address "addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d")
                (Party (Address "addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck"))
                (Token "" "")
                (AddValue
                   (Constant 80000000)
                   (Constant 5000000)) Close))] 1679613525000 Close
    


More detail can be retrieved using `marlowe-pipe`.


```bash
echo '{"request" : "get", "contractId" : "'"$CONTRACT_ID"'"}' | marlowe-pipe 2> /dev/null | json2yaml
```

    creation:
      output:
        address: 702ed2631dbb277c84334453c5c437b86325d371f0835a28b910a91a6e
        assets:
          ada: 2000000
          tokens: []
        datum:
          marloweContract:
            timeout: 1679606325000
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
                  timeout: 1679613525000
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
          marloweParams:
            rolesCurrency: ''
          marloweState:
            accounts:
            - - - address: addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck
                - currency_symbol: ''
                  token_name: ''
              - 2000000
            boundValues: []
            choices: []
            minTime: 0
        utxo:
          txId: 3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895
          txIx: 1
      payoutValidatorHash: e165610232235bbbbeff5b998b233daae42979dec92a6722d9cda989
    response: info
    steps:
    - contractId: 3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895#1
      payouts: []
      redeemer:
      - input_from_party:
          address: addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck
        into_account:
          address: addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck
        of_token:
          currency_symbol: ''
          token_name: ''
        that_deposits: 80000000
      scriptOutput:
        address: 702ed2631dbb277c84334453c5c437b86325d371f0835a28b910a91a6e
        assets:
          ada: 2000000
          tokens: []
        datum:
          marloweContract:
            timeout: 1679613525000
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
          marloweParams:
            rolesCurrency: ''
          marloweState:
            accounts:
            - - - address: addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck
                - currency_symbol: ''
                  token_name: ''
              - 2000000
            boundValues: []
            choices: []
            minTime: 1679603355000
        utxo:
          txId: bc286bb53f50a7355e2765462546e03d17cabde30420b6bfd1531617386facf4
          txIx: 1
      step: apply
      txId: bc286bb53f50a7355e2765462546e03d17cabde30420b6bfd1531617386facf4


## Transaction 3. The borrower repays the loan

After some time passes, the borrower repays principal plus interest. Thus, they fund the transaction and receive the change at their address.


```bash
TX_3=$(
marlowe-runtime-cli deposit \
  --contract "$CONTRACT_ID" \
  --from-party "$BORROWER_ADDR" \
  --to-party "$BORROWER_ADDR" \
  --lovelace "$((PRINCIPAL+INTEREST))" \
  --change-address "$BORROWER_ADDR" \
  --manual-sign tx-3.unsigned \
| jq -r 'fromjson | .txId' \
)
echo "TX_3 = $TX_3"
```

    TX_3 = d159062c1321707d12d7abe14cfaca1881a7b1e3c65bb4d637070e4fc0da08c3


Once again, use `marlowe-cli` to submit the transaction and then wait for confirmation.


```bash
marlowe-cli transaction submit \
  --tx-body-file tx-3.unsigned \
  --required-signer "$BORROWER_SKEY" \
  --timeout 600
```

    TxId "d159062c1321707d12d7abe14cfaca1881a7b1e3c65bb4d637070e4fc0da08c3"


One can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_3?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/d159062c1321707d12d7abe14cfaca1881a7b1e3c65bb4d637070e4fc0da08c3?tab=utxo


One can see that the lender received back the 80 ada of principal and the 2 ada deposited when the contract was created, along with the additional 5 ada of interest, totallying 87 ada.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$LENDER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    bc286bb53f50a7355e2765462546e03d17cabde30420b6bfd1531617386facf4     0        917043702 lovelace + TxOutDatumNone
    d159062c1321707d12d7abe14cfaca1881a7b1e3c65bb4d637070e4fc0da08c3     1        87000000 lovelace + TxOutDatumNone


The borrower now has about 5 ada (the loan's interest) less than originally.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$BORROWER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    bc286bb53f50a7355e2765462546e03d17cabde30420b6bfd1531617386facf4     2        80000000 lovelace + TxOutDatumNone
    d159062c1321707d12d7abe14cfaca1881a7b1e3c65bb4d637070e4fc0da08c3     0        914430977 lovelace + TxOutDatumNone


The Marlowe contract has closed, so there is no output to its script address.

## View the completion of the contract on the blockchain

Marlowe Runtime\'s command `marlowe-runtime-cli log` can fetch a contract from the blockchain and print information about it.


```bash
marlowe-runtime-cli log --show-contract "$CONTRACT_ID"
```

    [93mtransaction 3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895 (creation)
    [0mContractId:      3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895#1
    SlotNo:          23920017
    BlockNo:         755074
    BlockId:         3235ba612d6df4e536da88890b39cc0fbb96ff3313643dd999ef31ed699f3af2
    ScriptAddress:   addr_test1wqhdyccahvnheppng3fut3phhp3jt5m37zp4529ezz535ms2u9jqv
    Marlowe Version: 1
    
        When [
          (Case
             (Deposit (Address "addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck") (Address "addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck")
                (Token "" "")
                (Constant 80000000))
             (Pay (Address "addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck")
                (Party (Address "addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d"))
                (Token "" "")
                (Constant 80000000)
                (When [
                   (Case
                      (Deposit (Address "addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d") (Address "addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d")
                         (Token "" "")
                         (AddValue
                            (Constant 80000000)
                            (Constant 5000000)))
                      (Pay (Address "addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d")
                         (Party (Address "addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck"))
                         (Token "" "")
                         (AddValue
                            (Constant 80000000)
                            (Constant 5000000)) Close))] 1679613525000 Close)))] 1679606325000 Close
    
    [93mtransaction bc286bb53f50a7355e2765462546e03d17cabde30420b6bfd1531617386facf4
    [0mContractId: 3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895#1
    SlotNo:     23920533
    BlockNo:    755085
    BlockId:    afb9ca1ee1d06282e65943ae57d09622ca8d648a63d69eab1dd186fa5b3b7bc4
    Inputs:     [NormalInput (IDeposit "\"addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck\"" "\"addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck\"" (Token "" "") 80000000)]
    
        When [
          (Case
             (Deposit (Address "addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d") (Address "addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d")
                (Token "" "")
                (AddValue
                   (Constant 80000000)
                   (Constant 5000000)))
             (Pay (Address "addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d")
                (Party (Address "addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck"))
                (Token "" "")
                (AddValue
                   (Constant 80000000)
                   (Constant 5000000)) Close))] 1679613525000 Close
    
    [93mtransaction d159062c1321707d12d7abe14cfaca1881a7b1e3c65bb4d637070e4fc0da08c3 (close)
    [0mContractId: 3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895#1
    SlotNo:     23920774
    BlockNo:    755092
    BlockId:    a844fdf2efe9508fa24c34f0a095e8de691e0e16df815e55b95acb5e217151de
    Inputs:     [NormalInput (IDeposit "\"addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d\"" "\"addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d\"" (Token "" "") 85000000)]
    
    


More detail can be retrieved using `marlowe-pipe`.


```bash
echo '{"request" : "get", "contractId" : "'"$CONTRACT_ID"'"}' | marlowe-pipe 2> /dev/null | json2yaml
```

    creation:
      output:
        address: 702ed2631dbb277c84334453c5c437b86325d371f0835a28b910a91a6e
        assets:
          ada: 2000000
          tokens: []
        datum:
          marloweContract:
            timeout: 1679606325000
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
                  timeout: 1679613525000
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
          marloweParams:
            rolesCurrency: ''
          marloweState:
            accounts:
            - - - address: addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck
                - currency_symbol: ''
                  token_name: ''
              - 2000000
            boundValues: []
            choices: []
            minTime: 0
        utxo:
          txId: 3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895
          txIx: 1
      payoutValidatorHash: e165610232235bbbbeff5b998b233daae42979dec92a6722d9cda989
    response: info
    steps:
    - contractId: 3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895#1
      payouts: []
      redeemer:
      - input_from_party:
          address: addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck
        into_account:
          address: addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck
        of_token:
          currency_symbol: ''
          token_name: ''
        that_deposits: 80000000
      scriptOutput:
        address: 702ed2631dbb277c84334453c5c437b86325d371f0835a28b910a91a6e
        assets:
          ada: 2000000
          tokens: []
        datum:
          marloweContract:
            timeout: 1679613525000
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
          marloweParams:
            rolesCurrency: ''
          marloweState:
            accounts:
            - - - address: addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck
                - currency_symbol: ''
                  token_name: ''
              - 2000000
            boundValues: []
            choices: []
            minTime: 1679603355000
        utxo:
          txId: bc286bb53f50a7355e2765462546e03d17cabde30420b6bfd1531617386facf4
          txIx: 1
      step: apply
      txId: bc286bb53f50a7355e2765462546e03d17cabde30420b6bfd1531617386facf4
    - contractId: 3bd6f3011ebabd0d55182aa657a7b841faa9f4b823d1fd76a215d917d0c61895#1
      payouts: []
      redeemer:
      - input_from_party:
          address: addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d
        into_account:
          address: addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d
        of_token:
          currency_symbol: ''
          token_name: ''
        that_deposits: 85000000
      scriptOutput: null
      step: apply
      txId: d159062c1321707d12d7abe14cfaca1881a7b1e3c65bb4d637070e4fc0da08c3

