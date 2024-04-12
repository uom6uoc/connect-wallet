import './App.css';
import { useState } from 'react';
import { DiscoverWalletProviders } from '~/components/DiscoverWalletProviders';
import { Eip6963Provider } from '~/hooks/Eip6963Provider';
import { WindowProvider } from '~/hooks/WindowProvider';
import styles from './App.module.css';

import type { ProviderType } from '~/types';

function App() {
  return (
    <div className={styles.main}>
      <div className={styles.mainBox}>
        <h4>window.ethereum</h4>
        <WindowProvider>
          <DiscoverWalletProviders type={'window'} />
        </WindowProvider>
      </div>
      <div className={styles.mainBox}>
        <h4>eip6963</h4>
        <Eip6963Provider>
          <DiscoverWalletProviders type={'eip6963'} />
        </Eip6963Provider>
      </div>
    </div>
  );
}

export default App;
