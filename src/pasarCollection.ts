/**
 * This class is to process the functions on pasar collection.
 */

import { create } from 'ipfs-http-client';
import { utils } from "./utils";
import { valuesOnTestNet, valuesOnMainNet } from "./constant";
import { resizeImage } from "./global";

export class PasarCollection {

	public async mintNFT(image: any, name: string, description: string) {
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
		
		return "success";
	}
}
