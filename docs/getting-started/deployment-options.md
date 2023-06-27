---
title: Deployment options
sidebar_position: 1
---

There are two methods available for deploying Marlowe Runtime, the application backend for managing Marlowe contracts on the Cardano blockchain. The first is a hosted solution that requires no installation. The second is deploying locally, which requires more time and effort. 

## 1. Fastest deployment method

Through the cloud-hosted Marlowe Runtime extension in **[demeter.run](https://demeter.run)**, you can use Marlowe without installing any software. This is the simplest and fastest approach. Even if you intend to deploy your own instance of Marlowe Runtime locally, consider trying out **[demeter.run](https://demeter.run)** first just so you can quickly experience Marlowe smart contracts with minimal effort. 

## 2. Local deployment with Docker and Linux

Alternatively, you can run your own Docker containers locally for Marlowe Runtime. If you choose this approach, it is highly recommended that you deploy on Linux; Marlowe Runtime has been tested with Linux. Other platforms are not yet supported. The Marlowe roadmap provides for more deployment options looking ahead. 

* **[Tutorials > Playbooks > Deploying Marlowe Runtime](../../tutorials/playbooks/deploy-marlowe-runtime)**

### Time required to sync preview node

When first setting up your preview node, it may take several days for it to sync. Unless you have fast SSDs, you may experience slow sync times. Until the syncing gets up to the point where Marlowe contracts have hit the preview node, the block table in the Marlowe schema will be empty. Once you get to **slot 70 million (verify number)**, you will start to see data in the block table. It is important to be aware that you won’t get up and running on mainnet within a matter of one or two hours. The initial sync time requires some patience. 

