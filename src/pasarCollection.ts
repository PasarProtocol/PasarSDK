/**
 * This class is to process the functions on pasar collection.
 */

import { create } from 'ipfs-http-client';
import { utils } from "./utils";
import { valuesOnTestNet, valuesOnMainNet } from "./constant";

export class PasarCollection {

	public async mintNFT(image: any, name: string, description: string) {
		let ipfsURL;

		if(utils.testNet) {
            ipfsURL = valuesOnTestNet.urlIPFS;
        } else {
            ipfsURL = valuesOnMainNet.urlIPFS;
        }
		console.log(ipfsURL);
		const client = create({ url: ipfsURL });

		let image_add = await client.add(image);
		console.log(image_add);
		return "success";
	}
}
