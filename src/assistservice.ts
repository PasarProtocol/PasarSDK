import { ChainType, getChainIndexByType } from "./chaintype";
import { CollectionInfo } from "./collection/collectioninfo";
import { CollectionPage } from "./collection/collectionpage";
import { ItemInfo } from "./iteminfo";
import { ItemPage } from "./itempage";
import { ERCType } from "./erctype";

const getAllListedItems = async (assistUrl: string, earilerThan:number, pageNum = 1, pageSize = 10): Promise<ItemPage> => {
    try {
        let response = await fetch(`${assistUrl}/api/v1/listCollectibles?type=listed&after=${earilerThan}&pageNum=${pageNum}&pageSize=${pageSize}`)
        let data = await response.json();
        if (data['status'] != 200) {
            throw new Error("Call API to fetch collection info failed");
        }

        let dataInfo = data['data'];

        let totalCount = dataInfo['total'];
        let nftData = dataInfo['data'];
        let listNftInfo: ItemInfo[] = [];
        for(var i = 0; i < nftData.length; i++) {

            let thumbnail = nftData[i]['data'] ? nftData[i]['data']['thumbnail'] : nftData[i]['thumbnail'];
            let image = nftData[i]['data'] ? nftData[i]['data']['image'] : nftData[i]['asset'];

            let itemNft =  new ItemInfo(
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
                nftData[i]['tokenOwner'],
                nftData[i]['royaltyOwner'],
                nftData[i]['createTime'],
                parseInt(nftData[i]['marketTime']),
                parseInt(nftData[i]['order']['endTime']),
                nftData[i]['order']['orderId'],
                nftData[i]['order']['quoteToken'],
                nftData[i]['order']['price'],
                nftData[i]['order']['buyoutPrice'],
                nftData[i]['order']['reservePrice'],
                nftData[i]['order']['orderState'],
                nftData[i]['order']['orderType']);
            listNftInfo.push(itemNft);
        }
        return new ItemPage(totalCount, 0, nftData.length, listNftInfo);
    } catch (error) {
        throw new Error(`Failed to get all listed NFTs on marketplace error: ${error}`);
    }
}

const getCollectionInfo = async (assistUrl: string, collectionAddr:string, chainType: ChainType): Promise<CollectionInfo> => {
    try {
        let response = await fetch(`${assistUrl}/api/v2/sticker/getCollection/${collectionAddr}?marketPlace=${getChainIndexByType(chainType)}`);
        let json = await response.json();
        if (json['status'] != 200) {
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
            .setErcType(body['is721'] ? ERCType.ERC721 : ERCType.ERC1155)
    }catch (error) {
        throw new Error(`Failed to get Collection Info (erro: ${error}`);
    }
}

const getItemByTokenId = async (assistUrl: string, baseToken:string, tokenId:string): Promise<ItemInfo> => {
    try {
        let response = await fetch(`${assistUrl}/api/v2/sticker/getCollectibleByTokenId/${tokenId}/${baseToken}`);
        let data = await response.json();
        if (data['status'] != 200) {
            throw new Error("Call API to fetch specific NFT failed");
        }

        let itemInfo = data['data'];
        return new ItemInfo(
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
            itemInfo['orderState'],
            itemInfo['orderType']
        );
    }catch (error) {
        throw new Error(`Failed to get listed NFTs with error: ${error}`);
    }
}

const getOwnedCollections = async (assistUrl: string, walletAddress: string): Promise<CollectionPage> => {
    try {
        let response = await fetch(`${assistUrl}/api/v2/sticker/getCollectionByOwner/${walletAddress}?marketPlace=1`)
        let data = await response.json();
        if (data['status'] != 200) {
            throw new Error("Call API to fetch owned Collections failed");
        }
        let collections: CollectionInfo[] = [];
        let body = data['data'];

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
                .setErcType(body['is721'] ? ERCType.ERC721 : ERCType.ERC1155)

            collections.push(info);
        }

        return new CollectionPage(0, 0, body.length, collections);
    }catch (error) {
        throw new Error(`Failed to get listed NFTs with error: ${error}`);
    }
}

const packItemPage = (dataArray: any): ItemPage => {
    let items: ItemInfo[] = [];
    for(var i = 0; i < dataArray.length; i++) {
        let itemInfo = dataArray[i];

        let thumbnail = itemInfo['data'] ? itemInfo['data']['thumbnail'] : itemInfo['thumbnail'];
        let image = itemInfo['data'] ? itemInfo['data']['image'] : itemInfo['asset'];
        console.log(itemInfo['endTime']);
        let itemNft = new ItemInfo(
            itemInfo['tokenId'] !== undefined ? itemInfo['tokenId'] : itemInfo['token']['tokenId'],
            itemInfo['tokenIdHex'] !== undefined ? itemInfo['tokenIdHex'] : itemInfo['token']['tokenIdHex'],
            itemInfo['name'] !== undefined ? itemInfo['name'] : itemInfo['token']['name'],
            itemInfo['description'] !== undefined ? itemInfo['description'] : itemInfo['token']['description'],
            thumbnail,
            image,
            itemInfo['adult'] !== undefined? itemInfo['adult'] : itemInfo['token']['adult'],
            itemInfo['properties'] !== undefined ? itemInfo['properties'] : itemInfo['token']['properties'],
            itemInfo['version'] !== undefined ? itemInfo['version'] : itemInfo['token']['version'],
            itemInfo['chain'] !== undefined ? itemInfo['chain'] : itemInfo['token']['chain'],
            itemInfo['tokenOwner'] !== undefined ? itemInfo['tokenOwner'] : itemInfo['token']['tokenOwner'],
            itemInfo['royaltyOwner'] !== undefined ? itemInfo['royaltyOwner'] : itemInfo['token']['royaltyOwner'],
            itemInfo['createTime'] !== undefined ? itemInfo['createTime'] : itemInfo['token']['createTime'],
            itemInfo['createTime'] !== undefined ? parseInt(itemInfo['createTime']) : parseInt(itemInfo['order']['createTime']),
            itemInfo['endTime'] !== undefined ? parseInt(itemInfo['endTime']) : parseInt(itemInfo['order']['endTime']),
            itemInfo['orderId'] !== undefined ? itemInfo['orderId'] : itemInfo['order']['orderId'],
            itemInfo['quoteToken'] !== undefined ? itemInfo['quoteToken'] : itemInfo['order']['quoteToken'],
            itemInfo['price'] !== undefined ? itemInfo['price'] : itemInfo['order']['price'],
            itemInfo['buyoutPrice'] !== undefined ? itemInfo['buyoutPrice'] : itemInfo['order']['buyoutPrice'],
            itemInfo['reservePrice'] !== undefined ? itemInfo['reservePrice'] : itemInfo['order']['reservePrice'],
            itemInfo['orderState'] !== undefined ? itemInfo['orderState'] : itemInfo['order']['orderState'],
            itemInfo['orderType'] !== undefined ? itemInfo['orderType'] : itemInfo['order']['orderType']
        );
        items.push(itemNft);
    }

    return new ItemPage(0, 0, dataArray.length, items);
}

const getOwnedItems = async (assistUrl: string, walletAddress: string): Promise<ItemPage> => {
    try {
        let response = await fetch(`${assistUrl}/api/v2/sticker/getOwnCollectiblesByAddress/${walletAddress}?orderType=0`);
        let data = await response.json();
        if (data['status'] != 200) {
            throw new Error("Call API to fetch bidding NFT failed");
        }
        return packItemPage(data['data'])
    } catch (error) {
        throw new Error(`Failed to get owned NFTs with error: ${error}`);
    }
}

const getCreatedItems = async(assistUrl: string, walletAddress: string): Promise<ItemPage> => {
    try {
        let response = await fetch(`${assistUrl}/api/v2/sticker/getCreatedCollectiblesByAddress/${walletAddress}?orderType=0`);
        let data = await response.json();
        if (data['status'] != 200) {
            throw new Error("Call API to fetch bidding NFT failed");
        }
        return packItemPage(data['data'])
    } catch (error) {
        throw new Error(`Failed to get created NFTs with error: ${error}`);
    }
}

const getListedItems = async (assistUrl: string, walletAddress: string): Promise<ItemPage> => {
    try {
        let response = await fetch(`${assistUrl}/api/v1/getListedCollectiblesByWalletAddr?walletAddr=${walletAddress}`);
        let data = await response.json();
        if (data['status'] != 200) {
            throw new Error("Call API to fetch bidding NFT failed");
        }
        return packItemPage(data['data'])
    }catch (error) {
        throw new Error(`Failed to get listed NFTs with error: ${error}`);
    }
}

const getBiddingItems = async (assistUrl: string, walletAddress: string): Promise<ItemPage> => {
    try {
        let response = await fetch(`${assistUrl}/api/v2/sticker/getBidCollectiblesByAddress/${walletAddress}?orderType=0`);
        let data = await response.json();
        if (data['status'] != 200) {
            throw new Error("Call API to fetch bidding NFT failed");
        }
        return packItemPage(data['data'])
    }catch (error) {
        throw new Error(`Failed to get bidding NFTs with error: ${error}`);
    }
}

const getSoldItems = async (assistUrl: string, walletAddress: string): Promise<ItemPage> => {
    try {
        let response = await fetch(`${assistUrl}/api/v2/sticker/getSoldCollectiblesByAddress/${walletAddress}?orderType=0`);
        let data = await response.json();
        if (data['status'] != 200) {
            throw new Error("Call API to fetch sold NFT failed");
        }
        return packItemPage(data['data'])
    } catch (error) {
        throw new Error(`Failed to get sold NFTs with error: ${error}`);
    }
}

export {
    getAllListedItems,
    getCollectionInfo,
    getItemByTokenId,
    getOwnedCollections,
    getCreatedItems,
    getOwnedItems,
    getListedItems,
    getSoldItems,
    getBiddingItems
}
