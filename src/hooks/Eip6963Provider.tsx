import { PropsWithChildren, createContext, useCallback, useEffect, useState } from 'react';

type SelectedAccountByWallet = Record<string, string | null>;

interface Eip6963ProviderContext {
  wallets: Record<string, EIP6963ProviderDetail>;
  selectedWallet: EIP6963ProviderDetail | null;
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
  const [wallets, setWallets] = useState<Record<string, EIP6963ProviderDetail>>({});
  const [selectedWalletUuid, setSelectedWalletUuid] = useState<string | null>(null);
  const [selectedAccountByWalletUuid, setSelectedAccountByWalletUuid] = useState<SelectedAccountByWallet>({});

  // Find out about all providers by using EIP-6963
  useEffect(() => {
    function onAnnouncement(event: EIP6963AnnounceProviderEvent) {
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

  useEffect(() => {
    try {
      if (wallets[selectedWalletUuid]) {
        const wallet = wallets[selectedWalletUuid];
        // wallet.provider.on('connect', (data) => {
        //   console.log('connect:', data);
        // });
        // wallet.provider.on('disconnect', (data) => {
        //   console.log('disconnect:', data);
        // });
        wallet.provider.on('chainChanged', (data) => {
          console.log('chainChanged:', data);
          // window.location.reload();
        });
        wallet.provider.on('accountsChanged', (data) => {
          console.log('accountsChanged:', data);
        });
        // wallet.provider.on('message', (data) => {
        //   console.log('message:', data);
        // });
      }
    } catch (error) {
      console.log('error');
    }
  }, [selectedWalletUuid, wallets]);

  const connectWallet = useCallback(
    async (walletUuid: string) => {
      try {
        const wallet = wallets[walletUuid];
        console.log('[connectWallet- wallet]:', wallet);

        const accounts = (await wallet.provider.request({ method: 'eth_requestAccounts' })) as string[];
        console.log('[connectWallet- accounts]:', accounts);

        if (accounts?.[0]) {
          setSelectedWalletUuid(wallet.info.uuid);
          setSelectedAccountByWalletUuid((currentAccounts) => ({
            ...currentAccounts,
            [wallet.info.uuid]: accounts[0],
          }));
        }
      } catch (error) {
        console.error('Failed to connect to provider:', error);
      }
    },
    [wallets]
  );

  const disConnectWallet = useCallback(
    async (walletUuid: string) => {
      try {
        if (walletUuid === selectedWalletUuid) {
          setSelectedWalletUuid(null);
        }
      } catch (error) {
        console.log('error:', error);
      }
    },
    [selectedWalletUuid]
  );

  // const chainChanged = useCallback(async (walletUuid: string) => {}, [wallets]);

  const contextValue: Eip6963ProviderContext = {
    wallets,
    selectedWallet: selectedWalletUuid === null ? null : wallets[selectedWalletUuid],
    selectedAccount: selectedWalletUuid === null ? null : selectedAccountByWalletUuid[selectedWalletUuid],
    connectWallet,
    disConnectWallet,
  };

  return <Eip6963ProviderContext.Provider value={contextValue}>{children}</Eip6963ProviderContext.Provider>;
};
