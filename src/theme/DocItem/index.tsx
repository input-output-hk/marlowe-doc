import React from 'react';
import DocItem from '@theme-original/DocItem';
import DocsFooter from '@site/src/components/DocsFooter';

export default function DocItemWrapper(props) {
  return (
    <>
      <DocItem {...props} />
      <DocsFooter />
    </>
  );
}
