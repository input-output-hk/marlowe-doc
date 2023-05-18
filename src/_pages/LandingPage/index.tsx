import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import HeaderView from './components/HeaderView';

const LandingPage: React.FC = () => {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout>
    </Layout>
  );
};

export default LandingPage;