
'use strict';

import { mintNFT, burn } from "./pasarCollection";
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
    signin,
    signout
}