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
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * get all nfts listed on Pasar marketplace.
     *
     * @param collection the address of collection, default is empty;
     * @param pageNum the page number, default 1;
     * @param pageSize the count of nft per page, default value = 10;
     */
    public async getNftsOnMarketPlace(collection = '', pageNum = 1, pageSize = 10): Promise<NftListInfo> {
        let result  = await fetch(`${this.baseUrl}/api/v2/sticker/getDetailedCollectibles?collectionType=${collection}&tokenType=&status=All&itemType=All&adult=false&minPrice=&maxPrice=&order=0&marketPlace=0&keyword=&pageNum=${pageNum}&pageSize=${pageSize}`);
        let jsonData = await result.json();
        if(jsonData['code'] != 200) {
            return null
        }
        let dataInfo = jsonData['data'];
        let totalCount = dataInfo['total'];
        let nftData = dataInfo['result'];
        let listNftInfo: NftItem[] = [];
        for(var i = 0; i < nftData.length; i++) {

            let thumbnail = nftData[i]['data'] ? nftData[i]['data']['thumbnail'] : nftData[i]['thumbnail'];
            let image = nftData[i]['data'] ? nftData[i]['data']['image'] : nftData[i]['asset'];

            let itemNft: NftItem =  new NftItem(nftData[i]['tokenId'], nftData[i]['tokenIdHex'], nftData[i]['name'], nftData[i]['description'], thumbnail, image, nftData[i]['adult'], nftData[i]['properties'], nftData[i]['tokenJsonVersion'], nftData[i]['marketPlace'], nftData[i]['holder'], nftData[i]['royaltyOwner'], nftData[i]['createTime'], parseInt(nftData[i]['marketTime']), parseInt(nftData[i]['endTime']), nftData[i]['orderId'], nftData[i]['quoteToken'], nftData[i]['price'], nftData[i]['buyoutPrice'], nftData[i]['reservePrice'], nftData[i]['minPrice'], nftData[i]['orderState'], nftData[i]['orderType']);
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
    public async getDetailedCollectionInfo(address:string, chaintype:string): Promise<Collection> {
        return await fetch(`${this.baseUrl}/api/v2/sticker/getCollection/${address}?marketPlace=${getChainTypeNumber(chaintype)}`).then(async result => {
            return await result.json();
        }).then (data => {
            if (data['code'] != 200) {
                throw new Error("Call API to fetch collection info failed");
            }

            let dataInfo = data['data'];
            return new Collection(
                dataInfo['token'],
                dataInfo['creatorDid'],
                dataInfo['owner'],
                dataInfo['tokenJson']['data']['avatar'],
                dataInfo['name'],
                dataInfo['tokenJson']['data']['description'],
                dataInfo['symbol'],
                dataInfo['is721'] ? ItemType.ERC721 : ItemType.ERC1155,
                dataInfo['tokenJson']['data']['category'],
                dataInfo['tokenJson']['data']['socials']
            );
        }).catch (error => {
            throw new Error(`Failed to get Collection Info (erro: ${error}`);
        })
    }

    /**
     * get the detailed collection information from address
     *
     * @param tokenId the id of nft
     * @param baseToken the collection address of nft
     */
     public async getCollectibleByTokenId(tokenId:string, baseToken:string): Promise<NftItem> {
        let result  = await fetch(`${this.baseUrl}/api/v2/sticker/getCollectibleByTokenId/${tokenId}/${baseToken}`);

        let jsonData = await result.json();
        if(jsonData['code'] != 200) {
            return null
        }
        let dataInfo = jsonData['data'];

        let thumbnail = dataInfo['data'] ? dataInfo['data']['thumbnail'] : dataInfo['thumbnail'];
        let image = dataInfo['data'] ? dataInfo['data']['image'] : dataInfo['asset'];

        let itemNft: NftItem =  new NftItem(dataInfo['tokenId'], dataInfo['tokenIdHex'], dataInfo['name'], dataInfo['description'], thumbnail, image, dataInfo['adult'], dataInfo['properties'], dataInfo['tokenJsonVersion'], dataInfo['marketPlace'], dataInfo['holder'], dataInfo['royaltyOwner'], dataInfo['createTime'], parseInt(dataInfo['marketTime']), parseInt(dataInfo['endTime']), dataInfo['OrderId'], dataInfo['quoteToken'], dataInfo['Price'], dataInfo['buyoutPrice'], dataInfo['reservePrice'], dataInfo['minPrice'], dataInfo['orderState'], dataInfo['orderType']);

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
        let result  = await fetch(`${this.baseUrl}/api/v2/sticker/getCollectionByOwner/${walletAddr}?marketPlace=1`);
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
     public async getListedItems(walletAddr: string): Promise<NftItem[]> {
        return await fetch(`${this.baseUrl}/api/v2/sticker/getListedCollectiblesByAddress/${walletAddr}?orderType=0`).then(result => {
            return result.json();
        }).then(data => {
            if (data['code'] != 2000) {
                throw new Error("Call API to fetch bidding NFT failed");
            }
            let dataInfoArray = data['data'];
            let items: NftItem[] = [];
            for(var i = 0; i < dataInfoArray.length; i++) {
                let itemInfo = dataInfoArray[i];

                let thumbnail = itemInfo['data'] ? itemInfo['data']['thumbnail'] : itemInfo['thumbnail'];
                let image = itemInfo['data'] ? itemInfo['data']['image'] : itemInfo['asset'];

                let itemNft =  new NftItem(
                    itemInfo['tokenId'],
                    itemInfo['tokenIdHex'],
                    itemInfo['name'],
                    itemInfo['description'],
                    thumbnail,
                    image,
                    itemInfo['adult'],
                    itemInfo['properties'],
                    itemInfo['tokenJsonVersion'],
                    itemInfo['marketPlace'],
                    itemInfo['holder'],
                    itemInfo['royaltyOwner'],
                    itemInfo['createTime'],
                    parseInt(itemInfo['marketTime']),
                    parseInt(itemInfo['endTime']),
                    itemInfo['orderId'],
                    itemInfo['quoteToken'],
                    itemInfo['price'],
                    itemInfo['buyoutPrice'],
                    itemInfo['reservePrice'],
                    itemInfo['minPrice'],
                    itemInfo['orderState'],
                    itemInfo['orderType']
                );
                items.push(itemNft);
            }
            return items;
        }).catch (error => {
            throw new Error(`Failed to get listed NFTs with error: ${error}`);
        })
    }

    /**
     * get owned nfts on Pasar marketplace.
     *
     * @param walletAddr the address of user
     */
     public async getOwnedItems(walletAddr: string): Promise<NftItem[]> {
        return await fetch(`${this.baseUrl}/api/v2/sticker/getOwnCollectiblesByAddress/${walletAddr}?orderType=0`).then(result => {
            return result.json();
        }).then(data => {
            if (data['code'] != 2000) {
                throw new Error("Call API to fetch bidding NFT failed");
            }
            let dataInfoArray = data['data'];
            let items: NftItem[] = [];
            for(var i = 0; i < dataInfoArray.length; i++) {
                let itemInfo = dataInfoArray[i];

                let thumbnail = itemInfo['data'] ? itemInfo['data']['thumbnail'] : itemInfo['thumbnail'];
                let image = itemInfo['data'] ? itemInfo['data']['image'] : itemInfo['asset'];

                let itemNft =  new NftItem(
                    itemInfo['tokenId'],
                    itemInfo['tokenIdHex'],
                    itemInfo['name'],
                    itemInfo['description'],
                    thumbnail,
                    image,
                    itemInfo['adult'],
                    itemInfo['properties'],
                    itemInfo['tokenJsonVersion'],
                    itemInfo['marketPlace'],
                    itemInfo['holder'],
                    itemInfo['royaltyOwner'],
                    itemInfo['createTime'],
                    parseInt(itemInfo['marketTime']),
                    parseInt(itemInfo['endTime']),
                    itemInfo['orderId'],
                    itemInfo['quoteToken'],
                    itemInfo['price'],
                    itemInfo['buyoutPrice'],
                    itemInfo['reservePrice'],
                    itemInfo['minPrice'],
                    itemInfo['orderState'],
                    itemInfo['orderType']
                );
                items.push(itemNft);
            }
            return items;
        }).catch (error => {
            throw new Error(`Failed to get owned NFTs with error: ${error}`);
        })
    }

    /**
     * get created nfts on Pasar marketplace.
     *
     * @param walletAddr the address of user
     */
     public async getCreatedItems(walletAddr: string): Promise<NftItem[]> {
        return await fetch(`${this.baseUrl}/api/v2/sticker/getCreatedCollectiblesByAddress/${walletAddr}?orderType=0`).then(result => {
            return result.json();
        }).then(data => {
            if (data['code'] != 2000) {
                throw new Error("Call API to fetch bidding NFT failed");
            }
            let dataInfoArray = data['data'];
            let items: NftItem[] = [];
            for(var i = 0; i < dataInfoArray.length; i++) {
                let itemInfo = dataInfoArray[i];

                let thumbnail = itemInfo['data'] ? itemInfo['data']['thumbnail'] : itemInfo['thumbnail'];
                let image = itemInfo['data'] ? itemInfo['data']['image'] : itemInfo['asset'];

                let itemNft =  new NftItem(
                    itemInfo['tokenId'],
                    itemInfo['tokenIdHex'],
                    itemInfo['name'],
                    itemInfo['description'],
                    thumbnail,
                    image,
                    itemInfo['adult'],
                    itemInfo['properties'],
                    itemInfo['tokenJsonVersion'],
                    itemInfo['marketPlace'],
                    itemInfo['holder'],
                    itemInfo['royaltyOwner'],
                    itemInfo['createTime'],
                    parseInt(itemInfo['marketTime']),
                    parseInt(itemInfo['endTime']),
                    itemInfo['orderId'],
                    itemInfo['quoteToken'],
                    itemInfo['price'],
                    itemInfo['buyoutPrice'],
                    itemInfo['reservePrice'],
                    itemInfo['minPrice'],
                    itemInfo['orderState'],
                    itemInfo['orderType']
                );
                items.push(itemNft);
            }
            return items;
        }).catch (error => {
            throw new Error(`Failed to get created NFTs with error: ${error}`);
        })
    }

    /**
     * get bidded nfts on Pasar marketplace.
     *
     * @param walletAddr the address of user
     */
     public async getBiddingItems(walletAddr: string): Promise<NftItem[]> {
        return await fetch(`${this.baseUrl}/api/v2/sticker/getBidCollectiblesByAddress/${walletAddr}?orderType=0`).then(result => {
            return result.json();
        }).then(data => {
            if (data['code'] != 2000) {
                throw new Error("Call API to fetch bidding NFT failed");
            }
            let dataInfoArray = data['data'];
            let items: NftItem[] = [];
            for(var i = 0; i < dataInfoArray.length; i++) {
                let itemInfo = dataInfoArray[i];

                let thumbnail = itemInfo['data'] ? itemInfo['data']['thumbnail'] : itemInfo['thumbnail'];
                let image = itemInfo['data'] ? itemInfo['data']['image'] : itemInfo['asset'];

                let itemNft =  new NftItem(
                    itemInfo['tokenId'],
                    itemInfo['tokenIdHex'],
                    itemInfo['name'],
                    itemInfo['description'],
                    thumbnail,
                    image,
                    itemInfo['adult'],
                    itemInfo['properties'],
                    itemInfo['tokenJsonVersion'],
                    itemInfo['marketPlace'],
                    itemInfo['holder'],
                    itemInfo['royaltyOwner'],
                    itemInfo['createTime'],
                    parseInt(itemInfo['marketTime']),
                    parseInt(itemInfo['endTime']),
                    itemInfo['orderId'],
                    itemInfo['quoteToken'],
                    itemInfo['price'],
                    itemInfo['buyoutPrice'],
                    itemInfo['reservePrice'],
                    itemInfo['minPrice'],
                    itemInfo['orderState'],
                    itemInfo['orderType']
                );
                items.push(itemNft);
            }
            return items;
        }).catch (error => {
            throw new Error(`Failed to get bidding NFTs with error: ${error}`);
        })
    }

    /**
     * get sold nfts on Pasar marketplace.
     *
     * @param walletAddr the address of user
     */
     public async getSoldItems(walletAddr: string): Promise<NftItem[]> {
        return await fetch(`${this.baseUrl}/api/v2/sticker/getSoldCollectiblesByAddress/${walletAddr}?orderType=0`).then(result => {
            return result.json();
        }).then(data => {
            if (data['code'] != 2000) {
                throw new Error("Call API to fetch bidding NFT failed");
            }
            let dataInfoArray = data['data'];
            let items: NftItem[] = [];
            for(var i = 0; i < dataInfoArray.length; i++) {
                let itemInfo = dataInfoArray[i];

                let thumbnail = itemInfo['data'] ? itemInfo['data']['thumbnail'] : itemInfo['thumbnail'];
                let image = itemInfo['data'] ? itemInfo['data']['image'] : itemInfo['asset'];

                let itemNft =  new NftItem(
                    itemInfo['tokenId'],
                    itemInfo['tokenIdHex'],
                    itemInfo['name'],
                    itemInfo['description'],
                    thumbnail,
                    image,
                    itemInfo['adult'],
                    itemInfo['properties'],
                    itemInfo['tokenJsonVersion'],
                    itemInfo['marketPlace'],
                    itemInfo['holder'],
                    itemInfo['royaltyOwner'],
                    itemInfo['createTime'],
                    parseInt(itemInfo['marketTime']),
                    parseInt(itemInfo['endTime']),
                    itemInfo['orderId'],
                    itemInfo['quoteToken'],
                    itemInfo['price'],
                    itemInfo['buyoutPrice'],
                    itemInfo['reservePrice'],
                    itemInfo['minPrice'],
                    itemInfo['orderState'],
                    itemInfo['orderType']
                );
                items.push(itemNft);
            }
            return items;
        }).catch (error => {
            throw new Error(`Failed to get sold NFTs with error: ${error}`);
        })
    }
}