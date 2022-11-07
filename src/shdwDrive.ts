import { ShdwDrive } from "@shadow-drive/sdk";

import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
// import fs from "fs";

// const loadKeypair = (filename: string): Keypair => {
// 	const secret = JSON.parse(fs.readFileSync(filename).toString()) as number[];
// 	const secretKey = Uint8Array.from(secret);
// 	return Keypair.fromSecretKey(secretKey);
// };

const connection = new Connection(clusterApiUrl("devnet"));
const wallet = Keypair.generate();

const drive = await new ShdwDrive(connection, wallet).init();
