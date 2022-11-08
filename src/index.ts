import {
	Metaplex,
	keypairIdentity,
	bundlrStorage,
	toBigNumber,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import fs from "fs";

const main = async () => {
	const loadKeypair = (filename: string): Keypair => {
		const secret = JSON.parse(fs.readFileSync(filename).toString()) as number[];
		const secretKey = Uint8Array.from(secret);
		return Keypair.fromSecretKey(secretKey);
	};

	// get the keypair and create anchor wallet
	const kp = loadKeypair("./keypair.json");

	const connection = new Connection(clusterApiUrl("devnet"));
	const collectionAuthority = kp;

	const metaplex = Metaplex.make(connection)
		.use(keypairIdentity(kp))
		.use(bundlrStorage());

	const candyMachineSettings = {
		itemsAvailable: toBigNumber(5000),
		sellerFeeBasisPoints: 100, // 3.33%
		// collection: {
		// 	address: collectionNft.address,
		// 	updateAuthority: collectionAuthority,
		// },
		itemSettings: {
			type: "hidden",
			name: "Dingus",
			symbol: "DING",
			uri: "https://example.com",
			hash: "Qm...",
			image:
				"https://shdw-drive.genesysgo.net/7ne9NYWDM62CjM6Y6Z9VrFDBktvHjeb24rWKw8epZMMZ/0.png",
			creators: [
				{
					address: collectionAuthority.publicKey.toBase58(),
					share: 100,
				},
			],
			properties: {
				files: [
					{
						uri: "https://shdw-drive.genesysgo.net/7ne9NYWDM62CjM6Y6Z9VrFDBktvHjeb24rWKw8epZMMZ/0.png",
						type: "image/png",
					},
				],
			},
		},
	};

	// const { candyMachine } = await metaplex
	// 	.candyMachines()
	// 	.create(candyMachineSettings);

	const collectionNft = "9fhUjHJctHx9jfmoPVPxKWNLub95ePaVeupBTt3mNHHu";
};

main();

// const { nft: collectionNft } = await metaplex.nfts().create({
// 	sellerFeeBasisPoints: 0,
// 	name: "Dingus",
// 	symbol: "DING",
// 	uri: "https://shdw-drive.genesysgo.net/7ne9NYWDM62CjM6Y6Z9VrFDBktvHjeb24rWKw8epZMMZ/0.json",
// 	isCollection: true,
// 	updateAuthority: collectionAuthority,
// });

// console.log("collectionNft", collectionNft.address.toBase58());
