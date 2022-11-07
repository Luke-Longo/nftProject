import { ShdwDrive } from "@shadow-drive/sdk";

import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";

import * as dotenv from "dotenv";

dotenv.config();

import fs from "fs";

const loadKeypair = (filename: string): Keypair => {
	const secret = JSON.parse(fs.readFileSync(filename).toString()) as number[];
	const secretKey = Uint8Array.from(secret);
	return Keypair.fromSecretKey(secretKey);
};

const connection = new Connection(clusterApiUrl("devnet"));
const wallet = Keypair.generate();

const drive = await new ShdwDrive(connection, wallet).init();

const res = await drive.createStorageAccount("test", "444MB", "v2");

const createAccount = async (): Promise<string> => {
	const connection = new Connection(clusterApiUrl("devnet"));
	const wallet = Keypair.generate();

	const drive = await new ShdwDrive(connection, wallet).init();

	const resp = await drive.createStorageAccount("test", "444MB", "v2");

	return resp.shdw_bucket;
};

const kp = loadKeypair("../keypair.json");

const bucket = createAccount();
