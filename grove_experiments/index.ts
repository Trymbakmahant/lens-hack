import { StorageClient, walletOnly } from "@lens-chain/storage-client";
// import { chains } from "@lens-chain/sdk/viem";
// import { immutable } from "@lens-chain/storage-client";
type EvmAddress = `0x${string}`;

// async function onSubmit(event: SubmitEvent) {
//   event.preventDefault();

//   const input = event.currentTarget.elements["image"];
//   const file = input.files[0];

//   const response = await storageClient.uploadFile(file, { acl });

//   // response.uri: 'lens://323c0e1ccebcfa70dc130772…'
// }

function upload (address: EvmAddress, chainId: number, storageClient: StorageClient) {
  const acl = walletOnly(
    address, // Lens Account Address
    chainId,
  );
  // const acl = immutable(chainId);
  const data = { state: 0 };
  return storageClient.uploadAsJson(data, { acl }); // await if no return
}

(async () => {
  try {
    const chainId = 37111; // chains.testnet.id
    const storageClient = StorageClient.create();
    const address = "0x65F11cF4D70f5Cf00B2289c56ff78C67B1E69991" as EvmAddress;
    // const response = await upload(address, chainId, storageClient);
    const url = storageClient.resolve("lens://cefa96312c8370814a0f6f3402129eb775d3379498c42d3ade2b2ce467ada273");
    console.log(url);
  } catch (e) {
    console.error(e);
  }
})();