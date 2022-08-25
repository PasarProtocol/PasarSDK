/**
 * This class is to process the functions on pasar collection.
 */

import { create } from 'ipfs-http-client';
import sha256 from 'crypto-js/sha256';
import { utils } from "./utils";
import { valuesOnTestNet, valuesOnMainNet } from "./constant";
import { resizeImage } from "./global";

const mintNFT = async (image: any, name: string, description: string) => {
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
	
	let id_image = `0x${sha256(image_add.path)}`;
	let id_thumbnail = `0x${sha256(thumbnail_add.path)}`;

	console.log(id_image);
	console.log(id_thumbnail);

	return "success";
}

export {
	mintNFT,
}