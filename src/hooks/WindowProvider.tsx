import { PropsWithChildren, createContext, useCallback, useEffect, useState } from 'react';

type SelectedAccountByWallet = Record<string, string | null>;

interface WindowProviderContext {
  wallets: Record<string, EIP6963ProviderDetail>;
  selectedWallet: EIP6963ProviderDetail | null;
  selectedAccount: string | null;
  connectWallet: (walletUuid: string) => Promise<void>;
  disConnectWallet: (walletUuid: string) => Promise<void>;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any;
  }
}

export const WindowProviderContext = createContext<WindowProviderContext>(null);

export const WindowProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [wallets, setWallets] = useState<Record<string, EIP6963ProviderDetail>>({});
  const [selectedWalletUuid, setSelectedWalletUuid] = useState<string | null>(null);
  const [selectedAccountByWalletUuid, setSelectedAccountByWalletUuid] = useState<SelectedAccountByWallet>({});

  useEffect(() => {
    // if (typeof window.ethereum !== 'undefined') {
    //   console.log('MetaMask is installed!');
    // }
    console.log('[window.ethereum]:', window.ethereum);
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

  const contextValue: WindowProviderContext = {
    wallets,
    selectedWallet: selectedWalletUuid === null ? null : wallets[selectedWalletUuid],
    selectedAccount: selectedWalletUuid === null ? null : selectedAccountByWalletUuid[selectedWalletUuid],
    connectWallet,
    disConnectWallet,
  };

  return <WindowProviderContext.Provider value={contextValue}>{children}</WindowProviderContext.Provider>;
};
