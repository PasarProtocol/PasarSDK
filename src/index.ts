
'use strict';

import { MyProfile } from "./myprofile";
import { getListTypes, isOnAuction } from "./listtype";
import { Category, getCategoryList } from "./collection/category";
import { ERCType } from "./erctype";
import { RoyaltyRate } from "./collection/RoyaltyRate";
import { StringIsNumber } from "./global";
import { Profile } from "./profile";
import { Market } from "./market";
import { getChainTypes as _getChainTypes} from "./chaintype";
import { SocialLinks } from "./sociallinks";
import { AppContext } from "./appcontext";

let myProfileInfo, profileInfo;

const getMyProfileInfo = () => {
    if(!myProfileInfo) {
        myProfileInfo = new MyProfile('', '', null, null, null);
    }
    return myProfileInfo;
}

const getProfileInfo = () => {
    if(!profileInfo) {
        profileInfo = new Profile('', '');
    }

    return profileInfo;
}

const initialize = (testnet = true) => {
    AppContext.createAppContext(testnet);
    getMyProfileInfo();
    getProfileInfo();
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

const getChainTypes = () => {
    return _getChainTypes();
}


export {
    initialize,
    transferNft,
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
    getChainTypes,
    Category,
    ERCType,
    SocialLinks,
    AppContext,
    Profile,
    MyProfile,
    Market
}
