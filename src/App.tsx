import './App.css';
import { DiscoverWalletProviders } from '~/components/DiscoverWalletProviders';
import { Eip6963Provider } from '~/hooks/Eip6963Provider';
import { WindowProvider } from '~/hooks/WindowProvider';
import { ProviderType } from '~/types';

function App() {
  const PROVIDER_TYPE: ProviderType = 'window'; // "window", "eip6963"

  return (
    <>
      {PROVIDER_TYPE === 'window' ? (
        <WindowProvider>
          <DiscoverWalletProviders type={PROVIDER_TYPE} />
        </WindowProvider>
      ) : (
        <Eip6963Provider>
          <DiscoverWalletProviders type={PROVIDER_TYPE} />
        </Eip6963Provider>
      )}
    </>
  );
}

export default App;
