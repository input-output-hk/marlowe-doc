import React from 'react';

import styles from './styles.module.scss';

export interface ContractCard {
  name: string;
  description: string;
  color: string;
  link: string;
}

var galleryNFTItems: ContractCard[] = [
  {
    name: "Sale of token for ada",
    description: "The seller deposits a token in a Marlowe contract and the buyer purchases it with ada.",
    color: "#511CF7",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/nfts/simple/ReadMe.ipynb",
  },
  {
    name: "Sale of a token for stablecoins",
    description: "The sellet deposits a token in a Marlowe contract and the buyer purchases it with Djed or iUSD.",
    color: "#511CF7",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/nfts/stable/ReadMe.ipynb",
  },
  {
    name: "Sale of a token with royalties",
    description: "The artist receives royalties when the buyer purchases a token from a seller.",
    color: "#511CF7",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/nfts/royalty/ReadMe.ipynb",
  },
  {
    name: "Swap of tokens for tokens",
    description: "Two parties each deposit tokens and receive each others' tokens upon settlement.",
    color: "#511CF7",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/nfts/swap/ReadMe.ipynb",
  },
  {
    name: "Small airdrop of tokens",
    description: "Several parties receive an airdrop of tokens at a predetermined time.",
    color: "#511CF7",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/nfts/airdrop/ReadMe.ipynb",
  },
  {
    name: "Several NFTs bundled as a collective NFT",
    description: "A Marlowe contract that is itself an NFT bundles several other NFTs into a smart NFT.",
    color: "#511CF7",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/nfts/collection/ReadMe.ipynb",
  },
  {
    name: "Shared ownership of an NFT",
    description: "Several parties jointly purchase an NFT, with an option for one party to buy it from the others.",
    color: "#511CF7",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/nfts/shared/ReadMe.ipynb",
  },
  {
    name: "NFT used as collateral for a loan",
    description: "An NFT is deposited as a collateral for a loan, and lost if the loan is not repaid on time.",
    color: "#511CF7",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/nfts/collateral/ReadMe.ipynb",
  },
  {
    name: "Pawning a token for a stablecoin",
    description: "An NFT is pawned for iUSD, and the shop has the option to keep the token unless it is redeemed.",
    color: "#511CF7",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/nfts/pawn/ReadMe.ipynb",
  },
  {
    name: "Token sale with oracle",
    description: "Tokens are sold for ada, where a price oracle sets the exchange rate.",
    color: "#511CF7",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/nfts/oracle/ReadMe.ipynb",
  },
  {
    name: "Auction of an NFT",
    description: "An English auction is held to sell an NFT to the highest bidder.",
    color: "#511CF7",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/nfts/auction/ReadMe.ipynb",
  },
];

var galleryFinanceItems: ContractCard[] = [
  {
    name: "ACTUS contract for principal at maturity",
    description: "Interest is paid periodically for a loan, with the final payment being the principal.",
    color: "#8053FA",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/realfi/actus/actus-pam.ipynb",
  },
  {
    name: "Coupon bond with guarantor",
    description: "An example coupon bond is guaranteed by a third party.",
    color: "#8053FA",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/realfi/coupon-bond-guaranteed/ReadMe.ipynb",
  }
];

var galleryMiscItems: ContractCard[] = [
  {
    name: "A geolocated Marlowe contract",
    description: "Cardano Beam adds geolocation to a Marlowe contract.",
    color: "#9D76FC",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/defi/beamer/ReadMe.ipynb",
  },
];

var galleryFirstItems: ContractCard[] = [
  {
    name: "First peer-to-peer Marlowe loan on mainnet",
    description: "A peer-to-peer installment loan uses a private stablecoin.",
    color: "#C0A4FE",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/firsts/loan/ReadMe.ipynb",
  },
  {
    name: "First reference script execution on mainnet",
    description: "The first Plutus V2 reference script runs on the Cardano mainnet, in the form of a token swap.",
    color: "#C0A4FE",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/firsts/reference/ReadMe.ipynb",
  },
  {
    name: "First Plutus V2 on mainnet",
    description: "The first Plutus V2 script runs on the Cardano mainnet, in the form of a Marlowe airdrop.",
    color: "#C0A4FE",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/firsts/plutus-v2/ReadMe.ipynb",
  },
  {
    name: "First Marlowe token swap on mainnet",
    description: "The first input is applied to a Marlowe contract on the Cardano mainnet.",
    color: "#C0A4FE",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/firsts/swap/ReadMe.ipynb",
  },
  {
    name: "First Marlowe contract on mainnet",
    description: "The first Marlowe contract is executed on the Cardano mainnet.",
    color: "#C0A4FE",
    link: "https://github.com/input-output-hk/real-world-marlowe/blob/main/firsts/mainnet/ReadMe.ipynb",
  },
];

function Gallery(prop) {
  var contracts: ContractCard[];
  switch(prop.type) {
    case "nft": {
      contracts = galleryNFTItems;
      break;
    }
    case "finance": {
      contracts = galleryFinanceItems;
      break;
    }
    case "first": {
      contracts = galleryFirstItems;
      break;
    }
    case "misc": {
      contracts = galleryMiscItems;
      break;
    }
    default: {
      // no-op
    }
  }

  const rows = [...Array(Math.ceil(contracts.length / 3))]
  const galleryRows = rows.map(
    (_, idx) => contracts.slice(idx * 3, idx * 3 + 3)
  );

  const content = galleryRows.map(
    (row, idx) => (
      <div className={styles.row} key={idx}>
        {row.map(contractCard =>
          <div className="col col--4" key={contractCard.name}>
            <div className="card-container">
              <div className={styles.card}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 28V0H28L0 28Z" fill={contractCard.color} />
                </svg>
                <a href={contractCard.link} target="_blank"></a>
                <div className="card__header">
                  <h4>{contractCard.name}</h4>
                </div>
                <div className={styles.body}>
                  <p>{contractCard.description}</p>
                </div>
                <div className="card__footer">
                  <svg width="35" height="41" viewBox="0 0 35 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.4 21.9123C1.4 23.1603 1.304 23.5683 1.04 23.8643C0.752 24.1203 0.384 24.2643 0 24.2643L0.096 24.9763C0.688 24.9843 1.272 24.7763 1.72 24.3843C1.96 24.0883 2.144 23.7443 2.248 23.3763C2.352 23.0083 2.392 22.6243 2.344 22.2403V17.5283H1.392V21.9123H1.4Z" fill="currentColor"/>
                    <path d="M8.52012 21.3444C8.52012 21.8804 8.52012 22.3524 8.56012 22.7684H7.71212L7.65612 21.9204C7.48012 22.2164 7.22412 22.4644 6.92012 22.6404C6.61612 22.8084 6.27212 22.8964 5.92812 22.8884C5.10412 22.8884 4.12012 22.4404 4.12012 20.6084V17.5684H5.07212V20.4164C5.07212 21.4084 5.37612 22.0724 6.24012 22.0724C6.41612 22.0724 6.59212 22.0404 6.76012 21.9764C6.92812 21.9124 7.07212 21.8084 7.20012 21.6884C7.32812 21.5604 7.42412 21.4164 7.48812 21.2484C7.55212 21.0804 7.59212 20.9044 7.58412 20.7284V17.5364H8.53612V21.3204L8.51212 21.3524L8.52012 21.3444Z" fill="currentColor"/>
                    <path d="M10.3281 19.2644C10.3281 18.6004 10.3281 18.0644 10.2881 17.5684H11.1441L11.1841 18.4564C11.3761 18.1364 11.6481 17.8724 11.9761 17.6964C12.3041 17.5204 12.6721 17.4324 13.0481 17.4484C14.3121 17.4484 15.2721 18.5124 15.2721 20.0884C15.2721 21.9524 14.1281 22.8804 12.8881 22.8804C12.5681 22.8964 12.2561 22.8244 11.9761 22.6804C11.6961 22.5364 11.4481 22.3204 11.2721 22.0564V24.9044H10.3281V19.2564V19.2644ZM11.2721 20.6564C11.2721 20.7844 11.2881 20.9124 11.3121 21.0404C11.3921 21.3604 11.5761 21.6404 11.8321 21.8404C12.0881 22.0404 12.4081 22.1524 12.7361 22.1444C13.7441 22.1444 14.3281 21.3284 14.3281 20.1364C14.3281 19.0964 13.7761 18.2084 12.7681 18.2084C12.3681 18.2404 12.0001 18.4164 11.7201 18.7044C11.4401 18.9924 11.2801 19.3684 11.2641 19.7684V20.6564H11.2721Z" fill="currentColor"/>
                    <path d="M16.976 17.5684L18.12 20.6404C18.24 20.9844 18.368 21.3924 18.456 21.7044C18.552 21.3924 18.664 20.9924 18.792 20.6244L19.832 17.5764H20.84L19.416 21.2804C18.704 23.0644 18.272 23.9764 17.616 24.5364C17.288 24.8404 16.88 25.0484 16.448 25.1524L16.216 24.3524C16.52 24.2484 16.8 24.0964 17.048 23.8884C17.392 23.6084 17.672 23.2404 17.856 22.8324C17.896 22.7604 17.92 22.6804 17.936 22.6084C17.928 22.5204 17.904 22.4404 17.872 22.3604L15.936 17.5684H16.976Z" fill="currentColor"/>
                    <path d="M23.3682 16.0723V17.5683H24.7362V18.2803H23.3682V21.0883C23.3682 21.7283 23.5522 22.0963 24.0802 22.0963C24.2642 22.0963 24.4562 22.0803 24.6322 22.0323L24.6722 22.7443C24.4002 22.8403 24.1122 22.8803 23.8242 22.8723C23.6322 22.8803 23.4402 22.8563 23.2642 22.7843C23.0882 22.7123 22.9282 22.6083 22.7922 22.4723C22.5042 22.0803 22.3682 21.6003 22.4242 21.1203V18.2723H21.6162V17.5603H22.4402V16.2963L23.3682 16.0723Z" fill="currentColor"/>
                    <path d="M26.496 20.3364C26.48 20.5764 26.512 20.8244 26.592 21.0484C26.672 21.2724 26.808 21.4804 26.976 21.6564C27.144 21.8244 27.352 21.9604 27.584 22.0404C27.816 22.1204 28.056 22.1604 28.296 22.1364C28.784 22.1444 29.272 22.0564 29.72 21.8644L29.88 22.5764C29.328 22.8004 28.736 22.9124 28.136 22.8964C27.784 22.9204 27.44 22.8724 27.112 22.7444C26.784 22.6244 26.488 22.4244 26.248 22.1764C26 21.9284 25.816 21.6324 25.696 21.2964C25.576 20.9684 25.528 20.6164 25.56 20.2724C25.56 18.7044 26.496 17.4644 28.016 17.4644C29.728 17.4644 30.152 18.9604 30.152 19.9124C30.16 20.0564 30.16 20.2084 30.152 20.3524H26.472L26.496 20.3204V20.3364ZM29.288 19.6244C29.312 19.4324 29.304 19.2404 29.248 19.0564C29.192 18.8724 29.104 18.7044 28.976 18.5524C28.848 18.4084 28.696 18.2884 28.52 18.2084C28.344 18.1284 28.152 18.0884 27.96 18.0804C27.568 18.1124 27.2 18.2804 26.928 18.5684C26.656 18.8564 26.504 19.2244 26.496 19.6244H29.28H29.288Z" fill="currentColor"/>
                    <path d="M31.6001 19.1843C31.6001 18.5683 31.6001 18.0483 31.5601 17.5603H32.4161V18.5763H32.4561C32.5441 18.2643 32.7281 17.9843 32.9841 17.7763C33.2401 17.5683 33.5521 17.4563 33.8801 17.4323C33.9681 17.4243 34.0641 17.4243 34.1521 17.4323V18.3203C34.0401 18.3043 33.9361 18.3043 33.8241 18.3203C33.5041 18.3363 33.1921 18.4643 32.9601 18.6883C32.7281 18.9123 32.5761 19.2083 32.5521 19.5363C32.5281 19.6803 32.5121 19.8323 32.5121 19.9763V22.7443H31.5681V19.1843H31.6001Z" fill="currentColor"/>
                    <path d="M31.1839 3.26415C31.2159 3.74415 31.0959 4.21615 30.8559 4.63215C30.6159 5.04815 30.2559 5.37615 29.8239 5.58415C29.3919 5.79215 28.9119 5.86415 28.4319 5.80015C27.9599 5.73615 27.5119 5.52815 27.1599 5.20015C26.7999 4.88015 26.5519 4.45615 26.4319 3.99215C26.3119 3.52815 26.3359 3.04015 26.5039 2.58415C26.6639 2.13615 26.9599 1.74415 27.3439 1.45615C27.7279 1.16815 28.1919 1.00815 28.6719 0.992153C28.9839 0.976153 29.3039 1.01615 29.5999 1.12815C29.8959 1.23215 30.1679 1.39215 30.3999 1.60815C30.6319 1.81615 30.8239 2.07215 30.9599 2.36015C31.0959 2.64815 31.1759 2.95215 31.1839 3.26415Z" fill="currentColor"/>
                    <path d="M17.104 31.1521C10.696 31.1521 5.06404 28.8481 2.14404 25.4561C3.27204 28.5121 5.31204 31.1521 7.98404 33.0081C10.656 34.8721 13.84 35.8721 17.096 35.8721C20.352 35.8721 23.536 34.8721 26.208 33.0081C28.88 31.1441 30.92 28.5121 32.048 25.4561C29.144 28.8561 23.528 31.1521 17.088 31.1521H17.104Z" fill="currentColor"/>
                    <path d="M17.1037 9.06424C23.5117 9.06424 29.1517 11.3682 32.0637 14.7602C30.9357 11.7042 28.8957 9.06424 26.2237 7.20824C23.5517 5.34424 20.3677 4.34424 17.1117 4.34424C13.8557 4.34424 10.6717 5.34424 7.99967 7.20824C5.32767 9.07224 3.28767 11.7042 2.15967 14.7602C5.07167 11.3522 10.6797 9.06424 17.1197 9.06424H17.1037Z" fill="currentColor"/>
                    <path d="M8.27994 37.7681C8.31994 38.3681 8.17594 38.9681 7.87194 39.4961C7.56794 40.0161 7.11194 40.4401 6.56794 40.6961C6.02394 40.9601 5.41594 41.0561 4.81594 40.9681C4.21594 40.8801 3.65594 40.6241 3.20794 40.2161C2.75994 39.8161 2.43994 39.2881 2.29594 38.6961C2.15194 38.1121 2.17594 37.4961 2.38394 36.9281C2.58394 36.3601 2.95194 35.8641 3.43994 35.5041C3.92794 35.1441 4.50394 34.9361 5.11194 34.9121C5.50394 34.8881 5.90394 34.9441 6.27194 35.0801C6.64794 35.2081 6.99194 35.4161 7.27994 35.6801C7.57594 35.9441 7.81594 36.2641 7.98394 36.6241C8.15194 36.9841 8.25594 37.3681 8.27194 37.7601L8.27994 37.7681Z" fill="currentColor"/>
                    <path d="M2.87189 8.28821C2.52789 8.29621 2.18389 8.20821 1.89589 8.02421C1.59989 7.84021 1.36789 7.57621 1.23189 7.25621C1.08789 6.94421 1.04789 6.59221 1.10389 6.24821C1.15989 5.90421 1.31989 5.59221 1.55189 5.33621C1.78389 5.08021 2.09589 4.90421 2.43189 4.82421C2.76789 4.74421 3.11989 4.76821 3.4479 4.88821C3.76789 5.00821 4.05589 5.22421 4.25589 5.50421C4.45589 5.78421 4.5759 6.12021 4.59189 6.46421C4.60789 6.92821 4.4319 7.38421 4.1119 7.72821C3.79189 8.07221 3.35189 8.27221 2.88789 8.28821H2.87189Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );

  return (
    <div className="container">
      {content}
    </div>
  );
}

export default Gallery;
