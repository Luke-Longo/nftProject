import {
	Metaplex,
	keypairIdentity,
	bundlrStorage,
	toBigNumber,
	CreateCandyMachineInput,
	sol,
	toDateTime,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs";

const main = async () => {
	const loadKeypair = (filename: string): Keypair => {
		const secret = JSON.parse(fs.readFileSync(filename).toString()) as number[];
		const secretKey = Uint8Array.from(secret);
		return Keypair.fromSecretKey(secretKey);
	};

	// get the keypair and create anchor wallet
	const collectionAuthority = loadKeypair("./keypair.json");

	const connection = new Connection(clusterApiUrl("mainnet-beta"), "max");

	const metaplex = Metaplex.make(connection)
		.use(keypairIdentity(collectionAuthority))
		.use(bundlrStorage());

	const { nft: collectionNft } = await metaplex.nfts().create({
		name: "Elegant Eyes",
		uri: "https://shdw-drive.genesysgo.net/7ne9NYWDM62CjM6Y6Z9VrFDBktvHjeb24rWKw8epZMMZ/0.json",
		sellerFeeBasisPoints: 0,
		isCollection: true,
		updateAuthority: collectionAuthority,
	});

	const candyMachineSettings: CreateCandyMachineInput = {
		itemsAvailable: toBigNumber(10),
		sellerFeeBasisPoints: 100, // 3.33%
		collection: {
			address: collectionNft.address,
			updateAuthority: collectionAuthority,
		},
		symbol: "ELEY",
		creators: [
			{
				address: collectionAuthority.publicKey,
				share: 100,
			},
		],
		isMutable: true,
		itemSettings: {
			type: "configLines",
			prefixName: "Elegant Eye #$ID+1$",
			nameLength: 0,
			prefixUri:
				"https://shdw-drive.genesysgo.net/7ne9NYWDM62CjM6Y6Z9VrFDBktvHjeb24rWKw8epZMMZ/#$ID+1$.json",
			uriLength: 0,
			isSequential: false,
		},
		guards: {
			solPayment: { amount: sol(0.1), destination: collectionAuthority.publicKey },
			startDate: { date: toDateTime("2022-11-06T13:37:00Z") },
			// all other guards are disabled
		},
	};

	const { candyMachine } = await metaplex
		.candyMachines()
		.create(candyMachineSettings);

	console.log("Candy machine address:", candyMachine.address.toBase58());
};

main();
