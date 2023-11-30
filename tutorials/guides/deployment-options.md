---
title: Deployment options
sidebar_position: 0
---

There are three methods available for deploying **[Marlowe Runtime services](/docs/platform-and-architecture/architecture)**, the application backend for managing Marlowe contracts on the Cardano blockchain. 

The three deployment approaches are: 

1. Hosted deployment (OS independent, web-based)
2. Local deployment using Docker only (OS independent, Intel-based architecture, Windows, Linux or Mac)
3. Local deployment using a combination of Docker and Nix (Linux only)

:::info

ARM-based architecture is not supported at this time. This includes Apple M1 and M2 machines.

:::

## Hosted deployment

The simplest and fastest deployment method is to use the hosted service provided by **[Demeter.run](https://demeter.run/)**. 

   * This method is not tied to any specific platform 
   * The only system requirement is a browser 
   * It only takes a few minutes to get started 

The **[Demeter.run](https://demeter.run/)** web3 development platform provides a number of extensions. The following two extensions must be enabled for Marlowe Runtime services: 

   * Cardano Marlowe Runtime Extension
   * Cardano Node Extension

Together, these two extensions provide the Marlowe Runtime backend services and a Cardano node, so you don't need to set environment variables, install tools, run the full stack of backend services yourself locally, or wait for the Cardano node to sync. 

For details and step-by-step guidance, please see the **[Demeter run deployment document](https://github.com/input-output-hk/marlowe-starter-kit/blob/main/docs/demeter-run.md)** in the Marlowe starter kit. 

Additionally, you can watch a **[brief video walkthrough (2:32)](https://youtu.be/XnZ8gCjpl1E)** of the process.

## Local deployment using Docker only

You can deploy **[Marlowe Runtime services](/docs/platform-and-architecture/architecture)**, Jupyter notebooks and a Cardano node locally through Docker. This workflow runs everything in Docker containers. 

   * Requires Intel-based architecture
   * Requires local installation of Docker
   * Requires significant system resources on your local machine 
      * See **[Recommended Resources for Deploying Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/resources.md)**
   * May take several hours or more to initially sync the Cardano node

For more details, please see **[Local deploys with Docker](https://github.com/input-output-hk/marlowe-starter-kit/blob/main/docs/docker.md)** in the Marlowe starter kit. 

## Local deployment using a combination of Docker and Nix

You can deploy **[Marlowe Runtime services](/docs/platform-and-architecture/architecture)** and a Cardano node in Docker, combined with using a Nix shell to run the Jupyter notebooks from the HOST and set up all the required tools and environment variables. 

   * Requires Linux
   * Requires local installation of Docker
   * Requires Nix

For details, please see the section *Runtime deploy with Docker + Jupyter notebook with nix* in the document **[Local deploys with Docker](https://github.com/input-output-hk/marlowe-starter-kit/blob/main/docs/docker.md#runtime-deploy-with-docker--jupyter-notebook-with-nix)** in the Marlowe starter kit. 

## Time required to sync public mainnet, preprod or preview network node

The time required to initially sync the Cardano node varies by a factor of ten, depending on the hardware environment you are using. Unless you have fast SSDs, you may experience slow sync times. The time required to sync on preview or preprod networks can be as little as 20 minutes up to several hours or more. The time required to initially sync on mainnet can vary from as little as 14 hours up to multiple days. 

Until the syncing gets up to the point where Marlowe contracts have hit the preview node, the "block" table in the "marlowe" schema will be empty. After block number 7791724 (mainnet), 224384 (preprod), or 39646 (preview), you will start to see data in the block table. It is important to be aware that you won’t get up and running on mainnet within a matter of one or two hours. The initial sync time requires some patience. 

