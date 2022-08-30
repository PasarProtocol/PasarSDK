
'use strict';

import { mintNFT, burn, transfer } from "./pasarCollection";
import { getNftsOnMarketPlace } from "./getNfts";
import { signin, signout } from "./signin";
import { setNetWorkType } from "./networkType";

const initialize = (testnet = true) => {
    setNetWorkType(testnet);
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