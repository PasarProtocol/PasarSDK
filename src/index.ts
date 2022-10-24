
'use strict';

import { MyProfile } from "./myprofile";
import { getListTypes, isOnAuction } from "./listtype";
import { Category } from "./collection/category";
import { ERCType } from "./erctype";
import { RoyaltyRate } from "./collection/RoyaltyRate";
import { StringIsNumber } from "./global";
import { Profile } from "./profile";
import { Market } from "./market";
import { getChainTypes as _getChainTypes} from "./chaintype";
import { SocialLinks } from "./sociallinks";
import { AppContext } from "./appcontext";
import { ListType } from "./listtype";
import { Token } from "./token";

let myProfileInfo, profileInfo;

const getMyProfileInfo = () => {
    if(!myProfileInfo) {
        myProfileInfo = new MyProfile('', '', null, null, null);
    }
    return myProfileInfo;
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
    changePrice,
    changePriceOnAuction,
    buyItem,
    bidItemOnAuction,
    settleAuction,
    unlistItem,
    Category,
    ERCType,
    SocialLinks,
    ListType,
    Token,
    AppContext,
    Profile,
    MyProfile,
    Market
}
