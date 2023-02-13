import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import HeaderView from './components/HeaderView';
import RunView from './components/RunView';

const LandingPage: React.FC = () => {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />" >
      <main>
        <HeaderView />
        <RunView />
      </main>
    </Layout>
  );
};

export default LandingPage;