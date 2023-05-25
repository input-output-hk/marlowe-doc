---
title: "Zero-Coupon Bond Using Marlowe Runtime's REST API"
sidebar_position: 3
---

***Before running this notebook, you might want to use Jupyter's "clear output" function to erase the results of the previous execution of this notebook. That will make more apparent what has been executed in the current session.***

The zero-coupon bond example is a simple Marlowe contract where a lender provides principal to a borrower who repays it back with interest.

[A video works through this Jupyter notebook.](https://youtu.be/wgJVdkM2pBY)

You can ask questions about Marlowe in [the #ask-marlowe channel on the IOG Discord](https://discord.com/channels/826816523368005654/936295815926927390) or post problems with this lesson to [the issues list for the Marlowe Starter Kit github repository](https://github.com/input-output-hk/marlowe-starter-kit/issues).

In this demonstration we use Marlowe Runtime\'s REST API, served via `marlowe-web-server`, to run this contract on Cardano\'s `preprod` public testnet. Marlowe contracts may use either addresses or role tokens for authorization: here we use role tokens and we have Marlowe Runtime mint them.

In [Marlowe Playground](https://play.marlowe.iohk.io/), the contract looks like this in Blockly format.

![Zero-coupon bond Marlowe contract](/img/02-zcb-contract.png)

In Marlowe format it appears as
```
When
    [Case
        (Deposit
            (Role "Lender")
            (Role "Lender")
            (Token "" "")
            (ConstantParam "$PRINCIPAL")
        )
        (Pay
            (Role "Lender")
            (Party (Role "Borrower"))
            (Token "" "")
            (ConstantParam "$PRINCIPAL")
            (When
                [Case
                    (Deposit
                        (Role "Borrower")
                        (Role "Borrower")
                        (Token "" "")
                        (AddValue
                            (ConstantParam "$INTEREST")
                            (ConstantParam "$PRINCIPAL")
                        )
                    )
                    (Pay
                        (Role "Borrower")
                        (Party (Role "Lender"))
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
- `MARLOWE_RT_WEBSERVER_HOST`: IP address of the Marlowe Runtime web server.
- `MARLOWE_RT_WEBSERVER_PORT`: Port number for the Marlowe Runtime web server.

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
if [[ -z "$MARLOWE_RT_WEBSERVER_PORT" ]]
then

  # Only required for `marlowe-cli` and `cardano-cli`.
  export CARDANO_NODE_SOCKET_PATH="$(docker volume inspect marlowe-starter-kit_shared | jq -r '.[0].Mountpoint')/node.socket"
  export CARDANO_TESTNET_MAGIC=1 # Note that preprod=1 and preview=2. Do not set this variable if using mainnet.

  # Only required for Marlowe Runtime REST API.
  export MARLOWE_RT_WEBSERVER_HOST="127.0.0.1"
  export MARLOWE_RT_WEBSERVER_PORT=3780

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

MARLOWE_RT_WEBSERVER_URL="http://$MARLOWE_RT_WEBSERVER_HOST":"$MARLOWE_RT_WEBSERVER_PORT"

echo "CARDANO_NODE_SOCKET_PATH = $CARDANO_NODE_SOCKET_PATH"
echo "CARDANO_TESTNET_MAGIC = $CARDANO_TESTNET_MAGIC"
echo "MARLOWE_RT_WEBSERVER_HOST = $MARLOWE_RT_WEBSERVER_HOST"
echo "MARLOWE_RT_WEBSERVER_PORT = $MARLOWE_RT_WEBSERVER_PORT"
echo "MARLOWE_RT_WEBSERVER_URL = $MARLOWE_RT_WEBSERVER_URL"
```

    CARDANO_NODE_SOCKET_PATH = ~/.local/share/containers/storage/volumes/marlowe-starter-kit_shared/_data/node.socket
    CARDANO_TESTNET_MAGIC = 1
    MARLOWE_RT_WEBSERVER_HOST = 127.0.0.1
    MARLOWE_RT_WEBSERVER_PORT = 3780
    MARLOWE_RT_WEBSERVER_URL = http://127.0.0.1:3780


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
    b8be3cb7f1e387578d37da01adaa3186e9814e6557c1ee9915ac5039eb4277fb     1        1000000000 lovelace + TxOutDatumNone


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
    b8be3cb7f1e387578d37da01adaa3186e9814e6557c1ee9915ac5039eb4277fb     2        1000000000 lovelace + TxOutDatumNone


One can view the address on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/address/"$BORROWER_ADDR"
```

    https://preprod.cardanoscan.io/address/addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d


## Design the contract

The zero-coupon bond contract can be downloaded from the [Marlowe Playground](https://play.marlowe.iohk.io/) as a JSON file, or it can be generated using [Marlowe CLI](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-cli#readme) using the `marlowe-cli template` command.

Set the loan's principal to 80 ada and it's interest to 5 ada.


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


Later in the example we will need some constants for converting times.


```bash
SECOND=1000 # 1 second = 1000 milliseconds
MINUTE=$((60 * SECOND)) # 1 minute = 60 seconds
HOUR=$((60 * MINUTE)) # 1 hour = 60 minutes
```

### *Alternative 1:* Use Marlowe Playground to design the contract

If you want to create the contract in Marlowe Playground, do the following:

1. Visit https://play.marlowe.iohk.io/ in a web browser.
2. Select "Open an Example".
3. Select "Marlowe" or "Blockly" under "Zero Coupon Bond".
4. Select "Send to Simulator".
5. Set the "Loan Deadline" to one hour into the future.
6. Set the "Payback Deadline" to three hours into the future.
7. Set the "Principal" to 80 ada.
8. Set the "Interest" to 5 ada.
9. Select "Download as JSON", set the file name to "zcb-contract.json", and store the file in this folder, namely [marlowe-starter-kit/01-runtime-rest/](.).

![Setting parameters for the zero-coupon bond contract in Marlowe Playground](/img/zcb-playground.png)

### *Alternative 2:* Use Marlowe CLI to generate the contract

Below we generate the contract using Marlowe CLI.

First find the current time, measured in [POSIX milliseconds](https://en.wikipedia.org/wiki/Unix_time).


```bash
NOW="$((`date -u +%s` * SECOND))"
echo NOW = "$NOW" POSIX milliseconds = "`date -d @$((NOW / SECOND))`"
```

    NOW = 1679604689000 POSIX milliseconds = Thu Mar 23 02:51:29 PM MDT 2023


The contract has a lending deadline and a repayment deadline. For convenience in this example, set the deadlines to the near future.


```bash
LENDER_DEADLINE="$((NOW + 1 * HOUR))"
BORROWER_DEADLINE="$((NOW + 3 * HOUR))"
echo LENDER_DEADLINE = "$LENDER_DEADLINE" POSIX milliseconds = "`date -d @$((LENDER_DEADLINE / SECOND))`"
echo BORROWER_DEADLINE = "$BORROWER_DEADLINE" POSIX milliseconds = "`date -d @$((BORROWER_DEADLINE / SECOND))`"
```

    LENDER_DEADLINE = 1679608289000 POSIX milliseconds = Thu Mar 23 03:51:29 PM MDT 2023
    BORROWER_DEADLINE = 1679615489000 POSIX milliseconds = Thu Mar 23 05:51:29 PM MDT 2023


Now create the JSON file for the contract, `zcb-contract.json`.


```bash
marlowe-cli template zcb \
  --minimum-ada "$MIN_LOVELACE" \
  --lender Lender \
  --borrower Borrower \
  --principal "$PRINCIPAL" \
  --interest "$INTEREST" \
  --lending-deadline "$LENDER_DEADLINE" \
  --repayment-deadline "$BORROWER_DEADLINE" \
  --out-contract-file zcb-contract.json \
  --out-state-file /dev/null
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

    timeout: 1679608289000
    timeout_continuation: close
    when:
    - case:
        deposits: 80000000
        into_account:
          role_token: Lender
        of_token:
          currency_symbol: ''
          token_name: ''
        party:
          role_token: Lender
      then:
        from_account:
          role_token: Lender
        pay: 80000000
        then:
          timeout: 1679615489000
          timeout_continuation: close
          when:
          - case:
              deposits:
                add: 80000000
                and: 5000000
              into_account:
                role_token: Borrower
              of_token:
                currency_symbol: ''
                token_name: ''
              party:
                role_token: Borrower
            then:
              from_account:
                role_token: Borrower
              pay:
                add: 80000000
                and: 5000000
              then: close
              to:
                party:
                  role_token: Lender
              token:
                currency_symbol: ''
                token_name: ''
        to:
          party:
            role_token: Borrower
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

A `HTTP` `POST` request to Marlowe Runtime\'s `/contracts` endpoint will build the creation transaction for a Marlowe contract. We provide it the JSON file containing the contract and tell it the `MIN_LOVELACE` value that we previously chose. Anyone could create the contract, but in this example the lender will be doing so, so we provide their address to fund the transaction and to receive the change from it.

First we create the JSON body of the request to build the creation transaction.


```bash
yaml2json << EOI > request-1.json
version: v1
contract: `cat zcb-contract.json`
roles:
  Lender: "$LENDER_ADDR"
  Borrower: "$BORROWER_ADDR"
minUTxODeposit: $MIN_LOVELACE
metadata: {}
tags: {}
EOI
cat request-1.json
```

    {"contract":{"timeout":1679608289000,"timeout_continuation":"close","when":[{"case":{"deposits":80000000,"into_account":{"role_token":"Lender"},"of_token":{"currency_symbol":"","token_name":""},"party":{"role_token":"Lender"}},"then":{"from_account":{"role_token":"Lender"},"pay":80000000,"then":{"timeout":1679615489000,"timeout_continuation":"close","when":[{"case":{"deposits":{"add":80000000,"and":5000000},"into_account":{"role_token":"Borrower"},"of_token":{"currency_symbol":"","token_name":""},"party":{"role_token":"Borrower"}},"then":{"from_account":{"role_token":"Borrower"},"pay":{"add":80000000,"and":5000000},"then":"close","to":{"party":{"role_token":"Lender"}},"token":{"currency_symbol":"","token_name":""}}}]},"to":{"party":{"role_token":"Borrower"}},"token":{"currency_symbol":"","token_name":""}}}]},"metadata":{},"minUTxODeposit":2000000,"roles":{"Borrower":"addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d","Lender":"addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck"},"tags":{},"version":"v1"}


Next we post the request and view the response.


```bash
curl "$MARLOWE_RT_WEBSERVER_URL/contracts" \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-Change-Address: $LENDER_ADDR" \
  -d @request-1.json \
  -o response-1.json \
  -sS
json2yaml response-1.json
```

    links:
      contract: contracts/bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d%231
    resource:
      contractId: bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d#1
      txBody:
        cborHex: 86a80081825820b8be3cb7f1e387578d37da01adaa3186e9814e6557c1ee9915ac5039eb4277fb010d81825820b8be3cb7f1e387578d37da01adaa3186e9814e6557c1ee9915ac5039eb4277fb010184a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a3b55c4daa300581d702ed2631dbb277c84334453c5c437b86325d371f0835a28b910a91a6e011a001e84800282005820cc80fcdc9dedea89d2f50dd29cf7f84d14bd00e27714310a0cfe5e24e87fd008a200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a101821a000fea4ca1581c89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43ca148426f72726f77657201a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc5901821a000fc8a0a1581c89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43ca1464c656e6465720110a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a3b909569111a000a3497021a0006cdba09a1581c89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43ca248426f72726f77657201464c656e646572010b582019cfc63c362776ee1417a90f2da9c2f054f92a57561a961ef70fca7ae5bf9ad49f8202590ddd590dda01000033323233223232323232332232323232323232323322323232323232323233322232323232323232322223223232325335001102813263202d33573892010350543500028323232533500313300b49010b4275726e206661696c656400323235004223335530101200132335012223335003220020020013500122001123300101b02e2350012222533530080032103210323500222222222222200a3200135503322533500115021221350022253353301700200713502600113006003300f0021335502c300b49010b4d696e74206661696c656400330163232323500322222222222233355301b120013233501d2233350032200200200135001220011233001225335002103b100103825335333573466e3c03cd400488d4008880080e40e04ccd5cd19b8700e35001223500222001039038103800c3500b220013500a22002500133010335502c33555017237246ecccdd2a400066ae80dd398170009bb102f3355501725335333355300d1200133500e22230033002001200122533500121350032235003223500222350295335333573466e3c0080180cc0c84cd540eccd540ec008cdc0000802801899aa81d80499a81c80200189a81119aa81a001281999919191919191919118011803800990009aa81d11299a800898011801a81d110a99a800880111098031803802990009aa81c91299a8008a81c910a99a800880191099a81e198038020011803000990009aa81c111299a8010800910a99a8018802110a999a99806002001099a81e00219803801802899a81e00119803803000899a81e002198038018029a8019110009a8011110011a80091100199918008009119091a990919980091a801911180180211a801911180100211a8019111800802091a98018021a8020008009801001091111998021299a80089a80a89119801281c800910a99a80089a80b89119801002800910a999a998050020010999803001119a81d80280080089998038011a80c891198010030008008999803001119a81d802800800911299a800899a81c19a81c0018011803281c910a999a99805002801099a81d19a81d0028021804001899980380119a81d002802000899a81d19a81d002802180400191119299a80109800a4c442a666a6601600c004266600e0044600c66a07800e002002260069309998038011180319a81e003800800919a81c98019a80c0911980100300098038011919111a801111a80191912999a999a80d8048028018999a80d8040020008a8010a8010999a80c80380180099999999a80a11199ab9a3370e00400205a05844a66a666ae68cdc3801000816816080c8a99a999ab9a3371200400205a058202e203044666ae68cdc400100081681611199ab9a3371200400205a05844666ae68cdc480100081601691199ab9a3371000400205805a44a66a666ae68cdc48010008168160800880111299a999ab9a3371200400205a0582004200266666666a02602244a66a666ae68cdc7801000816015880c0a99a999ab9a33722004002058056202c202e44666ae68cdc800100081601591199ab9a3372200400205805644666ae68cdc880100081581611199ab9a3372000400205605844a66a666ae68cdc88010008160158800880111299a999ab9a3372200400205805620042002002a03e426a0024466a0660040022a062400266aa05866aaa02e644a66a002420022004a06066aaa02e646446004002640026aa06644a66a0022a0424426a00444a66a6602e00400e26a04c0022600c006601e00466aaa02e400246a002444444444444010a00201426a002440046666ae68cdc39aab9d5003480008cc8848cc00400c008c8c8c8c8c8c8c8c8c8c8c8c8c8cccd5cd19b8735573aa018900011999999999999111111111110919999999999980080680600580500480400380300280200180119a8128131aba1500c33502502635742a01666a04a04e6ae854028ccd540a5d728141aba150093335502975ca0506ae854020cd40940c0d5d0a803999aa814818bad35742a00c6464646666ae68cdc39aab9d5002480008cc8848cc00400c008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a81dbad35742a00460786ae84d5d1280111931902219ab9c04003f042135573ca00226ea8004d5d0a8011919191999ab9a3370e6aae754009200023322123300100300233503b75a6ae854008c0f0d5d09aba2500223263204433573808007e08426aae7940044dd50009aba135744a004464c6408066ae700f00ec0f84d55cf280089baa00135742a00a66a04aeb8d5d0a802199aa81481690009aba150033335502975c40026ae854008c0bcd5d09aba2500223263203c33573807006e07426ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aab9e5001137540026ae85400cc07cd5d09aba2500323263202e3357380540520586666ae68cdc3a80224004424400446666ae68cdc3a802a40004244002464c6405c66ae700a80a40b00ac4d55cf280089baa001135573a6ea8004894cd400440804cd5ce00100f990009aa8131108911299a80089a80191000910999a802910011802001199aa98038900080280200089109198008018010919a800a811281191a800911999a80091931901219ab9c4901024c680001f20012326320243357389201024c680001f2326320243357389201024c680001f22333573466e3c00800406c06848d40048888888801c48888888848cccccccc00402402001c01801401000c008488800c48880084888004894cd400840044050444888c00cc00800448c88c008dd6000990009aa80d911999aab9f0012501c233501b30043574200460066ae880080548c8c8cccd5cd19b8735573aa004900011991091980080180118061aba150023005357426ae8940088c98c8068cd5ce00b00a80c09aab9e5001137540024646464646666ae68cdc39aab9d5004480008cccc888848cccc00401401000c008c8c8c8cccd5cd19b8735573aa0049000119910919800801801180a9aba1500233500d014357426ae8940088c98c807ccd5ce00d80d00e89aab9e5001137540026ae854010ccd54021d728039aba150033232323333573466e1d4005200423212223002004357426aae79400c8cccd5cd19b875002480088c84888c004010dd71aba135573ca00846666ae68cdc3a801a400042444006464c6404266ae7007407007c0780744d55cea80089baa00135742a00466a012eb8d5d09aba2500223263201b33573802e02c03226ae8940044d5d1280089aab9e500113754002266aa002eb9d6889119118011bab00132001355018223233335573e0044a034466a03266aa036600c6aae754008c014d55cf280118021aba200301313574200224464646666ae68cdc3a800a400046a00e600a6ae84d55cf280191999ab9a3370ea00490011280391931900c19ab9c014013016015135573aa00226ea800448488c00800c44880048c8c8cccd5cd19b875001480188c848888c010014c01cd5d09aab9e500323333573466e1d400920042321222230020053009357426aae7940108cccd5cd19b875003480088c848888c004014c01cd5d09aab9e500523333573466e1d40112000232122223003005375c6ae84d55cf280311931900b19ab9c012011014013012011135573aa00226ea80048c8c8cccd5cd19b8735573aa004900011991091980080180118029aba15002375a6ae84d5d1280111931900919ab9c00e00d010135573ca00226ea80048c8cccd5cd19b8735573aa002900011bae357426aae7940088c98c8040cd5ce00600580709baa001232323232323333573466e1d4005200c21222222200323333573466e1d4009200a21222222200423333573466e1d400d2008233221222222233001009008375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c4664424444444660040120106eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc8848888888cc018024020c030d5d0a8049bae357426ae8940248cccd5cd19b875006480088c848888888c01c020c034d5d09aab9e500b23333573466e1d401d2000232122222223005008300e357426aae7940308c98c8064cd5ce00a80a00b80b00a80a00980900889aab9d5004135573ca00626aae7940084d55cf280089baa0012323232323333573466e1d400520022333222122333001005004003375a6ae854010dd69aba15003375a6ae84d5d1280191999ab9a3370ea0049000119091180100198041aba135573ca00c464c6402466ae7003803404003c4d55cea80189aba25001135573ca00226ea80048c8c8cccd5cd19b875001480088c8488c00400cdd71aba135573ca00646666ae68cdc3a8012400046424460040066eb8d5d09aab9e500423263200f33573801601401a01826aae7540044dd500089119191999ab9a3370ea00290021091100091999ab9a3370ea00490011190911180180218031aba135573ca00846666ae68cdc3a801a400042444004464c6402066ae7003002c0380340304d55cea80089baa0012323333573466e1d40052002200523333573466e1d40092000200523263200c33573801000e01401226aae74dd500089100109100089000a481035054310011223002001320013550052253350011376200644266ae80d400888cdd2a400066ae80dd480119aba037500026ec401cc010005261122002122122330010040031122123300100300211232300100122330033002002001489201b356f4b4821ed7eaabb9db7965e0043e08cbfbff07decc4b411e6f39923203b003351223300248920b8be3cb7f1e387578d37da01adaa3186e9814e6557c1ee9915ac5039eb4277fb00480088848cc00400c0088005ff81d8799fd8799f581c89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43cffd8799fa1d8799fd8799fd87980d8799fd8799f581c1b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59ffd87a80ffffd8799f4040ffff1a001e8480a0a000ffd87c9f9fd8799fd8799fd87a9f464c656e646572ffd87a9f464c656e646572ffd8799f4040ffd87a9f1a04c4b400ffffd87a9fd87a9f464c656e646572ffd87a9fd87a9f48426f72726f776572ffffd8799f4040ffd87a9f1a04c4b400ffd87c9f9fd8799fd8799fd87a9f48426f72726f776572ffd87a9f48426f72726f776572ffd8799f4040ffd87c9fd87a9f1a04c4b400ffd87a9f1a004c4b40ffffffd87a9fd87a9f48426f72726f776572ffd87a9fd87a9f464c656e646572ffffd8799f4040ffd87c9fd87a9f1a04c4b400ffd87a9f1a004c4b40ffffd87980ffffff1b0000018710e273e8d87980ffffffff1b00000187107496e8d87980ffff81840100d87980821a00100af61a1396d150f5f6
        description: ''
        type: TxBodyBabbage


The identifier for the contract is embedded in the response.


```bash
CONTRACT_ID="$(jq -r '.resource.contractId' response-1.json)"
echo "CONTRACT_ID = $CONTRACT_ID"
```

    CONTRACT_ID = bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d#1


The CBOR serialization (in text-envelope format) is also embedded in the response.


```bash
jq '.resource.txBody' response-1.json > tx-1.unsigned
```

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

    TX_1 = bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d


One can view the transaction on a Cardano explorer and see that the contract has been created and the parties have received their role tokens. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_1?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d?tab=utxo


In particular, we see that the Marlowe contract holds the 2 ada that was set as `MINIMUM_LOVELACE`.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --tx-in "$CONTRACT_ID"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d     1        2000000 lovelace + TxOutDatumHash ScriptDataInBabbageEra "cc80fcdc9dedea89d2f50dd29cf7f84d14bd00e27714310a0cfe5e24e87fd008"


One can see that the lender and borrower have received their role tokens. Note that `4c656e646572 = Lender` and `426f72726f776572 = Borrower` in hexadecimal notation.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$LENDER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d     0        995476698 lovelace + TxOutDatumNone
    bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d     3        1034400 lovelace + 1 89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43c.4c656e646572 + TxOutDatumNone



```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$BORROWER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    b8be3cb7f1e387578d37da01adaa3186e9814e6557c1ee9915ac5039eb4277fb     2        1000000000 lovelace + TxOutDatumNone
    bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d     2        1043020 lovelace + 1 89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43c.426f72726f776572 + TxOutDatumNone


## View the details of the contract on the blockchain

Marlowe Runtime\'s `HTTP` `GET` endpoint `/contracts/{contractId}` can fetch a contract from the blockchain and return information about it.


```bash
CONTRACT_URL="$MARLOWE_RT_WEBSERVER_URL/`jq -r '.links.contract' response-1.json`"
echo "CONTRACT_URL = $CONTRACT_URL"
```

    CONTRACT_URL = http://127.0.0.1:3780/contracts/bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d%231



```bash
curl -sS "$CONTRACT_URL" | json2yaml
```

    links:
      transactions: contracts/bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d%231/transactions
    resource:
      block:
        blockHeaderHash: 4f1c23e34773b2780bb4507770740fb9ef569d38e08e8c6006964f3d71677529
        blockNo: 755129
        slotNo: 23921744
      continuations: null
      contractId: bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d#1
      currentContract:
        timeout: 1679608289000
        timeout_continuation: close
        when:
        - case:
            deposits: 80000000
            into_account:
              role_token: Lender
            of_token:
              currency_symbol: ''
              token_name: ''
            party:
              role_token: Lender
          then:
            from_account:
              role_token: Lender
            pay: 80000000
            then:
              timeout: 1679615489000
              timeout_continuation: close
              when:
              - case:
                  deposits:
                    add: 80000000
                    and: 5000000
                  into_account:
                    role_token: Borrower
                  of_token:
                    currency_symbol: ''
                    token_name: ''
                  party:
                    role_token: Borrower
                then:
                  from_account:
                    role_token: Borrower
                  pay:
                    add: 80000000
                    and: 5000000
                  then: close
                  to:
                    party:
                      role_token: Lender
                  token:
                    currency_symbol: ''
                    token_name: ''
            to:
              party:
                role_token: Borrower
            token:
              currency_symbol: ''
              token_name: ''
      initialContract:
        timeout: 1679608289000
        timeout_continuation: close
        when:
        - case:
            deposits: 80000000
            into_account:
              role_token: Lender
            of_token:
              currency_symbol: ''
              token_name: ''
            party:
              role_token: Lender
          then:
            from_account:
              role_token: Lender
            pay: 80000000
            then:
              timeout: 1679615489000
              timeout_continuation: close
              when:
              - case:
                  deposits:
                    add: 80000000
                    and: 5000000
                  into_account:
                    role_token: Borrower
                  of_token:
                    currency_symbol: ''
                    token_name: ''
                  party:
                    role_token: Borrower
                then:
                  from_account:
                    role_token: Borrower
                  pay:
                    add: 80000000
                    and: 5000000
                  then: close
                  to:
                    party:
                      role_token: Lender
                  token:
                    currency_symbol: ''
                    token_name: ''
            to:
              party:
                role_token: Borrower
            token:
              currency_symbol: ''
              token_name: ''
      metadata: {}
      roleTokenMintingPolicyId: 89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43c
      state:
        accounts:
        - - - address: addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck
            - currency_symbol: ''
              token_name: ''
          - 2000000
        boundValues: []
        choices: []
        minTime: 0
      status: confirmed
      tags: {}
      txBody: null
      utxo: bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d#1
      version: v1


## Transaction 2. The lender deposits the principal

The lender deposits their 80 ada of principal into the contract using Marlowe Runtime\'s `HTTP` `POST` `/contract/{contractId}/transactions` endpoint. The lender is providing the funding for and receiving the change from this transaction, so we provide their address.

The deposit is represented as JSON input to the contract. The `marlowe-cli input deposit` tool conveniently formats the correct JSON for a deposit.


```bash
marlowe-cli input deposit --help
```

    Usage: marlowe-cli input deposit --deposit-account PARTY --deposit-party PARTY 
                                     [--deposit-token TOKEN]
                                     --deposit-amount INTEGER 
                                     [--out-file OUTPUT_FILE]
    
      Create Marlowe input for a deposit.
    
    Available options:
      --deposit-account PARTY  The account for the deposit.
      --deposit-party PARTY    The party making the deposit.
      --deposit-token TOKEN    The token being deposited, if not Ada.
      --deposit-amount INTEGER The amount of token being deposited.
      --out-file OUTPUT_FILE   JSON output file for contract input.
      -h,--help                Show this help text



```bash
marlowe-cli input deposit \
  --deposit-party Lender \
  --deposit-account Lender \
  --deposit-amount "$PRINCIPAL" \
  --out-file input-2.json
json2yaml input-2.json
```

    input_from_party:
      role_token: Lender
    into_account:
      role_token: Lender
    of_token:
      currency_symbol: ''
      token_name: ''
    that_deposits: 80000000


This input is included in the JSON request.


```bash
yaml2json << EOI > request-2.json
version: v1
inputs: [$(cat input-2.json)]
metadata: {}
tags: {}
EOI
cat request-2.json
```

    {"inputs":[{"input_from_party":{"role_token":"Lender"},"into_account":{"role_token":"Lender"},"of_token":{"currency_symbol":"","token_name":""},"that_deposits":80000000}],"metadata":{},"tags":{},"version":"v1"}


Next we post the request and store the response.


```bash
curl "$CONTRACT_URL/transactions" \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-Change-Address: $LENDER_ADDR" \
  -d @request-2.json \
  -o response-2.json \
  -sS
json2yaml response-2.json
```

    links:
      transaction: contracts/bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d%231/transactions/088395d43bd1aefc7a5b1dc41b472a74f59cca631a61af7c9a212c5c8fa56c14
    resource:
      contractId: bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d#1
      transactionId: 088395d43bd1aefc7a5b1dc41b472a74f59cca631a61af7c9a212c5c8fa56c14
      txBody:
        cborHex: 86aa0083825820bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d00825820bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d01825820bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d030d81825820bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d0012818258209a8a6f387a3330b4141e1cb019380b9ac5c72151c0abc52aa4266245d3c555cd010184a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a36844ba7a300581d702ed2631dbb277c84334453c5c437b86325d371f0835a28b910a91a6e011a001e848002820058206db2f6b791dcab9fca1b17ccfe35d0a486c260fc300c48d14e24f78e90da6b86a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc5901821a000fc8a0a1581c89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43ca1464c656e64657201a300581d70e165610232235bbbbeff5b998b233daae42979dec92a6722d9cda989011a04c4b400028200582012548b4001cc30918dc86060c05d1cafe4457ec1e9f0e271d022cd1edddd814f10a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a3b429d0d111a001327cd021a000cc533031a016d1161081a016d055e0b5820018b0e334b65db78e2e0b629a27f61d4678240ffa768133f31987e5e511bbbc69fff83d8799f581c89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43c48426f72726f776572ffd8799fd8799f581c89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43cffd8799fa1d8799fd8799fd87980d8799fd8799f581c1b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59ffd87a80ffffd8799f4040ffff1a001e8480a0a01b000001871045ab30ffd87c9f9fd8799fd8799fd87a9f48426f72726f776572ffd87a9f48426f72726f776572ffd8799f4040ffd87c9fd87a9f1a04c4b400ffd87a9f1a004c4b40ffffffd87a9fd87a9f48426f72726f776572ffd87a9fd87a9f464c656e646572ffffd8799f4040ffd87c9fd87a9f1a04c4b400ffd87a9f1a004c4b40ffffd87980ffffff1b0000018710e273e8d87980ffffd8799fd8799f581c89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43cffd8799fa1d8799fd8799fd87980d8799fd8799f581c1b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59ffd87a80ffffd8799f4040ffff1a001e8480a0a000ffd87c9f9fd8799fd8799fd87a9f464c656e646572ffd87a9f464c656e646572ffd8799f4040ffd87a9f1a04c4b400ffffd87a9fd87a9f464c656e646572ffd87a9fd87a9f48426f72726f776572ffffd8799f4040ffd87a9f1a04c4b400ffd87c9f9fd8799fd8799fd87a9f48426f72726f776572ffd87a9f48426f72726f776572ffd8799f4040ffd87c9fd87a9f1a04c4b400ffd87a9f1a004c4b40ffffffd87a9fd87a9f48426f72726f776572ffd87a9fd87a9f464c656e646572ffffd8799f4040ffd87c9fd87a9f1a04c4b400ffd87a9f1a004c4b40ffffd87980ffffff1b0000018710e273e8d87980ffffffff1b00000187107496e8d87980ffff818400019fd8799fd8799fd87a9f464c656e646572ffd87a9f464c656e646572ffd8799f4040ff1a04c4b400ffffff821a007969e61a7c375fbdf5f6
        description: ''
        type: TxBodyBabbage


Once again, use `marlowe-cli` to submit the transaction and then wait for confirmation.


```bash
jq '.resource.txBody' response-2.json > tx-2.unsigned
```


```bash
TX_2=$(
marlowe-cli transaction submit \
  --tx-body-file tx-2.unsigned \
  --required-signer "$LENDER_SKEY" \
  --timeout 600 \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_2 = $TX_2"
```

    TX_2 = 088395d43bd1aefc7a5b1dc41b472a74f59cca631a61af7c9a212c5c8fa56c14


One can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_2?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/088395d43bd1aefc7a5b1dc41b472a74f59cca631a61af7c9a212c5c8fa56c14?tab=utxo


One can see that the lender has approximately 83 ada less than originally. Two ada were deposited in the contract when it was created and 80 ada were paid to the borrower in the second transaction; another 1 ada was attached to the role token that was sent to the borrower. The lender also holds their own role token.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$LENDER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    088395d43bd1aefc7a5b1dc41b472a74f59cca631a61af7c9a212c5c8fa56c14     0        914639783 lovelace + TxOutDatumNone
    088395d43bd1aefc7a5b1dc41b472a74f59cca631a61af7c9a212c5c8fa56c14     2        1034400 lovelace + 1 89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43c.4c656e646572 + TxOutDatumNone


The Marlowe contract still has the 2 ada from its creation.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --tx-in "$TX_2#1"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    088395d43bd1aefc7a5b1dc41b472a74f59cca631a61af7c9a212c5c8fa56c14     1        2000000 lovelace + TxOutDatumHash ScriptDataInBabbageEra "6db2f6b791dcab9fca1b17ccfe35d0a486c260fc300c48d14e24f78e90da6b86"


Marlowe\'s role-payout address holds the 80 ada on behalf of the borrower.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --tx-in "$TX_2#3"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    088395d43bd1aefc7a5b1dc41b472a74f59cca631a61af7c9a212c5c8fa56c14     3        80000000 lovelace + TxOutDatumHash ScriptDataInBabbageEra "12548b4001cc30918dc86060c05d1cafe4457ec1e9f0e271d022cd1edddd814f"


## View the further progress of the contract on the blockchain

Marlowe Runtime\'s `HTTP` `GET` endpoint `/contracts/{contractId}/transactions/{transactionId}` can fetch a contract from the blockchain and return information about it.


```bash
curl -sS "$CONTRACT_URL"/transactions/"$TX_2" | json2yaml
```

    links: {}
    resource:
      block:
        blockHeaderHash: 63ffbfd04ef1c76a2209ec29d9f512e39717aecb6715ae89c9901513a9317d2b
        blockNo: 755144
        slotNo: 23922080
      consumingTx: null
      continuations: null
      contractId: bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d#1
      inputUtxo: bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d#1
      inputs:
      - input_from_party:
          role_token: Lender
        into_account:
          role_token: Lender
        of_token:
          currency_symbol: ''
          token_name: ''
        that_deposits: 80000000
      invalidBefore: 2023-03-23T21:00:14Z
      invalidHereafter: 2023-03-23T21:51:29Z
      metadata: {}
      outputContract:
        timeout: 1679615489000
        timeout_continuation: close
        when:
        - case:
            deposits:
              add: 80000000
              and: 5000000
            into_account:
              role_token: Borrower
            of_token:
              currency_symbol: ''
              token_name: ''
            party:
              role_token: Borrower
          then:
            from_account:
              role_token: Borrower
            pay:
              add: 80000000
              and: 5000000
            then: close
            to:
              party:
                role_token: Lender
            token:
              currency_symbol: ''
              token_name: ''
      outputState:
        accounts:
        - - - address: addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck
            - currency_symbol: ''
              token_name: ''
          - 2000000
        boundValues: []
        choices: []
        minTime: 1679605214000
      outputUtxo: 088395d43bd1aefc7a5b1dc41b472a74f59cca631a61af7c9a212c5c8fa56c14#1
      status: confirmed
      tags: {}
      transactionId: 088395d43bd1aefc7a5b1dc41b472a74f59cca631a61af7c9a212c5c8fa56c14
      txBody: null


## Transaction 3. The borrower withdraws the principal

The principal of 80 ada is held at Marlowe's role-payout address for the benefit of the borrower. The borrower can withdraw these funds at any time. The contract ID and role name are included in the request body for a withdrawal.


```bash
yaml2json << EOI > request-3.json
contractId: "$CONTRACT_ID"
role: Borrower
EOI
cat request-3.json
```

    {"contractId":"bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d#1","role":"Borrower"}


Next we post the request and store the response.


```bash
curl "$MARLOWE_RT_WEBSERVER_URL/withdrawals" \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-Change-Address: $BORROWER_ADDR" \
  -d @request-3.json \
  -o response-3.json \
  -sS
json2yaml response-3.json
```

    links:
      withdrawal: withdrawals/186e94a9721b90a980171ac8b6c69553bfd18fb72ef7eab5184f921b01ea90ad
    resource:
      txBody:
        cborHex: 86a80083825820088395d43bd1aefc7a5b1dc41b472a74f59cca631a61af7c9a212c5c8fa56c1403825820b8be3cb7f1e387578d37da01adaa3186e9814e6557c1ee9915ac5039eb4277fb02825820bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d020d81825820b8be3cb7f1e387578d37da01adaa3186e9814e6557c1ee9915ac5039eb4277fb0212818258209a8a6f387a3330b4141e1cb019380b9ac5c72151c0abc52aa4266245d3c555cd020182a200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a1011a405a5e50a200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a101821a000fea4ca1581c89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43ca148426f72726f7765720110a200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a1011a3b931a78111a0007af88021a00051fb00b58208558da947714b89978d96dc272163b76a766b6c9d1ee06e39cdb5c41f7247d589fff81d8799f581c89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43c48426f72726f776572ff81840000d87980821a001c64b21a1eb3e9a8f5f6
        description: ''
        type: TxBodyBabbage
      withdrawalId: 186e94a9721b90a980171ac8b6c69553bfd18fb72ef7eab5184f921b01ea90ad


Once again, use `marlowe-cli` to submit the transaction and then wait for confirmation.


```bash
jq '.resource.txBody' response-3.json > tx-3.unsigned
```


```bash
TX_3=$(
marlowe-cli transaction submit \
  --tx-body-file tx-3.unsigned \
  --required-signer "$BORROWER_SKEY" \
  --timeout 600 \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_3 = $TX_3"
```

    TX_3 = 186e94a9721b90a980171ac8b6c69553bfd18fb72ef7eab5184f921b01ea90ad


On can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_3?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/186e94a9721b90a980171ac8b6c69553bfd18fb72ef7eab5184f921b01ea90ad?tab=utxo


The borrower now has about an additional 80 ada (the loan's principal). The borrower also holds their own role token.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$BORROWER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    186e94a9721b90a980171ac8b6c69553bfd18fb72ef7eab5184f921b01ea90ad     0        1079664208 lovelace + TxOutDatumNone
    186e94a9721b90a980171ac8b6c69553bfd18fb72ef7eab5184f921b01ea90ad     1        1043020 lovelace + 1 89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43c.426f72726f776572 + TxOutDatumNone


## Transaction 4. The borrower repays the loan

After some time passes, the borrower repays principal plus interest. Thus, they fund the transaction and receive the change at their address.

First build the input to deposit the funds to the contract.


```bash
marlowe-cli input deposit \
  --deposit-party Borrower \
  --deposit-account Borrower \
  --deposit-amount "$((PRINCIPAL+INTEREST))" \
  --out-file input-4.json
json2yaml input-4.json
```

    input_from_party:
      role_token: Borrower
    into_account:
      role_token: Borrower
    of_token:
      currency_symbol: ''
      token_name: ''
    that_deposits: 85000000


Next build the request.


```bash
yaml2json << EOI > request-4.json
version: v1
inputs: [$(cat input-4.json)]
metadata: {}
tags: {}
EOI
cat request-4.json
```

    {"inputs":[{"input_from_party":{"role_token":"Borrower"},"into_account":{"role_token":"Borrower"},"of_token":{"currency_symbol":"","token_name":""},"that_deposits":85000000}],"metadata":{},"tags":{},"version":"v1"}


Now post the request to Marlowe Runtime.


```bash
curl "$CONTRACT_URL/transactions" \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-Change-Address: $BORROWER_ADDR" \
  -d @request-4.json \
  -o response-4.json \
  -sS
json2yaml response-4.json
```

    links:
      transaction: contracts/bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d%231/transactions/d08277e718607803947c16d13d6ba78a464d48667cb08f199fbf3257791f7047
    resource:
      contractId: bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d#1
      transactionId: d08277e718607803947c16d13d6ba78a464d48667cb08f199fbf3257791f7047
      txBody:
        cborHex: 86aa0083825820088395d43bd1aefc7a5b1dc41b472a74f59cca631a61af7c9a212c5c8fa56c1401825820186e94a9721b90a980171ac8b6c69553bfd18fb72ef7eab5184f921b01ea90ad00825820186e94a9721b90a980171ac8b6c69553bfd18fb72ef7eab5184f921b01ea90ad010d81825820186e94a9721b90a980171ac8b6c69553bfd18fb72ef7eab5184f921b01ea90ad0012818258209a8a6f387a3330b4141e1cb019380b9ac5c72151c0abc52aa4266245d3c555cd010184a200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a1011a3b3f4709a200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a101821a000fea4ca1581c89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43ca148426f72726f77657201a300581d70e165610232235bbbbeff5b998b233daae42979dec92a6722d9cda989011a0510ff400282005820e339bd7d8c4dad56433ece9812d8ca16fd29544aa2246450f53a9b7bfb73775fa200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a001e848010a200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a1011a404b3a45111a000f240b021a000a1807031a016d2d81081a016d07020b5820a94bc10fd79291ec75b2f87e7f5c0fd61ede4cb671aad1cf7169ed0cd9754bb19fff82d8799fd8799f581c89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43cffd8799fa1d8799fd8799fd87980d8799fd8799f581c1b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59ffd87a80ffffd8799f4040ffff1a001e8480a0a01b000001871045ab30ffd87c9f9fd8799fd8799fd87a9f48426f72726f776572ffd87a9f48426f72726f776572ffd8799f4040ffd87c9fd87a9f1a04c4b400ffd87a9f1a004c4b40ffffffd87a9fd87a9f48426f72726f776572ffd87a9fd87a9f464c656e646572ffffd8799f4040ffd87c9fd87a9f1a04c4b400ffd87a9f1a004c4b40ffffd87980ffffff1b0000018710e273e8d87980ffffd8799f581c89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43c464c656e646572ff818400009fd8799fd8799fd87a9f48426f72726f776572ffd87a9f48426f72726f776572ffd8799f4040ff1a0510ff40ffffff821a0059d4c01a5c4f04d6f5f6
        description: ''
        type: TxBodyBabbage


Once again, use `marlowe-cli` to submit the transaction and then wait for confirmation.


```bash
jq '.resource.txBody' response-4.json > tx-4.unsigned
```


```bash
TX_4=$(
marlowe-cli transaction submit \
  --tx-body-file tx-4.unsigned \
  --required-signer "$BORROWER_SKEY" \
  --timeout 600 \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_4 = $TX_4"
```

    TX_4 = d08277e718607803947c16d13d6ba78a464d48667cb08f199fbf3257791f7047


One can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_4?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/d08277e718607803947c16d13d6ba78a464d48667cb08f199fbf3257791f7047?tab=utxo


The borrower now has a total of about 5 ada (the loan's interest) less than originally.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$BORROWER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    d08277e718607803947c16d13d6ba78a464d48667cb08f199fbf3257791f7047     0        994002697 lovelace + TxOutDatumNone
    d08277e718607803947c16d13d6ba78a464d48667cb08f199fbf3257791f7047     1        1043020 lovelace + 1 89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43c.426f72726f776572 + TxOutDatumNone


The 85 ada are at Marlowe\'s role-payout address, held for the benefit of the lender.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --tx-in "$TX_4#2"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    d08277e718607803947c16d13d6ba78a464d48667cb08f199fbf3257791f7047     2        85000000 lovelace + TxOutDatumHash ScriptDataInBabbageEra "e339bd7d8c4dad56433ece9812d8ca16fd29544aa2246450f53a9b7bfb73775f"


The Marlowe contract has closed, so there is no output to its script address.

## View the completion of the contract on the blockchain

Marlowe Runtime\'s `HTTP` `GET` endpoint `/contracts/{contractId}/transactions/{transactionId}` can fetch a contract from the blockchain and return information about it.


```bash
curl -sS "$CONTRACT_URL"/transactions/"$TX_4" | json2yaml
```

    links:
      previous: contracts/bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d%231/transactions/088395d43bd1aefc7a5b1dc41b472a74f59cca631a61af7c9a212c5c8fa56c14
    resource:
      block:
        blockHeaderHash: eb0c3b71748c48f4e11d57f79999f32b76389b3d393626f7a25cd182942e9952
        blockNo: 755163
        slotNo: 23922472
      consumingTx: null
      continuations: null
      contractId: bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d#1
      inputUtxo: 088395d43bd1aefc7a5b1dc41b472a74f59cca631a61af7c9a212c5c8fa56c14#1
      inputs:
      - input_from_party:
          role_token: Borrower
        into_account:
          role_token: Borrower
        of_token:
          currency_symbol: ''
          token_name: ''
        that_deposits: 85000000
      invalidBefore: 2023-03-23T21:07:14Z
      invalidHereafter: 2023-03-23T23:51:29Z
      metadata: {}
      outputContract: null
      outputState: null
      outputUtxo: null
      status: confirmed
      tags: {}
      transactionId: d08277e718607803947c16d13d6ba78a464d48667cb08f199fbf3257791f7047
      txBody: null


## Transaction 5. The lender withdraws their principal and interest

Here again we withdraw funds from the Marlowe role-payout address.


```bash
yaml2json << EOI > request-5.json
contractId: "$CONTRACT_ID"
role: Lender
EOI
cat request-5.json
```

    {"contractId":"bfb6db4bdf59113c4bdd45d45c7f94070099b813e83b665b5cdc6daeb91a941d#1","role":"Lender"}


Next we post the request and store the response.


```bash
curl "$MARLOWE_RT_WEBSERVER_URL/withdrawals" \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-Change-Address: $LENDER_ADDR" \
  -d @request-5.json \
  -o response-5.json \
  -sS
json2yaml response-5.json
```

    links:
      withdrawal: withdrawals/32487203bba96c85e34345e8f88fc60dfb12dac4fb89decf144b86287a1a65e6
    resource:
      txBody:
        cborHex: 86a80083825820088395d43bd1aefc7a5b1dc41b472a74f59cca631a61af7c9a212c5c8fa56c1400825820088395d43bd1aefc7a5b1dc41b472a74f59cca631a61af7c9a212c5c8fa56c1402825820d08277e718607803947c16d13d6ba78a464d48667cb08f199fbf3257791f7047020d81825820088395d43bd1aefc7a5b1dc41b472a74f59cca631a61af7c9a212c5c8fa56c140012818258209a8a6f387a3330b4141e1cb019380b9ac5c72151c0abc52aa4266245d3c555cd020182a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a3b903bc5a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc5901821a000fc8a0a1581c89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43ca1464c656e6465720110a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a367cb4f4111a000796b3021a00050f220b5820499b9851886e239567b2594375fe9ec5857dd60c60bd3251b2ebe39cf6e834bd9fff81d8799f581c89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43c464c656e646572ff81840002d87980821a001b8ea21a1df5686ff5f6
        description: ''
        type: TxBodyBabbage
      withdrawalId: 32487203bba96c85e34345e8f88fc60dfb12dac4fb89decf144b86287a1a65e6


Once again, use `marlowe-cli` to submit the transaction and then wait for confirmation.


```bash
jq '.resource.txBody' response-5.json > tx-5.unsigned
```


```bash
TX_5=$(
marlowe-cli transaction submit \
  --tx-body-file tx-5.unsigned \
  --required-signer "$LENDER_SKEY" \
  --timeout 600 \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_5 = $TX_5"
```

    TX_5 = 32487203bba96c85e34345e8f88fc60dfb12dac4fb89decf144b86287a1a65e6


One can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_5?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/32487203bba96c85e34345e8f88fc60dfb12dac4fb89decf144b86287a1a65e6?tab=utxo


The lender now has an additional 5 ada (the loan's interest), minus fees, compared to their original balance before the contract started.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$LENDER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    32487203bba96c85e34345e8f88fc60dfb12dac4fb89decf144b86287a1a65e6     0        999308229 lovelace + TxOutDatumNone
    32487203bba96c85e34345e8f88fc60dfb12dac4fb89decf144b86287a1a65e6     1        1034400 lovelace + 1 89506f74616aa4b5a42ec352a56ab7815e547e23e2a32417f400e43c.4c656e646572 + TxOutDatumNone
    d08277e718607803947c16d13d6ba78a464d48667cb08f199fbf3257791f7047     3        2000000 lovelace + TxOutDatumNone


## *Appendix:* OpenAPI Description of Marlowe Web Services

Here is how to obtain the OpenAPI description of endpoints and types provided by `marlowe-web-server`.


```bash
curl -sS "$MARLOWE_RT_WEBSERVER_URL/openapi.json" | json2yaml | head -n 20
```

    components:
      schemas:
        Action:
          description: A contract which becomes active when an action occurs.
          oneOf:
          - properties:
              deposits:
                $ref: '#/components/schemas/Value'
              into_account:
                $ref: '#/components/schemas/Party'
              of_token:
                $ref: '#/components/schemas/Token'
              party:
                $ref: '#/components/schemas/Party'
            required:
            - party
            - deposits
            - of_token
            - into_account
            type: object


It is also available at https://marlowe-finance.io/docs/development/runtime-rest-api/.

![Marlowe Runtime OpenAPI](/img/openapi.png)
