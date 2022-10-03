
'use strict';

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
import { checkPasarCollection, checkFeedsCollection, StringIsNumber } from "./global";
import { getUserInfo } from "./userinfo";
import { Profile } from "./profile";
import { CallAssistService } from "./callassistservice";
import { ChainTypes } from "./chaintype";
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
            if(checkFeedsCollection(baseToken) || checkPasarCollection(baseToken))
                resultContract = await profile.createItemWithRoyalties(baseToken, resultMetadata.medadata, royaltyFee, handleProgress);
            else 
                resultContract = await profile.creatItem(baseToken, resultMetadata.medadata, handleProgress);
            
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
        let resultContract:ResultCallContract = await profile.listItem(baseToken, tokenId, pricingToken, parseFloat(price), handleProgress);
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

        let resultContract:ResultCallContract = await profile.listItemOnAuction(baseToken, tokenId, pricingToken, parseFloat(minPrice), parseFloat(reservePrice), parseFloat(buyoutPrice), expirationTime, handleProgress);
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
    tokenId: string,
    baseToken: string,
    newPrice: string,
    pricingToken: string,
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();

        let resultContract:ResultCallContract = await profile.changePrice(tokenId, baseToken, pricingToken, parseFloat(newPrice), handleProgress);
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

const changePriceOnAuction = async (
    tokenId: string,
    baseToken: string,
    newMinPrice: string,
    newReservedPrice: string,
    newBuyoutPrice: string,
    pricingToken: string,
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();

        let resultContract:ResultCallContract = await profile.changePriceOnAuction(tokenId, baseToken, pricingToken, parseFloat(newMinPrice), parseFloat(newReservedPrice), parseFloat(newBuyoutPrice), handleProgress);
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

const buyItem = async (
    tokenId: string,
    baseToken: string,
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();
        
        let resultContract:ResultCallContract = await profile.buyItem(tokenId, baseToken, handleProgress);
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

const bidItemOnAuction = async (
    tokenId: string,
    baseToken: string,
    price: string,
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();

        let resultContract:ResultCallContract = await profile.bidItemOnAuction(tokenId, baseToken, parseFloat(price), handleProgress);
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

const settleAuction = async (
    tokenId: string,
    baseToken: string,
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();

        let resultContract:ResultCallContract = await profile.settleAuction(tokenId, baseToken, handleProgress);
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

const unlistItem = async (
    tokenId: string,
    baseToken: string,
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();

        let resultContract:ResultCallContract = await profile.unlistItem(tokenId, baseToken, handleProgress);
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
    try {
        let profile = new MyProfile();

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
    category: CollectionCategory,
    socialMedias: any,
    royalties: RoyaltyRate[],
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();

        let resultIpfs:string = await profile.createCollectionMetadata(description, avatar, background, category, socialMedias, handleProgress);
        let resultContract:string = await profile.registerCollection(tokenAddress, resultIpfs, royalties, handleProgress);
        return resultContract;
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

        let resultIpfs = await profile.createCollectionMetadata(description, avatar, background, category, socialMedias, handleProgress);
        let resultContract:ResultCallContract = await profile.updateCollectionURI(tokenAddress, name, resultIpfs, handleProgress);
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

const updateCollectionRoyalties = async (
    tokenAddress:string,
    royalties: RoyaltyRate[],
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();
        
        let resultContract:ResultCallContract = await profile.updateCollectionRoyalties(tokenAddress, royalties, handleProgress);
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

const getListedItem = async (
    collectionAddr = "",
    pageNum = 1,
    pageSize = 10,
) => {
    try {
        let callAssistService =  new CallAssistService();
        let info = await callAssistService.getNftsOnMarketPlace(collectionAddr, pageNum, pageSize);
        return info;
    } catch(err) {
        throw new Error(err);
    }
}

const getOwnedCollection = async (
    walletAddr: string
) => {
    try {
        let profile =  new Profile();
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
        let profile =  new Profile();
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
        let profile =  new Profile();
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
        let profile =  new Profile();
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
        let profile =  new Profile();
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
        let profile =  new Profile();
        let info = await profile.querySoldItems(walletAddr);
        return info;
    } catch(err) {
        throw new Error(err);
    }
}

const getChainTypes = () => {
    let chainTypes: ChainTypes = new ChainTypes();
    return chainTypes.getChainTypes();
}

export {
    initialize,
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