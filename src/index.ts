
'use strict';

import { getNftsOnMarketPlace } from "./getNfts";
import { signin, signout } from "./signin";
import { setNetworkType } from "./networkType";
import { MyProfile } from "./myprofile";
import { ResultApi, ResultCallContract, ResultOnIpfs } from "./utils";
import { isTestnetNetwork } from './networkType';
import { valuesOnTestNet, valuesOnMainNet } from "./constant";
import { CoinType } from "./cointype";
import { ListType } from "./listtype";
const initialize = (testnet = true) => {
    setNetworkType(testnet);
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
    exipirationTime: number,
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();
        let resultContract:ResultCallContract = await profile.listItemOnAuction(baseToken, tokenId, pricingToken, parseInt(minPrice), parseInt(reservePrice), parseInt(buyoutPrice), exipirationTime, handleProgress);
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

export {
    initialize,
    getNftsOnMarketPlace,
    mintNft,
    deleteNft,
    transferNft,
    signin,
    signout,
    getCoinType,
    listItem,
    listItemonAuction,
    getListType,
    isAuction,
}