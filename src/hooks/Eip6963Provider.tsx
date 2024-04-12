import { PropsWithChildren, createContext, useCallback, useEffect, useState } from 'react';
import { addProviderEventListener, removeProviderEventListener } from '~/utils/events';

type SelectedAccountByWallet = Record<string, string | null>;

interface Eip6963ProviderContext {
  wallets: Record<string, ProviderDetail>;
  selectedWallet: ProviderDetail | null;
  selectedAccount: string | null;
  connectWallet: (walletUuid: string) => Promise<void>;
  disConnectWallet: (walletUuid: string) => Promise<void>;
}

declare global {
  interface WindowEventMap {
    'eip6963:announceProvider': CustomEvent;
  }
}

export const Eip6963ProviderContext = createContext<Eip6963ProviderContext>(null);

export const Eip6963Provider: React.FC<PropsWithChildren> = ({ children }) => {
  const [wallets, setWallets] = useState<Record<string, ProviderDetail>>({});
  const [selectedWalletUuid, setSelectedWalletUuid] = useState<string | null>(null);
  const [selectedAccountByWalletUuid, setSelectedAccountByWalletUuid] = useState<SelectedAccountByWallet>({});

  // Find out about all providers by using EIP-6963
  useEffect(() => {
    function onAnnouncement(event: AnnounceProviderEvent) {
      console.log('[onAnnouncement]:', event);
      setWallets((currentWallets) => ({
        ...currentWallets,
        [event.detail.info.uuid]: event.detail,
      }));
    }

    window.addEventListener('eip6963:announceProvider', onAnnouncement);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    return () => window.removeEventListener('eip6963:announceProvider', onAnnouncement);
  }, []);

  const callBack = {
    accountsChanged: async (wallet: any, accounts: string) => {
      console.log({ wallet }, accounts);
      setSelectedAccountByWalletUuid((currentAccounts) => ({
        ...currentAccounts,
        [wallet.info.uuid]: accounts[0],
      }));
    },
  };

  const connectWallet = useCallback(
    async (walletUuid: string) => {
      try {
        const wallet = wallets[walletUuid];
        console.log('[eip6963] connectWallet:', wallet);

        const accounts = await wallet.provider.request({ method: 'eth_requestAccounts' });
        console.log('[eip6963] connectAccounts:', accounts);

        if (accounts?.[0]) {
          setSelectedWalletUuid(wallet.info.uuid);
          setSelectedAccountByWalletUuid((currentAccounts) => ({
            ...currentAccounts,
            [wallet.info.uuid]: accounts[0],
          }));

          console.log('[eip6963] : Selected Account', accounts[0]);
        }

        addProviderEventListener({ type: 'eip6963', wallet: wallet, callback: callBack });
      } catch (error) {
        console.error('[eip6963]Failed to connect to MetaMask', error);
      }
    },
    [wallets]
  );

  const disConnectWallet = useCallback(
    async (walletUuid: string) => {
      try {
        if (walletUuid === selectedWalletUuid) {
          setSelectedWalletUuid(null);

          const wallet = wallets[walletUuid];
          removeProviderEventListener({ type: 'eip6963', wallet: wallet, callback: callBack });

          console.log('[eip6963] disConnectWallet:', wallet);
        }
      } catch (error) {
        console.log('error:', error);
      }
    },
    [selectedWalletUuid]
  );

  const contextValue: Eip6963ProviderContext = {
    wallets,
    selectedWallet: selectedWalletUuid === null ? null : wallets[selectedWalletUuid],
    selectedAccount: selectedWalletUuid === null ? null : selectedAccountByWalletUuid[selectedWalletUuid],
    connectWallet,
    disConnectWallet,
  };

  return <Eip6963ProviderContext.Provider value={contextValue}>{children}</Eip6963ProviderContext.Provider>;
};
