/**
 * This class get the nfts from pasar assist backend
 */

import { ChainType } from "./chaintype";
import { Collection } from "./collection";
import { valuesOnTestNet, valuesOnMainNet } from "./constant";
import { getChainTypeNumber } from "./global";
import { ItemType } from "./itemtype";
import { isTestnetNetwork } from "./networkType";
import { NftItem } from "./nftitem";
import { NftListInfo } from "./nftlistinfo";

export class CallAssistService {
    /**
     * get all nfts listed on Pasar marketplace.
     *
     * @param collection the address of collection, default is empty;
     * @param pageNum the page number, default 1;
     * @param pageSize the count of nft per page, default value = 10;
     */
    public async getNftsOnMarketPlace(collection = '', pageNum = 1, pageSize = 10): Promise<NftListInfo> {
        let baseUrl;

        if(isTestnetNetwork()) {
            baseUrl = valuesOnTestNet.assistURL;
        } else {
            baseUrl = valuesOnMainNet.assistURL;
        }

        let result  = await fetch(`${baseUrl}/api/v2/sticker/getDetailedCollectibles?collectionType=${collection}&tokenType=&status=All&itemType=All&adult=false&minPrice=&maxPrice=&order=0&marketPlace=0&keyword=&pageNum=${pageNum}&pageSize=${pageSize}`);
        let jsonData = await result.json();
        if(jsonData['code'] != 200) {
            return null
        }
        let dataInfo = jsonData['data'];
        console.log(dataInfo);
        let totalCount = dataInfo['total'];
        let nftData = dataInfo['result'];
        let listNftInfo: NftItem[] = [];
        for(var i = 0; i < nftData.length; i++) {
            let chainType;
            switch(nftData[i]['marketPlace']) {
                case 1:
                    chainType = ChainType.ESC;
                    break;
                case 2:
                    chainType = ChainType.ETH;
                    break;
                case 3:
                    chainType = ChainType.FSN;
                    break;
                default:
                    chainType = ChainType.ESC;
                    break;
            }

            let itemNft: NftItem =  new NftItem(nftData[i]['tokenId'], nftData[i]['tokenIdHex'], nftData[i]['name'], nftData[i]['description'], nftData[i]['thumbnail'], nftData[i]['adult'], nftData[i]['properties'], nftData[i]['tokenJsonVersion'], chainType, nftData[i]['holder'], nftData[i]['royaltyOwner'], nftData[i]['createTime'], parseInt(nftData[i]['marketTime']), parseInt(nftData[i]['endTime']), nftData[i]['orderId'], nftData[i]['quoteToken'], nftData[i]['price'], nftData[i]['buyoutPrice'], nftData[i]['reservePrice'], nftData[i]['minPrice'], nftData[i]['orderState'], nftData[i]['orderType']);
            listNftInfo.push(itemNft);
        }
        let listInfo = new NftListInfo(totalCount, listNftInfo);
        return listInfo;
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

    /**
     * get the detailed collection information from address
     *
     * @param tokenId the id of nft
     * @param baseToken the collection address of nft
     */
     public async getCollectibleByTokenId(tokenId:string, baseToken:string): Promise<NftItem> {
        let baseUrl;

        if(isTestnetNetwork()) {
            baseUrl = valuesOnTestNet.assistURL;
        } else {
            baseUrl = valuesOnMainNet.assistURL;
        }

        let result  = await fetch(`${baseUrl}/api/v2/sticker/getCollectibleByTokenId/${tokenId}/${baseToken}`);

        let jsonData = await result.json();
        if(jsonData['code'] != 200) {
            return null
        }
        let dataInfo = jsonData['data'];
        console.log(dataInfo);
        let chainType;
        switch(dataInfo['marketPlace']) {
            case 1:
                chainType = ChainType.ESC;
                break;
            case 2:
                chainType = ChainType.ETH;
                break;
            case 3:
                chainType = ChainType.FSN;
                break;
            default:
                chainType = ChainType.ESC;
                break;
        }
        let itenNft: NftItem =  new NftItem(dataInfo['tokenId'], dataInfo['tokenIdHex'], dataInfo['name'], dataInfo['description'], dataInfo['thumbnail'], dataInfo['adult'], dataInfo['properties'], dataInfo['tokenJsonVersion'], chainType, dataInfo['holder'], dataInfo['royaltyOwner'], dataInfo['createTime'], parseInt(dataInfo['marketTime']), parseInt(dataInfo['endTime']), dataInfo['OrderId'], dataInfo['quoteToken'], dataInfo['Price'], dataInfo['buyoutPrice'], dataInfo['reservePrice'], dataInfo['minPrice'], dataInfo['orderState'], dataInfo['orderType']);
        
        return itenNft;
    }
}