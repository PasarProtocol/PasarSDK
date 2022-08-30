/**
 * This is of setting the testnet or network
 */

import { networkType } from "./constant";

/**
 * set the network type
 *
 * @param testnet the value of network, if testnet, true, else false
 */
const setNetWorkType = (testnet) => {
    if(testnet) {
        sessionStorage.setItem("network", networkType.TestNet);
    } else {
        sessionStorage.setItem("network", networkType.MainNet);
    }
}

/**
 * get the network type
 *
 * @return if testnet, true, else false
 */
const isTestNetwork = () => {
    let currentNetwork = sessionStorage.getItem("network");

    if(currentNetwork == networkType.TestNet) {
        return true;
    } else {
        return false;
    }
}

export {
    setNetWorkType,
    isTestNetwork
}