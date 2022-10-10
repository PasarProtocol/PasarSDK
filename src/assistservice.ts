/**
 * This class get the nfts from pasar assist backend
 */

import { ChainType } from "./chaintype";
import { CollectionInfo } from "./collection/collectioninfo";
import { getChainTypeNumber } from "./global";
import { ItemType } from "./itemtype";
import { NftItem } from "./nftitem";
import { NftListInfo } from "./nftlistinfo";

export class AssistService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * Query all listed NFT items on marketplace
     *
     * @param collection the address of collection, default is empty;
     * @param pageNum the page number, default 1;
     * @param pageSize the count of nft per page, default value = 10;
     */
    public async getAllListedItems(collectionAddr = '', pageNum = 1, pageSize = 10): Promise<NftListInfo> {
        return await fetch(`${this.baseUrl}/api/v2/sticker/getDetailedCollectibles?collectionType=${collectionAddr}&tokenType=&status=All&itemType=All&adult=false&minPrice=&maxPrice=&order=0&marketPlace=0&keyword=&pageNum=${pageNum}&pageSize=${pageSize}`).then(async result => {
            return await result.json();
        }).then (data => {
            if (data['code'] != 200) {
                throw new Error("Call API to fetch collection info failed");
            }
            let dataInfo = data['data'];
            let totalCount = dataInfo['total'];
            let nftData = dataInfo['result'];
            let listNftInfo: NftItem[] = [];
            for(var i = 0; i < nftData.length; i++) {

                let thumbnail = nftData[i]['data'] ? nftData[i]['data']['thumbnail'] : nftData[i]['thumbnail'];
                let image = nftData[i]['data'] ? nftData[i]['data']['image'] : nftData[i]['asset'];

                let itemNft: NftItem =  new NftItem(
                    nftData[i]['tokenId'],
                    nftData[i]['tokenIdHex'],
                    nftData[i]['name'],
                    nftData[i]['description'],
                    thumbnail,
                    image,
                    nftData[i]['adult'],
                    nftData[i]['properties'],
                    nftData[i]['tokenJsonVersion'],
                    nftData[i]['marketPlace'],
                    nftData[i]['holder'],
                    nftData[i]['royaltyOwner'],
                    nftData[i]['createTime'],
                    parseInt(nftData[i]['marketTime']),
                    parseInt(nftData[i]['endTime']),
                    nftData[i]['orderId'],
                    nftData[i]['quoteToken'],
                    nftData[i]['price'],
                    nftData[i]['buyoutPrice'],
                    nftData[i]['reservePrice'],
                    nftData[i]['minPrice'],
                    nftData[i]['orderState'],
                    nftData[i]['orderType']);
                listNftInfo.push(itemNft);
            }
            let listInfo = new NftListInfo(totalCount, listNftInfo);
            return listInfo;
        }).catch (error => {
            throw new Error(`Failed to get all listed NFTs on marketplace error: ${error}`);
        })
    }

    /**
     * get the detailed collection information from address
     *
     * @param address address of collection
     * @param chaintype type of chain
     */
    public async getCollectionInfo(collectionAddr:string, chainType: ChainType): Promise<CollectionInfo> {
        return await fetch(`${this.baseUrl}/api/v2/sticker/getCollection/${collectionAddr}?marketPlace=${getChainTypeNumber(chainType)}`).then(async result => {
            return await result.json();
        }).then (json => {
            if (json['code'] != 200) {
                throw new Error("Call API to fetch collection info failed");
            }

            let body = json['data'];
            let data = body['tokenJson']['data'];

            let info = new CollectionInfo(
                body['token'],
                chainType,
                body['creatorDid'],
                body['owner'],
                body['name'],
                body['symbol']
            );

            return info.setSocialLinks(data['socials'])
                .setDescription(data['description'])
                .setAvatar(data['avatar'])
                .setDescription(data['description'])
                .setCategory(data['category'])
                .setErcType(body['is721'] ? ItemType.ERC721 : ItemType.ERC1155)
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
     public async getItemByTokenId(tokenId:string, baseToken:string): Promise<NftItem> {
        return await fetch(`${this.baseUrl}/api/v2/sticker/getCollectibleByTokenId/${tokenId}/${baseToken}`).then(async result => {
            return await result.json();
        }).then(data => {
            if (data['code'] != 2000) {
                throw new Error("Call API to fetch specific NFT failed");
            }
            let itemInfo = data['data'];
            return new NftItem(
                itemInfo['tokenId'],
                itemInfo['tokenIdHex'],
                itemInfo['name'],
                itemInfo['description'],
                itemInfo['data'] ? itemInfo['data']['thumbnail'] : itemInfo['thumbnail'],
                itemInfo['data'] ? itemInfo['data']['image'] : itemInfo['asset'],
                itemInfo['adult'],
                itemInfo['properties'],
                itemInfo['tokenJsonVersion'],
                itemInfo['marketPlace'],
                itemInfo['holder'],
                itemInfo['royaltyOwner'],
                itemInfo['createTime'],
                parseInt(itemInfo['marketTime']),
                parseInt(itemInfo['endTime']),
                itemInfo['OrderId'],
                itemInfo['quoteToken'],
                itemInfo['Price'],
                itemInfo['buyoutPrice'],
                itemInfo['reservePrice'],
                itemInfo['minPrice'],
                itemInfo['orderState'],
                itemInfo['orderType']
            );
        }).catch (error => {
            throw new Error(`Failed to get listed NFTs with error: ${error}`);
        })
    }

    /**
     * get owned collections
     *
     * @param walletAddr the address whom be owned the nft
     * @return back the list of owned collection
     */
    public async getOwnedCollections(walletAddr: string): Promise<CollectionInfo[]> {
        return await fetch(`${this.baseUrl}/api/v2/sticker/getCollectionByOwner/${walletAddr}?marketPlace=1`).then(async result => {
            return await result.json();
        }).then(json => {
            if (json['code'] != 2000) {
                throw new Error("Call API to fetch owned Collections failed");
            }
            let collections: CollectionInfo[] = [];
            let body = json['data'];

            for (var i = 0; i < body.length; i++) {
                let item = body[i];
                let data = item['tokenJson']['data'];

                let info = new CollectionInfo(
                    item['token'],
                    ChainType.ESC,
                    item['creatorDid'],
                    item['owner'],
                    item['name'],
                    item['symbol']
                );

                info.setSocialLinks(data['socials'])
                    .setDescription(data['description'])
                    .setAvatar(data['avatar'])
                    .setDescription(data['description'])
                    .setCategory(data['category'])
                    .setErcType(body['is721'] ? ItemType.ERC721 : ItemType.ERC1155)

                collections.push(info);
            }
            return collections;
        }).catch (error => {
            throw new Error(`Failed to get listed NFTs with error: ${error}`);
        })
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