import { useQuery, useMutation, useQueryClient } from 'react-query';
import head from 'lodash/head';
import { useProvider } from './useProvider';

export const useAccount = () => {
  const provider = useProvider();

  const accountQuery = useQuery(
    ['account', provider?.id],
    async () => {
      if (localStorage.getItem('walletConnected')) {
        const address = head(await provider.listAccounts()).address;

        if (address) {
          return provider.lookupAddress(address);
        }
      }
    },
    { enabled: Boolean(provider) },
  );

  // const ensNameQuery = useQuery(
  //   ['ens', accountQuery.data],
  //   async () => await provider.lookupAddress(`${accountQuery.data}`),
  //   { enabled: Boolean(accountQuery.data) },
  // );

  return accountQuery.data;
  // return useMemo(
  //   () => ({
  //     address: accountQuery.data,
  //     ensName: ensNameQuery.data,
  //   }),
  //   [accountQuery.data, ensNameQuery.data],
  // );
};

export const useAccountConnect = () => {
  const provider = useProvider();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    'accountMutate',
    async (shallConnect) => {
      if (!shallConnect) {
        return localStorage.removeItem('walletConnected');
      }

      const [account] = await provider.send('eth_requestAccounts', []);
      localStorage.setItem('walletConnected', account);
    },
    {
      onSettled: () => void queryClient.invalidateQueries('account'),
    },
  );

  return {
    connect(shallConnect = true) {
      return void mutation.mutate(shallConnect);
    },
    isLoading: mutation.isLoading,
  };
};
