
'use strict';

import { getNftsOnMarketPlace } from "./getNfts";
import { signin, signout } from "./signin";
import { setNetworkType } from "./networkType";
import { MyProfile } from "./myprofile";
import { ResultApi, ResultCallContract, ResultOnIpfs } from "./utils";
import { isTestnetNetwork } from './networkType';
import { valuesOnTestNet, valuesOnMainNet } from "./constant";
import { CoinType } from "./cointype";
const initialize = (testnet = true) => {
    setNetworkType(testnet);
}

const mintNft = async (
    itemName: string,
    itemDescription: string,
    itemImage: any,
    baseToken: string,
    totalSupply = 1,
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

const transferNft = () => {

}

const getCoinType = () => {
    let coinType = new CoinType();
    return coinType.getCoinTypeList();
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
    listItem
}