
'use strict';

import { mintNFT, burn, transfer } from "./pasarCollection";
import { getNftsOnMarketPlace } from "./getNfts";
import { signin, signout } from "./signin";
import { setNetworkType } from "./networkType";

const initialize = (testnet = true) => {
    setNetworkType(testnet);
}

export {
    initialize,
    getNftsOnMarketPlace,
    mintNFT,
    burn,
    transfer,
    signin,
    signout
}