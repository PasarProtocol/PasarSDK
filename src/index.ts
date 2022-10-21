
'use strict';

import { MyProfile } from "./myprofile";
import { ListType } from "./listtype";
import { Category } from "./collection/category";
import { ERCType } from "./erctype";
import { Profile } from "./profile";
import { Market } from "./market";
import { getChainTypes as _getChainTypes} from "./chaintype";
import { SocialLinks } from "./sociallinks";
import { AppContext } from "./appcontext";
import { Token } from "./token";

let myProfileInfo, profileInfo;

const getMyProfileInfo = () => {
    if(!myProfileInfo) {
        myProfileInfo = new MyProfile('', '', null, null, null);
    }
    return myProfileInfo;
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

export {
    listItemonAuction,
    changePrice,
    changePriceOnAuction,
    buyItem,
    bidItemOnAuction,
    settleAuction,
    unlistItem,
    Category,
    ERCType,
    ListType,
    Token,
    SocialLinks,
    AppContext,
    Profile,
    MyProfile,
    Market
}
