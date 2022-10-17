
'use strict';

import { signin, signout, checkSign } from "./signin";
import { MyProfile } from "./myprofile";
import { getListTypes, isOnAuction } from "./listtype";
import { Category, getCategoryList } from "./collection/category";
import { ERCType } from "./erctype";
import { RoyaltyRate } from "./collection/RoyaltyRate";
import { StringIsNumber } from "./global";
import { Profile } from "./profile";
import { Market } from "./market";
import { getChainTypes as _getChainTypes} from "./chaintype";

import { AppContext } from "./appcontext";

let myProfileInfo, profileInfo;

const getMyProfileInfo = () => {
    if(!myProfileInfo) {
        myProfileInfo = new MyProfile('', '', null, null, null, null);
    }
    return myProfileInfo;
}

const getProfileInfo = () => {
    if(!profileInfo) {
        profileInfo = new Profile('', '',  AppContext.getAppContext());
    }

    return profileInfo;
}

const initialize = (testnet = true) => {
    AppContext.createAppContext(testnet);
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
        tokenId = await profile.createItemWithRoyalties(baseToken, resultMetadata, royaltyFee, handleProgress);

        return tokenId;
    } catch(err) {
        throw new Error(err);
    }
}

const deleteNft = async (
    baseToken: string,
    tokenId: string,
    ercType: ERCType,
    totalSupply = 1,
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();
        await profile.deleteItem(tokenId, baseToken, ercType, totalSupply, handleProgress);
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
    orderId: string,
    newPrice: string,
    pricingToken: string,
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();

        await profile.changePrice(orderId, pricingToken, parseFloat(newPrice), handleProgress);
    } catch(err) {
        throw new Error(err);
    }
}

const changePriceOnAuction = async (
    orderId: string,
    newMinPrice: string,
    newReservedPrice: string,
    newBuyoutPrice: string,
    pricingToken: string,
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();
        await profile.changePriceOnAuction(orderId, pricingToken, parseFloat(newMinPrice), parseFloat(newReservedPrice), parseFloat(newBuyoutPrice), handleProgress);
    } catch(err) {
        throw new Error(err);
    }
}

const buyItem = async (
    orderId: string,
    buyingPrice: number,
    quoteToken: string,
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();
        await profile.buyItem(orderId, buyingPrice, quoteToken, handleProgress);
    } catch(err) {
        throw new Error(err);
    }
}

const bidItemOnAuction = async (
    orderId: string,
    quoteToken: string,
    price: string,
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();

        await profile.bidItemOnAuction(orderId, quoteToken, parseFloat(price), handleProgress);
    } catch(err) {
        throw new Error(err);
    }
}

const settleAuction = async (
    orderId: string,
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();
        await profile.settleAuction(orderId, handleProgress);
    } catch(err) {
        throw new Error(err);
    }
}

const unlistItem = async (
    orderId: string,
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();
        await profile.unlistItem(orderId, handleProgress);
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
    socialMedias: any,
    royalties: RoyaltyRate[],
    handleProgress: any = null
) => {
    try {
        let profile = getMyProfileInfo();

        let resultIpfs:string = await profile.createCollectionMetadata(description, avatar, background, category, socialMedias, handleProgress);
        await profile.registerCollection(tokenAddress, resultIpfs, royalties, handleProgress);
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
    socialMedias: any,
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
    return getMyProfileInfo().getUserInfo();
}

const getChainTypes = () => {
    return _getChainTypes();
}

const signIn = async() => {
    let userInfo = await signin();
    myProfileInfo = new MyProfile(userInfo['did'], userInfo['address'], null, null, null, null);
    getMyProfileInfo().setUserInfo(userInfo);
}

const singOut = async() => {
    await signout();
    getMyProfileInfo().deleteUserInfo();
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
    getAccountInfo,
    updateCollectionInfo,
    updateCollectionRoyalties,
    getChainTypes,
    AppContext,
    Profile,
    Market
}
