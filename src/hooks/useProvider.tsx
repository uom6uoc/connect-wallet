import { useContext } from 'react';
import { Eip6963ProviderContext } from './Eip6963Provider';
import { WindowProviderContext } from './WindowProvider';
import { ProviderType } from '~/types';

export const useProvider = (type: ProviderType) => {
  const providerContext = type === 'eip6963' ? Eip6963ProviderContext : WindowProviderContext;
  return useContext(providerContext);
};
