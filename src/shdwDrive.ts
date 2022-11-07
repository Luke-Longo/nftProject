import { ShdwDrive } from "@shadow-drive/sdk";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import anchor from "@project-serum/anchor";
import * as dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const loadKeypair = (filename: string): Keypair => {
	const secret = JSON.parse(fs.readFileSync(filename).toString()) as number[];
	const secretKey = Uint8Array.from(secret);
	return Keypair.fromSecretKey(secretKey);
};
// get the keypair and create anchor wallet
const kp = loadKeypair("../keypair.json");
const wallet = new anchor.Wallet(kp);

const createAccount = async (): Promise<string> => {
	const connection = new Connection(clusterApiUrl("devnet"));

	const drive = await new ShdwDrive(connection, wallet).init();
	const resp = await drive.createStorageAccount("test", "444MB", "v2");
	return resp.shdw_bucket;
};

const bucket = createAccount();
