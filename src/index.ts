
'use strict';

import { getNftsOnMarketPlace } from "./getNfts";
import { signin, signout, checkSign } from "./signin";
import { NetworkType, setNetworkType } from "./networkType";
import { MyProfile } from "./myprofile";
import { ResultApi, ResultCallContract, ResultOnIpfs } from "./utils";
import { valuesOnTestNet, valuesOnMainNet } from "./constant";
import { CoinType } from "./cointype";
import { ListType } from "./listtype";
import { CollectionCategory } from "./collectioncategory";
import { ItemType } from "./itemtype";
import { RoyaltyRate } from "./RoyaltyRate";
import { StringIsNumber } from "./global";
import { getUserInfo } from "./userinfo";
const initialize = (testnet = true) => {
    setNetworkType(testnet ? NetworkType.TestNet : NetworkType.MainNet);
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
    let result: ResultApi;
    try {
        let profile = new MyProfile();
        let resultContract:ResultCallContract;

        let resultMetadata:ResultOnIpfs = await profile.createItemMetadata(itemName, itemDescription, itemImage, baseToken, properties, sensitive, handleProgress);

        if(resultMetadata.success == true) {
            if(baseToken == valuesOnMainNet.elastos.stickerContract || baseToken == valuesOnMainNet.elastos.stickerV2Contract || baseToken == valuesOnTestNet.elastos.stickerContract || baseToken == valuesOnTestNet.elastos.stickerV2Contract)
                resultContract = await profile.createItemWithRoyalties(baseToken, resultMetadata.medadata, royaltyFee, handleProgress);

            if(resultContract.success) {
                result = {
                    success: true,
                    data: resultContract.data,
                }
            } else {
                result = {
                    success: false,
                    data: resultContract.data,
                }
            }
        } else {
            result = {
                success: false,
                data: resultMetadata.result,
            }
        }
    } catch(err) {
        result = {
            success: false,
            data: err
        }
    }

    return result;
}

const deleteNft = async (
    baseToken: string,
    tokenId: string,
    totalSupply = 1,
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();
        let resultContract:ResultCallContract = await profile.deleteItem(tokenId, baseToken, totalSupply, handleProgress);
        if(resultContract.success) {
            result = {
                success: true,
                data: tokenId,
            }
        } else {
            result = {
                success: false,
                data: resultContract.data,
            }
        }
    } catch(err) {
        result = {
            success: false,
            data: err
        }
    }
    return result;
}


const transferNft = async (
    baseToken: string,
    tokenId: string,
    toAddr: string,
    handleProgress: any = null
) => {
    let profile = new MyProfile();
    let resultContract:boolean = await profile.transferItem(baseToken, tokenId, toAddr, handleProgress);
    return resultContract;
}


const listItem = async (
    baseToken: string,
    tokenId: string,
    pricingToken: string,
    price: string,
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();
        let resultContract:ResultCallContract = await profile.listItem(baseToken, tokenId, pricingToken, parseInt(price), handleProgress);
        if(resultContract.success) {
            result = {
                success: true,
                data: tokenId,
            }
        } else {
            result = {
                success: false,
                data: resultContract.data,
            }
        }
    } catch(err) {
        result = {
            success: false,
            data: err
        }
    }
    return result;
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
    let result: ResultApi;
    try {
        let profile = new MyProfile();
        let current = new Date().getTime();
        if(expirationTime <= current) {
            return {
                success: false,
                data: "The expiration time is wrong",
            }
        }

        let resultContract:ResultCallContract = await profile.listItemOnAuction(baseToken, tokenId, pricingToken, parseInt(minPrice), parseInt(reservePrice), parseInt(buyoutPrice), expirationTime, handleProgress);
        if(resultContract.success) {
            result = {
                success: true,
                data: tokenId,
            }
        } else {
            result = {
                success: false,
                data: resultContract.data,
            }
        }
    } catch(err) {
        result = {
            success: false,
            data: err
        }
    }
    return result;
}

const changePrice = async (
    orderId: string,
    newPrice: string,
    pricingToken: string,
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();

        let resultContract:ResultCallContract = await profile.changePrice(parseInt(orderId), pricingToken, parseInt(newPrice), handleProgress);
        if(resultContract.success) {
            result = {
                success: true,
                data: orderId,
            }
        } else {
            result = {
                success: false,
                data: resultContract.data,
            }
        }
    } catch(err) {
        result = {
            success: false,
            data: err
        }
    }
    return result;
}

const changePriceOnAuction = async (
    orderId: string,
    newMinPrice: string,
    newReservedPrice: string,
    newBuyoutPrice: string,
    pricingToken: string,
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();

        let resultContract:ResultCallContract = await profile.changePriceOnAuction(parseInt(orderId), pricingToken, parseInt(newMinPrice), parseInt(newReservedPrice), parseInt(newBuyoutPrice), handleProgress);
        if(resultContract.success) {
            result = {
                success: true,
                data: orderId,
            }
        } else {
            result = {
                success: false,
                data: resultContract.data,
            }
        }
    } catch(err) {
        result = {
            success: false,
            data: err
        }
    }
    return result;
}

const buyItem = async (
    orderId: string,
    price: string,
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();
        
        let resultContract:ResultCallContract = await profile.buyItem(orderId, parseInt(price), handleProgress);
        if(resultContract.success) {
            result = {
                success: true,
                data: orderId,
            }
        } else {
            result = {
                success: false,
                data: resultContract.data,
            }
        }
    } catch(err) {
        result = {
            success: false,
            data: err
        }
    }
    return result;
}

const bidItemOnAuction = async (
    orderId: string,
    price: string,
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();

        let resultContract:ResultCallContract = await profile.bidItemOnAuction(orderId, parseInt(price), handleProgress);
        if(resultContract.success) {
            result = {
                success: true,
                data: orderId,
            }
        } else {
            result = {
                success: false,
                data: resultContract.data,
            }
        }
    } catch(err) {
        result = {
            success: false,
            data: err
        }
    }
    return result;
}

const settleAuction = async (
    orderId: string,
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();

        let resultContract:ResultCallContract = await profile.settleAuction(orderId, handleProgress);
        if(resultContract.success) {
            result = {
                success: true,
                data: orderId,
            }
        } else {
            result = {
                success: false,
                data: resultContract.data,
            }
        }
    } catch(err) {
        result = {
            success: false,
            data: err
        }
    }
    return result;
}

const unlistItem = async (
    orderId: string,
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();

        let resultContract:ResultCallContract = await profile.unlistItem(orderId, handleProgress);
        if(resultContract.success) {
            result = {
                success: true,
                data: orderId,
            }
        } else {
            result = {
                success: false,
                data: resultContract.data,
            }
        }
    } catch(err) {
        result = {
            success: false,
            data: err
        }
    }
    return result;
}

const createCollection = async (
    name: string,
    description: string,
    symbol: string,
    avatar: any,
    background: any,
    itemType: ItemType,
    category: CollectionCategory,
    socialMedias: any,
    royalties: RoyaltyRate[],
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();

        let resultIpfs:ResultOnIpfs = await profile.createCollectionMetadata(description, avatar, background, category, socialMedias, handleProgress);
        if(!resultIpfs.success) {
            return result = {
                success: false,
                data: resultIpfs.result,
            }
        }
        let resultContract:ResultCallContract = await profile.createCollection(name, symbol, resultIpfs.medadata, itemType, handleProgress);
        if(!resultContract.success) {
            return result = {
                success: false,
                data: resultContract.data,
            }
        }
        resultContract = await profile.registerCollection(resultContract.data, resultIpfs.medadata, royalties, handleProgress);
        return result = {
            success: resultContract.success,
            data: resultContract.data,
        }
        
    } catch(err) {
        return result = {
            success: false,
            data: err
        }
    }
}

const registerCollection = async (
    tokenAddress:string,
    description: string,
    avatar: any,
    background: any,
    category: CollectionCategory,
    socialMedias: any,
    royalties: RoyaltyRate[],
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();

        let resultIpfs:ResultOnIpfs = await profile.createCollectionMetadata(description, avatar, background, category, socialMedias, handleProgress);
        if(!resultIpfs.success) {
            return result = {
                success: false,
                data: resultIpfs.result,
            }
        }
        
        let resultContract:ResultCallContract = await profile.registerCollection(tokenAddress, resultIpfs.medadata, royalties, handleProgress);
        return result = {
            success: resultContract.success,
            data: resultContract.data,
        }
        
    } catch(err) {
        return result = {
            success: false,
            data: err
        }
    }
}

const updateCollectionInfo = async (
    tokenAddress:string,
    name: string,
    description: string,
    avatar: any,
    background: any,
    category: CollectionCategory,
    socialMedias: any,
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();

        let resultIpfs:ResultOnIpfs = await profile.createCollectionMetadata(description, avatar, background, category, socialMedias, handleProgress);
        if(!resultIpfs.success) {
            return result = {
                success: false,
                data: resultIpfs.result,
            }
        }
        
        let resultContract:ResultCallContract = await profile.updateCollectionURI(tokenAddress, name, resultIpfs.medadata, handleProgress);
        return result = {
            success: resultContract.success,
            data: resultContract.data,
        }
        
    } catch(err) {
        return result = {
            success: false,
            data: err
        }
    }
}

const getCoinType = () => {
    let coinType = new CoinType();
    return coinType.getCoinTypeList();
}

const getListType = () => {
    let listType = new ListType();
    return listType.getListTypes();
}

const isAuction = (type:string) => {
    let listType = new ListType();
    return listType.isAuction(type);
}

const getCollectionType = () => {
    let collectionType = [];

    Object.keys(ItemType).filter(StringIsNumber).map((cell) => {
        collectionType.push(cell);
    })

    return collectionType;
}

const getCollectionCategories = () => {
    let collectionType = [];

    Object.keys(CollectionCategory).filter(StringIsNumber).map((cell) => {
        collectionType.push(cell);
    })
    
    return collectionType;
}

const getAccountInfo = () => {
    return getUserInfo();
}

export {
    initialize,
    getNftsOnMarketPlace,
    mintNft,
    deleteNft,
    transferNft,
    signin,
    signout,
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
}