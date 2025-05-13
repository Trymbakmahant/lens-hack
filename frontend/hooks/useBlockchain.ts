import { useState, useEffect } from "react";

interface ContractState {
  isConnected: boolean;
  address: string | null;
  balance: string;
  error: string | null;
}

export const useBlockchain = (): ContractState => {
  const [state, setState] = useState<ContractState>({
    isConnected: false,
    address: null,
    balance: "0",
    error: null,
  });

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts.length > 0) {
            const balance = await window.ethereum.request({
              method: "eth_getBalance",
              params: [accounts[0], "latest"],
            });

            setState({
              isConnected: true,
              address: accounts[0],
              balance: balance,
              error: null,
            });
          }
        } catch (error) {
          setState((prev) => ({
            ...prev,
            error: "Failed to connect to wallet",
          }));
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          setState({
            isConnected: false,
            address: null,
            balance: "0",
            error: null,
          });
        } else {
          checkConnection();
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", checkConnection);
      }
    };
  }, []);

  return state;
};
