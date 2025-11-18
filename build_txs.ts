import {
  createSolanaRpc,
  generateKeyPairSigner,
  BaseTransactionSignerConfig ,
  createTransactionMessage,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  signTransactionMessageWithSigners,
  assertIsSendableTransaction,
  getBase64EncodedWireTransaction,
  Address,
  getProgramDerivedAddress,
  getBase58Codec,
} from "@solana/kit";
import bs58 from "bs58";

(async () => {
  // Setting up a solana rpc
  const rpc = createSolanaRpc("http://127.0.0.1:8899");
  // Creating a signer keypair
  const payer = await generateKeyPairSigner();
  console.log("Payer Address:", payer.address);

  // Address of the program
  const PROGRAM_ADDRESS = "uWGrWGNk4enkjkboj6ErEW8FKDQBaFCUGqtpcw7Ea5m" as Address;
  // Deriving the PDA for the vault account by using the seed "vault" (as defiened in the idl [118, 97, 117, 108, 116])
  const [vaultPDA, bump] = await getProgramDerivedAddress({
    programAddress: PROGRAM_ADDRESS,
    seeds: [Buffer.from("vault")],
  });
  console.log("Vault PDA:", vaultPDA, "Bump:", bump);

  // Setting up the instruction discriminators to use the instructions later when defining the transactions
  const discriminatorReset = new Uint8Array([162, 127, 159, 174, 179, 116, 127, 132]);
  const discriminatorOpen = new Uint8Array([88, 119, 117, 99, 145, 1, 225, 154]);

  // Defining the new admin data as bytes
  const newAdmin = payer.address;
  const newAdminBytes = bs58.decode(newAdmin);

  // Creating a byte array with the correct length for storing the discriminator and the new admin pubkey
  const resetDataAsByteArray = new Uint8Array(newAdminBytes.length + discriminatorReset.length);

  // Setting the discriminator at the beginning of the byte array
  resetDataAsByteArray.set(discriminatorReset, 0);

  // Setting the new admin pubkey bytes right after the discriminator
  resetDataAsByteArray.set(newAdminBytes, discriminatorReset.length);

  // Defining the instructions
  const resetIx = {
    programAddress: PROGRAM_ADDRESS,
    keys: [
      { pubkey: payer.address, isSigner: true, isWritable: true },
      { pubkey: vaultPDA, isSigner: false, isWritable: true },
    ],
    data: resetDataAsByteArray,
  };

  const openIx = {
    programAddress: PROGRAM_ADDRESS,
    keys: [
      { pubkey: payer.address, isSigner: true, isWritable: true },
      { pubkey: vaultPDA, isSigner: false, isWritable: true },
    ],
    data: discriminatorOpen,
  };

  // Building two transactions: one for resetting and one for opening the vault 
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  
  const resetTx = pipe(
    createTransactionMessage({ version: 0 }),
    (msg) => setTransactionMessageFeePayerSigner(payer, msg),
    (msg) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, msg),
    (msg) => appendTransactionMessageInstructions([resetIx], msg)
  );
  const openTx = pipe(
    createTransactionMessage({ version: 0 }),
    (msg) => setTransactionMessageFeePayerSigner(payer, msg),
    (msg) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, msg),
    (msg) => appendTransactionMessageInstructions([openIx], msg)
  );

  // Signing the transactions
  const resetSigned = await signTransactionMessageWithSigners(resetTx, payer as BaseTransactionSignerConfig);
  const openSigned = await signTransactionMessageWithSigners(openTx, payer as BaseTransactionSignerConfig);

  // Validating that the transactions are sendable
  assertIsSendableTransaction(resetSigned);
  assertIsSendableTransaction(openSigned);

  // Serializing the transactions to base64 encoded wire format
  const resetTxBase64 = getBase64EncodedWireTransaction(resetSigned);
  const openTxBase64 = getBase64EncodedWireTransaction(openSigned);

  console.log("First Tx:", resetTxBase64);
  console.log("Second Tx:", openTxBase64);

})();
