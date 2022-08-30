/**
 * This class is to process the functions on pasar collection.
 */

import { create } from 'ipfs-http-client';
import sha256 from 'crypto-js/sha256';
import Web3 from 'web3';
import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';
import { valuesOnTestNet, valuesOnMainNet } from "./constant";
import { resizeImage, isInAppBrowser, getFilteredGasPrice } from "./global";
import { isTestnetNetwork } from './networkType';
import PASAR_CONTRACT_ABI from './contracts/abis/stickerV2ABI';

 /**  the function of being minted the nft
 *
 * @param image the image file
 * @param name name of nft
 * @param description description of nft
 * @param properties properties of nft
 * @param totalSupply count of nft; default = 1
 * @param royaltyFee royaltify of nft; default = 10
 * @param adult adult property; default = false
 * @return result result of mint; true = success, false = failed
 * @return data data of mint; if success is tokenId whereas with failed, is an error code
 */
const mintNFT = async (image: any, name: string, description: string,  properties:any, totalSupply=1, royaltyFee=10, adult = false) => {
	let ipfsURL;

	if(isTestnetNetwork()) {
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
	let uriData = `pasar:json:${metaData.path}`;
	const essentialsConnector = new EssentialsConnector();

	const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());

	let accounts = await walletConnectWeb3.eth.getAccounts();

	let gasPrice = await walletConnectWeb3.eth.getGasPrice();
	gasPrice = getFilteredGasPrice(gasPrice);

	try {
		await handleMintFunction(accounts, _id, totalSupply, uriData, royaltyFee, essentialsConnector, gasPrice)
		return {result: true, data: _id};
	} catch(err) {
		return {result: false, data: err};
	}
}

/**
 *  the function of being burn the nft
 *
 * @param id tokenId
 * @param totalSupply count of nft; default = 1
 * @return result result of mint; true = success, false = failed
 * @return data data of mint; if success is tokenId whereas with failed, is an error code
 */
let burn = async (id, totalSupply = 1) => {
	const essentialsConnector = new EssentialsConnector();

	const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());

	let accounts = await walletConnectWeb3.eth.getAccounts();

	let gasPrice = await walletConnectWeb3.eth.getGasPrice();
	gasPrice = getFilteredGasPrice(gasPrice);

	try {
		await handleBurn(accounts, id, totalSupply, essentialsConnector, gasPrice)
		return {result: true, data: id};
	} catch(err) {
		return {result: false, data: err};
	}
}

/**
 *  the function of transfer the nft
 *
 * @param id tokenId
 * @param to the address of receving the nft
 * @param totalSupply count of nft; default = 1
 * @return result result of mint; true = success, false = failed
 * @return data data of mint; if success is tokenId whereas with failed, is an error code
 */
 let transfer = async (id, to, totalSupply = 1) => {
	const essentialsConnector = new EssentialsConnector();

	const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());

	let accounts = await walletConnectWeb3.eth.getAccounts();

	let gasPrice = await walletConnectWeb3.eth.getGasPrice();
	gasPrice = getFilteredGasPrice(gasPrice);

	try {
		await handleTransfer(accounts, id, to, totalSupply, essentialsConnector, gasPrice)
		return {result: true, data: id};
	} catch(err) {
		return {result: false, data: err};
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

		let contractAddress = isTestnetNetwork() ? valuesOnTestNet.elastos.stickerV2Contract : valuesOnMainNet.elastos.stickerV2Contract
		let pasarContract = new walletConnectWeb3.eth.Contract(PASAR_CONTRACT_ABI, contractAddress);
		pasarContract.methods.mint(id, totalSupply, metaData, royaltyFee).send(transactionParams).on('receipt', (receipt) => {
			resolve(receipt);
		}).on('error', (error) => {
			reject(error)
		});
	})

}

let handleBurn = (accounts, id, totalSupply, essentialsConnector, gasPrice) => {
	return new Promise((resolve, reject) => {
		const _gasLimit = 5000000;
		const transactionParams = {
			'from': accounts[0],
			'gasPrice': gasPrice,
			'gas': _gasLimit,
			'value': 0
		};

		const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());

		let contractAddress = isTestnetNetwork() ? valuesOnTestNet.elastos.stickerV2Contract : valuesOnMainNet.elastos.stickerV2Contract
		let pasarContract = new walletConnectWeb3.eth.Contract(PASAR_CONTRACT_ABI, contractAddress);
		pasarContract.methods.burn(id, totalSupply).send(transactionParams).on('receipt', (receipt) => {
			resolve(receipt);
		}).on('error', (error) => {
			reject(error)
		});
	})
}

let handleTransfer = (accounts, id, to, totalSupply, essentialsConnector, gasPrice) => {
	return new Promise((resolve, reject) => {
		const _gasLimit = 5000000;
		const transactionParams = {
			'from': accounts[0],
			'gasPrice': gasPrice,
			'gas': _gasLimit,
			'value': 0
		};

		const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());

		let contractAddress = isTestnetNetwork() ? valuesOnTestNet.elastos.stickerV2Contract : valuesOnMainNet.elastos.stickerV2Contract
		let pasarContract = new walletConnectWeb3.eth.Contract(PASAR_CONTRACT_ABI, contractAddress);
		pasarContract.methods.safeTransferFrom(accounts[0], to, id, totalSupply).send(transactionParams).on('receipt', (receipt) => {
			resolve(receipt);
		}).on('error', (error) => {
			reject(error)
		});
	})
}

export {
	mintNFT,
	burn,
	transfer
}