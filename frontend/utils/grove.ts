import { chains } from "@lens-chain/sdk/viem";
import { StorageClient, walletOnly } from "@lens-chain/storage-client";

export const storageClient = StorageClient.create();

export async function getGroveUpload(address: string, file: JSON) {
  const acl = walletOnly(
    address as `0x${string}`, // Wallet Address
    chains.testnet.id
  );
  const response = await storageClient.uploadAsJson(file, { acl });
  return response;
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
  const acl = walletOnly(
    address as `0x${string}`, // Wallet Address
    chains.testnet.id
  );
  const state = await storageClient.updateJson(fileUrl, file, walletClient, {
    acl,
  });
  return state;
}
