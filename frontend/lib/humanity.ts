import { createPublicClient, Hex, http } from "viem";
import { humanityTestnet } from "./utils";

export async function getRegistered(address: Hex): Promise<boolean> {
  console.log(`Checking registration for address: ${address}`);
  const publicClient = createPublicClient({
    chain: humanityTestnet,
    transport: http(),
  });
  const result = await publicClient.readContract({
    address: "0x96c33CE8A28F76f24B83b156828A65Ccd0452CE7",
    abi: [
      {
        inputs: [{ internalType: "address", name: "user", type: "address" }],
        name: "isRegistered",
        outputs: [{ internalType: "bool", name: "registered", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "isRegistered",
    args: [address],
  });
  console.log(`Registration status for address ${address}: ${result}`);
  return result;
}

type IssueCredsParams = {
  name: string;
  address: Hex;
  ip: string;
  royalty: number;
  chef_score: number;
  twitter: string;
};

export async function issueCreds(params: IssueCredsParams) {
  console.log(`Issuing credentials for address: ${params.address}`);
  const response = await fetch(
    "https://issuer.humanity.org/credentials/issue",
    {
      method: "POST",
      headers: {
        "X-API-Token": process.env.HUMANITY_PROTOCOL || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject_address: params.address,
        claims: params,
      }),
    }
  );
  const { credential } = await response.json();
  if (!credential) {
    console.log(`Failed to issue credentials for address: ${params.address}`);
    return undefined;
  }

  console.log(
    `Issued credential ID: ${credential.id} for address: ${params.address}`
  );
  return credential.id;
}

export async function ownsCreds(address: Hex, credId: string): Promise<any> {
  console.log(
    `Checking ownership of credential ID: ${credId} for address: ${address}`
  );

  const response = await fetch(
    `https://issuer.humanity.org/credentials/list?holderDid=did:ethr:${address}`,
    {
      method: "GET",
      headers: {
        "X-API-Token": process.env.HUMANITY_PROTOCOL || "",
        "Content-Type": "application/json",
      },
    }
  );
  const { credentials } = await response.json();
  const { data } = credentials;
  if (!data) {
    console.log(`Failed to fetch credentials for address: ${address}`);
    throw new Error("Failed to fetch credentials");
  }
  let cred;
  for (let c of data) {
    if (c.id == credId) {
      console.log(
        `Found credential with ID: ${credId} for address: ${address}`
      );
      cred = c;
      break;
    }
  }
  if (cred) return { id: cred.id, cred: cred.credentialSubject };
  else return undefined;
}
