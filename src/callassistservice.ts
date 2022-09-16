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
            let thumbnail = nftData[i]['data'] ? nftData[i]['data']['thumbnail'] : nftData[i]['thumbnail'];
            let image = nftData[i]['data'] ? nftData[i]['data']['image'] : nftData[i]['asset'];

            let itemNft: NftItem =  new NftItem(nftData[i]['tokenId'], nftData[i]['tokenIdHex'], nftData[i]['name'], nftData[i]['description'], thumbnail, image, nftData[i]['adult'], nftData[i]['properties'], nftData[i]['tokenJsonVersion'], chainType, nftData[i]['holder'], nftData[i]['royaltyOwner'], nftData[i]['createTime'], parseInt(nftData[i]['marketTime']), parseInt(nftData[i]['endTime']), nftData[i]['orderId'], nftData[i]['quoteToken'], nftData[i]['price'], nftData[i]['buyoutPrice'], nftData[i]['reservePrice'], nftData[i]['minPrice'], nftData[i]['orderState'], nftData[i]['orderType']);
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

        let thumbnail = dataInfo['data'] ? dataInfo['data']['thumbnail'] : dataInfo['thumbnail'];
        let image = dataInfo['data'] ? dataInfo['data']['image'] : dataInfo['asset'];

        let itemNft: NftItem =  new NftItem(dataInfo['tokenId'], dataInfo['tokenIdHex'], dataInfo['name'], dataInfo['description'], thumbnail, image, dataInfo['adult'], dataInfo['properties'], dataInfo['tokenJsonVersion'], chainType, dataInfo['holder'], dataInfo['royaltyOwner'], dataInfo['createTime'], parseInt(dataInfo['marketTime']), parseInt(dataInfo['endTime']), dataInfo['OrderId'], dataInfo['quoteToken'], dataInfo['Price'], dataInfo['buyoutPrice'], dataInfo['reservePrice'], dataInfo['minPrice'], dataInfo['orderState'], dataInfo['orderType']);
        
        return itemNft;
    }

    /**
     * get owned collections
     *
     * @param walletAddr the address whom be owned the nft
     * @return back the list of owned collection
     */
    public async getOwnedCollection(
        walletAddr: string
    ): Promise<Collection[]> {
        let baseUrl;

        if(isTestnetNetwork()) {
            baseUrl = valuesOnTestNet.assistURL;
        } else {
            baseUrl = valuesOnMainNet.assistURL;
        }

        let result  = await fetch(`${baseUrl}/api/v2/sticker/getCollectionByOwner/${walletAddr}?marketPlace=1`);
        let jsonData = await result.json();
        if(jsonData['code'] != 200) {
            return null
        }
        let dataInfo = jsonData['data'];
        let listCollection: Collection[] = [];
        for(var i = 0; i < dataInfo.length; i++) {
            let collectionType = dataInfo[i]['is721'] ? ItemType.ERC721 : ItemType.ERC1155;
            let collection: Collection =  new Collection(dataInfo[i]['token'], dataInfo[i]['creatorDid'], dataInfo[i]['owner'], dataInfo[i]['tokenJson']['data']['avatar'], dataInfo[i]['name'], dataInfo[i]['tokenJson']['data']['description'], dataInfo[i]['symbol'], collectionType, dataInfo[i]['tokenJson']['data']['category'], dataInfo[i]['tokenJson']['data']['socials']);
            listCollection.push(collection);
        }
        
        return listCollection;
    }

    /**
     * get owned nfts listed on Pasar marketplace.
     *
     * @param walletAddr the address of user
     */
     public async getOwnedListedNft(walletAddr: string): Promise<NftItem[]> {
        let baseUrl;

        if(isTestnetNetwork()) {
            baseUrl = valuesOnTestNet.assistURL;
        } else {
            baseUrl = valuesOnMainNet.assistURL;
        }

        let result  = await fetch(`${baseUrl}/api/v2/sticker/getListedCollectiblesByAddress/${walletAddr}?orderType=0`);
        let jsonData = await result.json();
        if(jsonData['code'] != 200) {
            return null
        }
        let dataInfo = jsonData['data'];
        let listNftInfo: NftItem[] = [];
        for(var i = 0; i < dataInfo.length; i++) {
            let chainType;
            switch(dataInfo[i]['marketPlace']) {
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

            let thumbnail = dataInfo[i]['data'] ? dataInfo[i]['data']['thumbnail'] : dataInfo[i]['thumbnail'];
            let image = dataInfo[i]['data'] ? dataInfo[i]['data']['image'] : dataInfo[i]['asset'];

            let itemNft: NftItem =  new NftItem(dataInfo[i]['tokenId'], dataInfo[i]['tokenIdHex'], dataInfo[i]['name'], dataInfo[i]['description'], thumbnail, image, dataInfo[i]['adult'], dataInfo[i]['properties'], dataInfo[i]['tokenJsonVersion'], chainType, dataInfo[i]['holder'], dataInfo[i]['royaltyOwner'], dataInfo[i]['createTime'], parseInt(dataInfo[i]['marketTime']), parseInt(dataInfo[i]['endTime']), dataInfo[i]['orderId'], dataInfo[i]['quoteToken'], dataInfo[i]['price'], dataInfo[i]['buyoutPrice'], dataInfo[i]['reservePrice'], dataInfo[i]['minPrice'], dataInfo[i]['orderState'], dataInfo[i]['orderType']);
            listNftInfo.push(itemNft);
        }
        
        return listNftInfo;
    }

    /**
     * get owned nfts on Pasar marketplace.
     *
     * @param walletAddr the address of user
     */
     public async getOwnedNft(walletAddr: string): Promise<NftItem[]> {
        let baseUrl;

        if(isTestnetNetwork()) {
            baseUrl = valuesOnTestNet.assistURL;
        } else {
            baseUrl = valuesOnMainNet.assistURL;
        }

        let result  = await fetch(`${baseUrl}/api/v2/sticker/getOwnCollectiblesByAddress/${walletAddr}?orderType=0`);
        let jsonData = await result.json();
        if(jsonData['code'] != 200) {
            return null
        }
        let dataInfo = jsonData['data'];
        let listNftInfo: NftItem[] = [];
        for(var i = 0; i < dataInfo.length; i++) {
            let chainType;
            switch(dataInfo[i]['marketPlace']) {
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

            let thumbnail = dataInfo[i]['data'] ? dataInfo[i]['data']['thumbnail'] : dataInfo[i]['thumbnail'];
            let image = dataInfo[i]['data'] ? dataInfo[i]['data']['image'] : dataInfo[i]['asset'];

            let itemNft: NftItem =  new NftItem(dataInfo[i]['tokenId'], dataInfo[i]['tokenIdHex'], dataInfo[i]['name'], dataInfo[i]['description'], thumbnail, image, dataInfo[i]['adult'], dataInfo[i]['properties'], dataInfo[i]['tokenJsonVersion'], chainType, dataInfo[i]['holder'], dataInfo[i]['royaltyOwner'], dataInfo[i]['createTime'], parseInt(dataInfo[i]['marketTime']), parseInt(dataInfo[i]['endTime']), dataInfo[i]['orderId'], dataInfo[i]['quoteToken'], dataInfo[i]['price'], dataInfo[i]['buyoutPrice'], dataInfo[i]['reservePrice'], dataInfo[i]['minPrice'], dataInfo[i]['orderState'], dataInfo[i]['orderType']);
            listNftInfo.push(itemNft);
        }
        
        return listNftInfo;
    }

    /**
     * get owned nfts on Pasar marketplace.
     *
     * @param walletAddr the address of user
     */
     public async getCreatedNft(walletAddr: string): Promise<NftItem[]> {
        let baseUrl;

        if(isTestnetNetwork()) {
            baseUrl = valuesOnTestNet.assistURL;
        } else {
            baseUrl = valuesOnMainNet.assistURL;
        }

        let result  = await fetch(`${baseUrl}/api/v2/sticker/getCreatedCollectiblesByAddress/${walletAddr}?orderType=0`);
        let jsonData = await result.json();
        if(jsonData['code'] != 200) {
            return null
        }
        let dataInfo = jsonData['data'];
        let listNftInfo: NftItem[] = [];
        for(var i = 0; i < dataInfo.length; i++) {
            let chainType;
            switch(dataInfo[i]['marketPlace']) {
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

            let thumbnail = dataInfo[i]['data'] ? dataInfo[i]['data']['thumbnail'] : dataInfo[i]['thumbnail'];
            let image = dataInfo[i]['data'] ? dataInfo[i]['data']['image'] : dataInfo[i]['asset'];

            let itemNft: NftItem =  new NftItem(dataInfo[i]['tokenId'], dataInfo[i]['tokenIdHex'], dataInfo[i]['name'], dataInfo[i]['description'], thumbnail, image, dataInfo[i]['adult'], dataInfo[i]['properties'], dataInfo[i]['tokenJsonVersion'], chainType, dataInfo[i]['holder'], dataInfo[i]['royaltyOwner'], dataInfo[i]['createTime'], parseInt(dataInfo[i]['marketTime']), parseInt(dataInfo[i]['endTime']), dataInfo[i]['orderId'], dataInfo[i]['quoteToken'], dataInfo[i]['price'], dataInfo[i]['buyoutPrice'], dataInfo[i]['reservePrice'], dataInfo[i]['minPrice'], dataInfo[i]['orderState'], dataInfo[i]['orderType']);
            listNftInfo.push(itemNft);
        }
        
        return listNftInfo;
    }
}