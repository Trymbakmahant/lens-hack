"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { lens, lensTestnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [lens, lensTestnet],
    transports: {
      // RPC URL for each chain
      [lens.id]: http(`${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
      [lensTestnet.id]: http(`${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
    },

    // Required API Keys
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
      "c93d50441c91d42c24f9967d79562d08",

    // Required App Info
    appName: "Lens Game",

    // Optional App Info
    appDescription: "A game built on Lens Protocol",
    appUrl: "https://lens-game.vercel.app", // your app's url
    appIcon: "https://lens-game.vercel.app/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
