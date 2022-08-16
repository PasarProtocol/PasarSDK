/**
 * This class get the nfts from pasar assist backend
 */

import { utils } from "./utils";
import { valuesOnTestNet, valuesOnMainNet } from "./constant";

export class getNfts {

    /**
     * get all nfts listed on Pasar marketplace.
     *
     * @param collection the address of collection, default is empty;
     * @param pageNum the page number, default 1; 
     * @param pageSize the count of nft per page, default value = 10; 
     */
    public async getNftsOnMarketPlace(collection: string = '', pageNum: number = 1, pageSize: number = 10) {
        let baseUrl;

        if(utils.testNet) {
            baseUrl = valuesOnTestNet.assistURL;
        } else {
            baseUrl = valuesOnMainNet.assistURL;
        }

        let result  = await fetch(`${baseUrl}/api/v2/sticker/getDetailedCollectibles?collectionType=${collection}&tokenType=&status=All&itemType=All&adult=false&minPrice=&maxPrice=&order=0&marketPlace=0&keyword=&pageNum=${pageNum}&pageSize=${pageSize}`);

        return result;
    }
}