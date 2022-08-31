
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
    totalSupply: number = 1,
    royaltyFee: number = 10,
    properties: any = [],
    sensitive: boolean = false,
    handleProgress: any = null
) => {
    let result: ResultApi; 
    try {
        let profile = new MyProfile();
        let resultMetadata:ResultOnIpfs = await profile.createItemMetadata(itemName, itemDescription, itemImage, version, properties, sensitive, handleProgress);
        if(resultMetadata.success === true) {
            let resultContract:ResultCallContract = await profile.createItemWithRoyalties(resultMetadata.tokenId, baseToken, totalSupply, resultMetadata.medadata, royaltyFee, handleProgress);
            if(resultContract.success) {
                result = {
                    success: true,
                    data: resultMetadata.tokenId,
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

const burnNft = () => {

}

const transferNft = () => {

}

export {
    initialize,
    getNftsOnMarketPlace,
    mintNft,
    burnNft,
    transferNft,
    signin,
    signout
}