import React, { useEffect, useMemo, useRef } from "react";
import { createInstance, MatomoProvider } from "@datapunt/matomo-tracker-react";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export const MatomoContext: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const href = useRef(undefined);

  const matomo: ReturnType<typeof createInstance> | undefined = useMemo(() => {
    const urlBase = siteConfig.customFields.matomoBaseUrl;
    const siteId = siteConfig.customFields.matomoSiteId;
    if (typeof urlBase === "string" && typeof siteId === "string") {
      return createInstance({
        urlBase,
        siteId: parseInt(siteId, 10)
      });
    }
  }, [siteConfig]);

  useEffect(() => {
    const url = new URL(location.pathname, window.location.origin);
    url.search = location.search;
    if (url.href !== href.current) {
      // We want to send the current document's title to matomo instead of the
      // old one's, so we use `setTimeout` to defer execution to the next tick.
      // See https://github.com/facebook/docusaurus/pull/7424
      setTimeout(() => {
        matomo?.trackPageView({ href: url.href });
      }, 0);
    }
    href.current = url.href;
  }, [location, matomo]);

  return <MatomoProvider value={matomo}>{children}</MatomoProvider>;
};
