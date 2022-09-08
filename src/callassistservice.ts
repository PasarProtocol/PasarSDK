/**
 * This class get the nfts from pasar assist backend
 */

import { ChainType } from "./chaintype";
import { Collection } from "./collection";
import { valuesOnTestNet, valuesOnMainNet } from "./constant";
import { getChainTypeNumber } from "./global";
import { ItemType } from "./itemtype";
import { isTestnetNetwork } from "./networkType";

export class CallAssistService {
    /**
     * get all nfts listed on Pasar marketplace.
     *
     * @param collection the address of collection, default is empty;
     * @param pageNum the page number, default 1;
     * @param pageSize the count of nft per page, default value = 10;
     */
    public async getNftsOnMarketPlace(collection = '', pageNum = 1, pageSize = 10) {
        let baseUrl;

        if(isTestnetNetwork()) {
            baseUrl = valuesOnTestNet.assistURL;
        } else {
            baseUrl = valuesOnMainNet.assistURL;
        }

        let result  = await fetch(`${baseUrl}/api/v2/sticker/getDetailedCollectibles?collectionType=${collection}&tokenType=&status=All&itemType=All&adult=false&minPrice=&maxPrice=&order=0&marketPlace=0&keyword=&pageNum=${pageNum}&pageSize=${pageSize}`);

        return result;
    }

    /**
     * get the detailed collection information from address
     *
     * @param address address of collection
     * @param chaintype type of chain
     */
    public async getDetailedCollectionInfo(address:string, chaintype:ChainType): Promise<Collection> {
        let baseUrl;

        if(isTestnetNetwork()) {
            baseUrl = valuesOnTestNet.assistURL;
        } else {
            baseUrl = valuesOnMainNet.assistURL;
        }

        let chainNum = await getChainTypeNumber(chaintype);
        let result  = await fetch(`${baseUrl}/api/v2/sticker/getCollection/${address}?marketPlace=${chainNum}`);

        let jsonData = await result.json();
        if(jsonData['code'] != 200) {
            return null
        }
        let dataInfo = jsonData['data'];
        let collectionType = dataInfo['is721'] ? ItemType.ERC721 : ItemType.ERC1155;
        let collection: Collection =  new Collection(dataInfo['token'], dataInfo['creatorDid'], dataInfo['owner'], dataInfo['tokenJson']['data']['avatar'], dataInfo['name'], dataInfo['tokenJson']['data']['description'], dataInfo['symbol'], collectionType, dataInfo['tokenJson']['data']['category'], dataInfo['tokenJson']['data']['socials']);
        
        return collection;
    }
}