import { FC, ReactNode, useMemo, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { supabase } from '@/integrations/supabase/client';

import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  const [customRpcUrl, setCustomRpcUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRpcUrl = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-rpc-url');
        if (!error && data?.rpcUrl) {
          setCustomRpcUrl(data.rpcUrl);
        }
      } catch (err) {
        console.log('Using default RPC endpoint');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRpcUrl();
  }, []);

  const endpoint = useMemo(() => {
    if (customRpcUrl) {
      return customRpcUrl;
    }
    return clusterApiUrl('mainnet-beta');
  }, [customRpcUrl]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
