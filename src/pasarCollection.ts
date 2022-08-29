/**
 * This class is to process the functions on pasar collection.
 */

import { create } from 'ipfs-http-client';
import sha256 from 'crypto-js/sha256';
import Web3 from 'web3';
import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';
import { utils } from "./utils";
import { valuesOnTestNet, valuesOnMainNet } from "./constant";
import { resizeImage, isInAppBrowser, getFilteredGasPrice } from "./global";
import PASAR_CONTRACT_ABI from './contracts/stickerV2ABI';

const mintNFT = async (image: any, name: string, description: string,  properties, totalSupply=1, royaltyFee=10, adult = false) => {
	let ipfsURL;

	if(utils.testNet) {
		ipfsURL = valuesOnTestNet.urlIPFS;
	} else {
		ipfsURL = valuesOnMainNet.urlIPFS;
	}
	
	const client = create({ url: ipfsURL });

	let image_add = await client.add(image);
	let thumbnail:any = await resizeImage(image, 300, 300);
	let thumbnail_add = image_add;

	if(thumbnail.success === 0) {
		thumbnail_add = await client.add(thumbnail.fileContent);
	}
	
	let _id = `0x${sha256(image_add.path)}`;

	let jsonDid = JSON.parse(sessionStorage.getItem('USER_DID'));
	const createObject = {
		"did": jsonDid.did,
		"name": jsonDid.name || "",
		"description": jsonDid.bio || ""
	}

	const metaObj = {
		"version": "2",
		"type": 'image',
		"name": name,
		"description": description,
		"creator": createObject,
		"data": {
		"image": `pasar:image:${image_add.path}`,
		"kind": image.type.replace('image/', ''),
		"size": image.size,
		"thumbnail": `pasar:image:${thumbnail_add.path}`,
		},
		"adult": adult,
		"properties": properties || "",
	}
	
	let metaData = await client.add(JSON.stringify(metaObj));

	const essentialsConnector = new EssentialsConnector();

	const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());

	let accounts = await walletConnectWeb3.eth.getAccounts();

	let gasPrice = await walletConnectWeb3.eth.getGasPrice();
	gasPrice = getFilteredGasPrice(gasPrice);
	console.log("gas price: " + gasPrice);
	try {
		await handleMintFunction(accounts, _id, totalSupply, metaData, royaltyFee, essentialsConnector, gasPrice)
		return {result: true};
	} catch(err) {
		return {result: false, code: err};
	}
}


let handleMintFunction = (accounts, id, totalSupply, metaData, royaltyFee, essentialsConnector, gasPrice) => {
	return new Promise((resolve, reject) => {
		const _gasLimit = 5000000;
		const transactionParams = {
			'from': accounts[0],
			'gasPrice': gasPrice,
			'gas': _gasLimit,
			'value': 0
		};
	
		const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
	
		let contractAddress = utils.testNet ? valuesOnTestNet.elastos.stickerV2Contract : valuesOnMainNet.elastos.stickerV2Contract
		let pasarContract = new walletConnectWeb3.eth.Contract(PASAR_CONTRACT_ABI, contractAddress);
		pasarContract.methods.mint(id, totalSupply, metaData, royaltyFee).send(transactionParams).on('receipt', (receipt) => {
			resolve(receipt);
			console.log(receipt);
		}).on('error', (error) => {
			console.error("error", error);
			reject(error)
		});
	})
	
}

export {
	mintNFT,
}