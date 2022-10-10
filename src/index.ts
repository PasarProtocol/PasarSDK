
'use strict';

import { signin, signout, checkSign } from "./signin";
import { isTestnetNetwork, NetworkType, setNetworkType } from "./networkType";
import { MyProfile } from "./myprofile";
import { getListTypes, isOnAuction } from "./listtype";
import { Category, getCategoryList } from "./collection/category";
import { ERCType } from "./erctype";
import { RoyaltyRate } from "./RoyaltyRate";
import { checkPasarCollection, checkFeedsCollection, StringIsNumber } from "./global";
import { Profile } from "./profile";
import { AssistService } from "./assistservice";
import { getChainTypes as _getChainTypes} from "./chaintype";
import { CollectionSocialField } from "./utils";
import { valuesOnMainNet, valuesOnTestNet } from "./constant";

let myProfileInfo, profileInfo;

const getMyProfileInfo = () => {
    if(!myProfileInfo) {
        myProfileInfo = new MyProfile(null, '', '');
    }

    return myProfileInfo;
}

const getProfileInfo = () => {
    if(!profileInfo) {
        profileInfo = new Profile();
    }

    return profileInfo;
}

const initialize = (testnet = true) => {
    setNetworkType(testnet ? NetworkType.TestNet : NetworkType.MainNet);
    getMyProfileInfo();
    getProfileInfo();
}

const mintNft = async (
    itemName: string,
    itemDescription: string,
    itemImage: any,
    baseToken: string,
    royaltyFee = 10,
    properties: any = null,
    sensitive = false,
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();
        let tokenId:string;
        let resultMetadata:string = await profile.createItemMetadata(itemName, itemDescription, itemImage, properties, sensitive, handleProgress);
        if(checkFeedsCollection(baseToken) || checkPasarCollection(baseToken))
            tokenId = await profile.createItemWithRoyalties(baseToken, resultMetadata, royaltyFee, handleProgress);
        else
            tokenId = await profile.creatItem(baseToken, resultMetadata, handleProgress);

        return tokenId;
    } catch(err) {
        throw new Error(err);
    }
}

const deleteNft = async (
    baseToken: string,
    tokenId: string,
    totalSupply = 1,
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();
        await profile.deleteItem(tokenId, baseToken, totalSupply, handleProgress);
    } catch(err) {
        throw new Error(err);
    }
}

const transferNft = async (
    baseToken: string,
    tokenId: string,
    toAddr: string,
    handleProgress: any = null
) => {
    let profile = getMyProfileInfo();
    try {
        await profile.transferItem(baseToken, tokenId, toAddr, handleProgress);
    } catch(err) {
        throw new Error(err);
    }

}

const listItem = async (
    baseToken: string,
    tokenId: string,
    pricingToken: string,
    price: string,
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();
        await profile.listItem(baseToken, tokenId, pricingToken, parseFloat(price), handleProgress);
    } catch(err) {
        throw new Error(err);
    }
}

const listItemonAuction = async (
    baseToken: string,
    tokenId: string,
    pricingToken: string,
    minPrice: string,
    reservePrice: string,
    buyoutPrice: string,
    expirationTime: number,
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();
        let current = new Date().getTime();
        if(expirationTime <= current) {
            throw new Error("The expiration time is wrong");
        }

        await profile.listItemOnAuction(baseToken, tokenId, pricingToken, parseFloat(minPrice), parseFloat(reservePrice), parseFloat(buyoutPrice), expirationTime, handleProgress);
    } catch(err) {
        throw new Error(err);
    }
}

const changePrice = async (
    tokenId: string,
    baseToken: string,
    newPrice: string,
    pricingToken: string,
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();

        let orderId: string = await profile.changePrice(tokenId, baseToken, pricingToken, parseFloat(newPrice), handleProgress);
        return orderId;
    } catch(err) {
        throw new Error(err);
    }
}

const changePriceOnAuction = async (
    tokenId: string,
    baseToken: string,
    newMinPrice: string,
    newReservedPrice: string,
    newBuyoutPrice: string,
    pricingToken: string,
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();
        let orderId = await profile.changePriceOnAuction(tokenId, baseToken, pricingToken, parseFloat(newMinPrice), parseFloat(newReservedPrice), parseFloat(newBuyoutPrice), handleProgress);
        return orderId;
    } catch(err) {
        throw new Error(err);
    }
}

const buyItem = async (
    tokenId: string,
    baseToken: string,
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();

        let orderId = await profile.buyItem(tokenId, baseToken, handleProgress);
        return orderId;
    } catch(err) {
        throw new Error(err);
    }
}

const bidItemOnAuction = async (
    tokenId: string,
    baseToken: string,
    price: string,
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();

        let orderId = await profile.bidItemOnAuction(tokenId, baseToken, parseFloat(price), handleProgress);
        return orderId;
    } catch(err) {
        throw new Error(err);
    }
}

const settleAuction = async (
    tokenId: string,
    baseToken: string,
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();

        let orderId = await profile.settleAuction(tokenId, baseToken, handleProgress);
        return orderId;
    } catch(err) {
        throw new Error(err);
    }
}

const unlistItem = async (
    tokenId: string,
    baseToken: string,
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();

        await profile.unlistItem(tokenId, baseToken, handleProgress);
    } catch(err) {
        throw new Error(err);
    }
}

const createCollection = async (
    name: string,
    description: string,
    symbol: string,
    avatar: any,
    background: any,
    itemType: ERCType,
    category: Category,
    socialMedias: any,
    royalties: RoyaltyRate[],
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();

        let resultIpfs:string = await profile.createCollectionMetadata(description, avatar, background, category, socialMedias, handleProgress);
        let collectionAddress:string = await profile.createCollection(name, symbol, resultIpfs, itemType, handleProgress);
        let address = await profile.registerCollection(collectionAddress, resultIpfs, royalties, handleProgress);

        return address;
    } catch(err) {
        throw new Error(err);
    }
}

const registerCollection = async (
    tokenAddress:string,
    description: string,
    avatar: any,
    background: any,
    category: Category,
    socialMedias: CollectionSocialField,
    royalties: RoyaltyRate[],
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();
        let resultIpfs:string = await profile.createCollectionMetadata(description, avatar, background, category, socialMedias, handleProgress);
        let resultContract:string = await profile.registerCollection(tokenAddress, resultIpfs, royalties, handleProgress);
        return resultContract;
    } catch(err) {
        throw new Error(err);
    }
}

const updateCollectionInfo = async (
    tokenAddress:string,
    name: string,
    description: string,
    avatar: any,
    background: any,
    category: Category,
    socialMedias: CollectionSocialField,
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();

        let resultIpfs = await profile.createCollectionMetadata(description, avatar, background, category, socialMedias, handleProgress);
        await profile.updateCollectionURI(tokenAddress, name, resultIpfs, handleProgress);
    } catch(err) {
        throw new Error(err);
    }
}

const updateCollectionRoyalties = async (
    tokenAddress:string,
    royalties: RoyaltyRate[],
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();
        await profile.updateCollectionRoyalties(tokenAddress, royalties, handleProgress);
    } catch(err) {
        throw new Error(err);
    }
}

const getCoinType = () => {
    //let coinType = new CoinType();
    //return coinType.getCoinTypeList();
}

const getListType = () => {
    return getListTypes();
}

const isAuction = (type:string) => {
    return isOnAuction(type);
}

const getCollectionType = () => {
    let collectionType = [];

    Object.keys(ERCType).filter(StringIsNumber).map((cell) => {
        collectionType.push(cell);
    })

    return collectionType;
}

const getCollectionCategories = () => {
    return getCategoryList();
}

const getAccountInfo = () => {
    return getProfileInfo().getUserInfo();
}

const getListedItem = async (
    collectionAddr = "",
    pageNum = 1,
    pageSize = 10,
) => {
    try {
        let assistService =  new AssistService(isTestnetNetwork() ? valuesOnTestNet.assistURL: valuesOnMainNet.assistURL);
        let info = await assistService.getAllListedItems(collectionAddr, pageNum, pageSize);
        return info;
    } catch(err) {
        throw new Error(err);
    }
}

const getOwnedCollection = async (
    walletAddr: string
) => {
    try {
        let profile = getProfileInfo();
        let info = await profile.queryCollections(walletAddr);
        return info;
    } catch(err) {
        throw new Error(err);
    }
}

const getOwnedListedItem = async (
    walletAddr: string
) => {
    try {
        let profile = getProfileInfo();
        let info = await profile.queryListedItems(walletAddr);
        return info;
    } catch(err) {
        throw new Error(err);
    }
}

const getOwnedItem = async (
    walletAddr: string
) => {
    try {
        let profile = getProfileInfo();
        let info = await profile.queryOwnedItems(walletAddr);
        return info;
    } catch(err) {
        throw new Error(err);
    }
}

const getCreatedItem = async (
    walletAddr: string
) => {
    try {
        let profile = getProfileInfo();
        let info = await profile.queryCreatedItems(walletAddr);
        return info;
    } catch(err) {
        throw new Error(err);
    }
}

const getBiddingItem = async (
    walletAddr: string
) => {
    try {
        let profile = getProfileInfo();
        let info = await profile.queryBiddingItems(walletAddr);
        return info;
    } catch(err) {
        throw new Error(err);
    }
}

const getSoldItem = async (
    walletAddr: string
) => {
    try {
        let profile = getProfileInfo();
        let info = await profile.querySoldItems(walletAddr);
        return info;
    } catch(err) {
        throw new Error(err);
    }
}

const getChainTypes = () => {
    return _getChainTypes();
}

const getCollectionSocialField = () => {
    let socials: CollectionSocialField = {
        "website": "",
        "profile": "",
        "feeds": "",
        "twitter": "",
        "discord": "",
        "telegram": "",
        "medium": ""
    }

    return socials;
}

const signIn = async() => {
    let userInfo = await signin();
    getProfileInfo().setUserInfo(userInfo);
}

const singOut = async() => {
    await signout();
    getProfileInfo().deleteUserInfo();
}

export {
    initialize,
    mintNft,
    deleteNft,
    transferNft,
    signIn,
    singOut,
    checkSign,
    getCoinType,
    listItem,
    listItemonAuction,
    getListType,
    isAuction,
    changePrice,
    changePriceOnAuction,
    buyItem,
    bidItemOnAuction,
    settleAuction,
    unlistItem,
    createCollection,
    registerCollection,
    getCollectionType,
    getCollectionCategories,
    getCollectionSocialField,
    getAccountInfo,
    updateCollectionInfo,
    updateCollectionRoyalties,
    getListedItem,
    getOwnedCollection,
    getOwnedListedItem,
    getOwnedItem,
    getCreatedItem,
    getBiddingItem,
    getSoldItem,
    getChainTypes,
}