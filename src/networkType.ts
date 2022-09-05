/**
 * Chain network enviroment - Mainnet or Testnet
 */
export enum NetworkType {
    TestNet = "TestNet",
    MainNet = "MainNet",
}

let networkType;
/**
 * set the network type
 *
 * @param testnet the value of network, if testnet, true, else false
 */
const setNetworkType = (net: NetworkType) => {
    networkType = net;
}

/**
 * get the network type
 *
 * @return if testnet, true, else false
 */
const isTestnetNetwork = () => {
    return networkType == NetworkType.TestNet;
}

export {
    setNetworkType,
    isTestnetNetwork
}
