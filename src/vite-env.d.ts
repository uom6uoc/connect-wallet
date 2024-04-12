/// <reference types="vite/client" />

interface Provider {
  // origin
  isStatus?: boolean;
  host?: string;
  path?: string;
  sendAsync?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void;
  send?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void;
  request: (request: { method: string; params?: Array<unknown> }) => Promise<unknown>;
  // TODO: check
  isConnected(): boolean;
  on(eventName: 'connect', listener: (info: ProviderInfo) => void): this;
  on(eventName: 'disconnect', listener: (error: ProviderError) => void): this;
  on(eventName: 'message', listener: (message: ProviderMessage) => void): this;
  on(eventName: 'chainChanged', listener: (chainId: ProviderChainId) => void): this;
  on(eventName: 'accountsChanged', listener: (accounts: ProviderAccounts) => void): this;
  getSigner: () => void;
}

interface ProviderInfo {
  rdns: string;
  uuid: string;
  name: string;
  icon: string;
}

interface ProviderDetail {
  info: ProviderInfo;
  provider: EIP1193Provider;
}

type AnnounceProviderEvent = {
  detail: {
    info: ProviderInfo;
    provider: Readonly<EIP1193Provider>;
  };
};
