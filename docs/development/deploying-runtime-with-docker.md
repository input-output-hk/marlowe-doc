---
title: Deploying Runtime with Docker
sidebar_position: 1
---

To install and deploy Marlowe Runtime backend services, please refer to the following instructions: 

## Deploying using Docker

There is a `docker compose` setup designed to give a local developer mode of the marlowe runtime components,
configured in link:./nix/dev/compose.nix[`compose.nix`].

Currently, this only supports Linux systems.

On Linux, `compose.yaml` will be automatically set up for the user when entering `nix develop`.

Running `nix run .#re-up` will refresh `compose.yaml` if need be and then restart any services which have changed.

Services currently included:

* `marlowe-chain-sync`: `marlowe-chain-sync` for the `preprod` network.
* `marlowe-chain-indexer`: `marlowe-chain-indexer` for the `preprod` network.
* `node`: A node for the `preprod` network.
* `postgres`: A postgres instance, for marlowe-chain-sync state.
* `marlowe--sync`: `marlowe-sync` for the `preprod` network.
* `marlowe--indexer`: `marlowe-indexer` for the `preprod` network.
* `marlowe-tx`: A `marlowe-tx` instance.
* `marlowe-proxy`: A `marlowe-proxy` instance.
* `web`: A `marlowe-web-server` instance.

The following commands may be useful:

* `docker compose exec postgres /exec/run-sqitch`: Run the `sqitch` migrations for the chain-sync database.
* `docker compose exec postgres psql -U postgres -d chain`: Run `psql` in the `chain` database.
* `docker compose port`, e.g. `docker compose port web 8080` will show the local port that maps to port `8080` for the `web` service

### Accessing the node socket

The node socket file lives inside a Docker volume. Because it is created by the container, it is owned by root, and needs elevated permissions (via `sudo`) to use -- keep this in mind when using it locally with a tool like `cardano-cli`.

To list your Docker volumes, use the command `docker volume ls`. The socket lives in the `marlowe-cardano_shared` volume. Use
`docker volume inspect marlowe-cardano_shared` to obtain information about the volume. The `Mountpoint` property shows the directory on the host machine that maps to the volume (one-liner: `docker volume inspect marlowe-cardano_shared | jq -r '.[].Mountpoint'`)

To use this with `cardano-cli`:

```
export CARDANO_NODE_SOCKET_PATH=$(docker volume inspect marlowe-cardano_shared | jq -r '.[].Mountpoint')
# -E passes the current environment to sudo
sudo -E cardano-cli ...
```
