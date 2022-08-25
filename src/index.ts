
'use strict';

import { mintNFT } from "./pasarCollection";
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
    signin,
    signout
}