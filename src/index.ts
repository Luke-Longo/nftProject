import {
	Metaplex,
	keypairIdentity,
	bundlrStorage,
	toBigNumber,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const collectionAuthority = Keypair.generate();

const metaplex = Metaplex.make(connection)
	.use(keypairIdentity(collectionAuthority))
	.use(bundlrStorage());

// const candyMachineSettings = {
// 	itemsAvailable: toBigNumber(5000),
// 	sellerFeeBasisPoints: 100, // 3.33%
// 	collection: {
// 		address: collectionNft.address,
// 		updateAuthority: collectionUpdateAuthority,
// 	},
// 	itemSettings: {
// 		type: "hidden",
// 		name: "Dingus",
// 		symbol: "DING",
// 		uri: "https://example.com",
// 		hash: "Qm...",
// 		creators: [
// 			{
// 				address: collectionAuthority.publicKey.toBase58(),
// 				share: 100,
// 			},
// 		],
// 	},
// };

// const { candyMachine } = await metaplex
// 	.candyMachines()
// 	.create(candyMachineSettings);

const { nft: collectionNft } = await metaplex.nfts().create({
	sellerFeeBasisPoints: 0,
	name: "Dingus",
	symbol: "DING",
	uri: "",
	isCollection: true,
	updateAuthority: collectionAuthority,
});
