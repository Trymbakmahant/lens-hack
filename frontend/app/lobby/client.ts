import { PublicClient, mainnet } from "@lens-protocol/client";

export const client = PublicClient.create({
  environment: mainnet,
});
