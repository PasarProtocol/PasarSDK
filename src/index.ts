
'use strict';

import { mintNFT, burn } from "./pasarCollection";
import { getNftsOnMarketPlace } from "./getNfts"
import { utils } from "./utils";
import { signin, signout } from "./signin";

const initialize = (testnet = true) => {
    utils.testNet = testnet;
}

export {
    initialize,
    getNftsOnMarketPlace,
    mintNFT,
    burn,
    signin,
    signout
}