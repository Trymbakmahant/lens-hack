"use client";

import React, { useState, useEffect } from "react";

interface WalletConnectProps {
  onConnect: (address: string) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>("");

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const userAddress = accounts[0];
        setAddress(userAddress);
        setIsConnected(true);
        onConnect(userAddress);
      } else {
        alert("Please install MetaMask to use this feature");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setAddress("");
    setIsConnected(false);
  };

  return (
    <div className="wallet-connect">
      {!isConnected ? (
        <button onClick={connectWallet} className="connect-button">
          Connect Wallet
        </button>
      ) : (
        <div className="wallet-info">
          <span className="address">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </span>
          <button onClick={disconnectWallet} className="disconnect-button">
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
