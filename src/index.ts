
'use strict';

import { getNftsOnMarketPlace } from "./getNfts";
import { signin, signout } from "./signin";
import { setNetworkType } from "./networkType";
import { MyProfile } from "./myprofile";
import { ResultApi, ResultCallContract, ResultOnIpfs } from "./utils";

const initialize = (testnet = true) => {
    setNetworkType(testnet);
}

const mintNft = async (
    itemName: string,
    itemDescription: string,
    itemImage: any,
    version: number,
    baseToken: string,
    totalSupply = 1,
    royaltyFee = 10,
    properties: any = [],
    sensitive = false,
    handleProgress: any = null
) => {
    let result: ResultApi;
    try {
        let profile = new MyProfile();
        let resultMetadata:string = await profile.createItemMetadata(itemName, itemDescription, itemImage, properties, sensitive, handleProgress);
        let resultContract:ResultCallContract = await profile.createItemWithRoyalties(baseToken, resultMetadata, royaltyFee, handleProgress);
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

const transferNft = () => {

}

export {
    initialize,
    getNftsOnMarketPlace,
    mintNft,
    deleteNft,
    transferNft,
    signin,
    signout
}