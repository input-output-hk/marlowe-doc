import React from "react";
import Link from "@docusaurus/Link";
import Github from "@site/static/icons/github.svg";
import Twitter from "@site/static/icons/twitter.svg";
import Youtube from "@site/static/icons/youtube.svg";
import Discord from "@site/static/icons/discord.svg";

import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.scss";

export const SUPPORT = "https://iohk.zendesk.com/hc/en-us/requests/new";

function DocsFooter() {
  return (
    <footer className={styles.footerOuter}>
      <div className={styles.footerIconWrapper}>
        <div className={styles.socialIcon}>
          <Link
            href="https://github.com/input-output-hk/marlowe-cardano"
            rel="noopener noreferrer"
          >
            <Github />
          </Link>
        </div>
        <div className={styles.socialIcon}>
          <Link href="https://discord.gg/inputoutput" rel="noopener noreferrer">
            <Discord />
          </Link>
        </div>
        <div className={styles.socialIcon}>
          <Link href="https://twitter.com/marlowe_io" rel="noopener noreferrer">
            <Twitter />
          </Link>
        </div>
        <div className={styles.socialIcon}>
          <Link
            href="https://www.youtube.com/@IohkIo"
            rel="noopener noreferrer"
          >
            <Youtube />
          </Link>
        </div>
      </div>

      <div className={styles.inner}>
        <div className={styles.linksAndLogoContainer}>
          <img
            src={useBaseUrl("/img/marlowe-logo-primary-black-purple.svg")}
            className={styles.footerLogo}
            data-light
          />
          <img
            src={useBaseUrl("/img/marlowe-logo-primary-white-purple.svg")}
            className={styles.footerLogo}
            data-dark
          />

          <div className={styles.footerColumn}>
            <div className={styles.links}>
              <div className={styles.linksList}>
                <h2 className={styles.linksHeading}>Resources</h2>
                <div className={styles.linkItem}>
                  <Link target="_blank" href="https://iohk.io/">
                    Input Output Global
                  </Link>
                </div>
                <div className={styles.linkItem}>
                  <Link target="_blank" href="https://cardano.org/">
                    Cardano.org
                  </Link>
                </div>
                <div className={styles.linkItem}>
                  <Link target="_blank" href="https://www.essentialcardano.io/">
                    Essential Cardano
                  </Link>
                </div>
                <div className={styles.linkItem}>
                  <Link
                    target="_blank"
                    href="https://www.youtube.com/channel/UCX9j__vYOJu00iqBrCzecVw"
                  >
                    IOG Academy
                  </Link>
                </div>
              </div>
              <div className={styles.linksList}>
                <h2 className={styles.linksHeading}>Legal</h2>
                <div className={styles.linkItem}>
                  <Link
                    target="_blank"
                    href="https://docs.google.com/document/d/13zJ5jdaKjXgAytvDn0kln8UFDhyFr3AS/view"
                  >
                    Cookie Policy
                  </Link>
                </div>
                <div className={styles.linkItem}>
                  <Link
                    target="_blank"
                    href="https://static.iohk.io/terms/iog-privacy-policy.pdf"
                  >
                    Privacy Policy
                  </Link>
                </div>
                <div className={styles.linkItem}>
                  <Link
                    className={styles.linkItem}
                    target="_blank"
                    href="https://plutus-static.s3.eu-central-1.amazonaws.com/IOHK+Website+Terms+%26+Conditions+(Final).pdf"
                  >
                    Terms of Use
                  </Link>
                </div>
              </div>
            </div>
            <p className={styles.disclaimer}>
              Disclaimer: The Playground is a tool for simulating Marlowe smart
              contracts in a testing environment and is not intended for mainnet
              deployment or on-chain use. Nothing on this website is intended to
              be professional advice, including without limitation, financial,
              investment, or advice.
            </p>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} Input Output Global, Inc. All Rights
              Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default DocsFooter;
