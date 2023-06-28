---
title: Deployment options
sidebar_position: 2
---

There are two methods available for deploying Marlowe Runtime, the application backend for managing Marlowe contracts on the Cardano blockchain. The first method is a hosted solution that requires no installation. The second method is self-hosting, which requires more time and effort. 

## 1. No-Installation deployment

Through the cloud-hosted Marlowe Runtime extension in **[demeter.run](https://demeter.run)**, you can use Marlowe without installing any software. This is the simplest and fastest approach. Even if you intend eventually to deploy your own self-hosted instance of Marlowe Runtime, consider trying out **[demeter.run](https://demeter.run)** first just so you can quickly experience Marlowe smart contracts with minimal effort. 

## 2. Self-hosted deployment with Docker and Linux

Alternatively, you can run your own Docker containers locally for Marlowe Runtime. If you choose this approach, it is highly recommended that you deploy on Linux; Marlowe Runtime has been tested with Linux. Other platforms are not yet supported. 

:::tip 

Check back here later for information on planned non-Linux deployments when they become available. 

:::

### [Tutorials > Playbooks > Deploying Marlowe Runtime](../../tutorials/playbooks/deploying-marlowe-runtime)

### Time required to sync public mainnet, preprod or preview network node

When first setting up your mainnet, preprod, or preview network node, it may take several hours or days for it to sync, depending up the capabilities of the hardware where it is deployed. Unless you have fast SSDs, you may experience slow sync times. Until the syncing gets up to the point where Marlowe contracts have hit the preview node, the "block" table in the "marlowe" schema will be empty. After block number 7791724 (mainnet), 224384 (preprod), or 39646 (preview), you will start to see data in the block table. It is important to be aware that you won’t get up and running on mainnet within a matter of one or two hours. The initial sync time requires some patience. 

