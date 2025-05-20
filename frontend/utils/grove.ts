import { chains } from "@lens-chain/sdk/viem";
import { StorageClient, walletOnly } from "@lens-chain/storage-client";

export const storageClient = StorageClient.create();

export async function getGroveUpload(address: string) {
  try {
    const acl = walletOnly(
      address as `0x${string}`, // Wallet Address
      chains.testnet.id
    );
    const response = await storageClient.uploadAsJson(
      {
        state: 0,
      },
      { acl }
    );
    console.log("Grove uploaded:", response.storageKey);
    return response.storageKey;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
interface Signer {
  signMessage({ message }: { message: string }): Promise<string>;
}
export async function getGroveStateChart(
  address: string,
  fileUrl: string,
  walletClient: Signer,
  file: JSON
) {
  try {
    const acl = walletOnly(
      address as `0x${string}`, // Wallet Address
      chains.testnet.id
    );
    const state = await storageClient.updateJson(fileUrl, file, walletClient, {
      acl,
    });
    console.log("Grove updated:", state);
    return state;
  } catch (error) {
    console.error("Error updating file:", error);
    throw error;
  }
}
