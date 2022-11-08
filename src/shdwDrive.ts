import { ShadowFile, ShdwDrive } from "@shadow-drive/sdk";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import * as dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const loadKeypair = (filename: string): Keypair => {
	const secret = JSON.parse(fs.readFileSync(filename).toString()) as number[];
	const secretKey = Uint8Array.from(secret);
	return Keypair.fromSecretKey(secretKey);
};
// get the keypair and create anchor wallet
const kp = loadKeypair("./keypair.json");
const wallet = new anchor.Wallet(kp);
const connection = new Connection(clusterApiUrl("mainnet-beta"), "max");
export const createAccount = async (
	name: string,
	storage: string,
	version: "v1" | "v2"
): Promise<string> => {
	const loadKeypair = (filename: string): Keypair => {
		const secret = JSON.parse(fs.readFileSync(filename).toString()) as number[];
		const secretKey = Uint8Array.from(secret);
		return Keypair.fromSecretKey(secretKey);
	};
	// get the keypair and create anchor wallet
	const kp = loadKeypair("./keypair.json");
	const wallet = new anchor.Wallet(kp);
	const connection = new Connection(clusterApiUrl("mainnet-beta"), "max");

	const drive = await new ShdwDrive(connection, wallet).init();
	const resp = await drive.createStorageAccount(name, storage, version);
	console.log("Storage account tx: ", resp.transaction_signature);
	console.log("bucket: ", resp.shdw_bucket);
	return resp.shdw_bucket;
};

const bucket = "7ne9NYWDM62CjM6Y6Z9VrFDBktvHjeb24rWKw8epZMMZ";
export const uploadCollectionSingle = async (
	name: string,
	type: "json" | "png"
): Promise<string> => {
	const drive = await new ShdwDrive(connection, wallet).init();
	const fileBuff = fs.readFileSync(`./assets/${name}.${type}`);
	const fileToUpload: ShadowFile = {
		name,
		file: fileBuff,
	};
	const res = await drive.uploadFile(new PublicKey(bucket), fileToUpload, "v2");
	console.log("upload tx: ", res.finalized_locations[0]);
	return res.finalized_locations[0];
};

export const uploadCollection = async (
	items: number,
	type: "json" | "png"
): Promise<string[]> => {
	// make sure to generate a new bucket for each collection
	const drive = await new ShdwDrive(connection, wallet).init();
	let locations = [];
	for (let i = 0; i <= items; i++) {
		const fileBuff = fs.readFileSync(
			`./assets/${type === "json" ? "json" : "images"}/${i}.${type}`
		);
		const fileToUpload: ShadowFile = {
			name: `${i}.${type}`,
			file: fileBuff,
		};
		const res = await drive.uploadFile(new PublicKey(bucket), fileToUpload, "v2");
		console.log("upload tx: ", res.finalized_locations[0]);
		locations.push(res.finalized_locations[0]);
	}
	return locations;
};

const main = async () => {
	const locations = await uploadCollection(9, "png");

	console.log("locations: ", locations[9]);
};

main();
