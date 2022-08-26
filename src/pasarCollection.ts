/**
 * This class is to process the functions on pasar collection.
 */

import { create } from 'ipfs-http-client';
import sha256 from 'crypto-js/sha256';
import { utils } from "./utils";
import { valuesOnTestNet, valuesOnMainNet } from "./constant";
import { resizeImage } from "./global";

const mintNFT = async (image: any, name: string, description: string,  properties, adult = false,) => {
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

	console.log(metaData);

	return "success";
}

export {
	mintNFT,
}