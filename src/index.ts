
'use strict';

import { mintNFT } from "./pasarCollection";
import { getNftsOnMarketPlace } from "./getNfts"
import { utils } from "./utils";


const initialize = (testnet: boolean = true) => {
    utils.testNet = testnet;
}

export {
    initialize,
    getNftsOnMarketPlace,
    mintNFT,
}