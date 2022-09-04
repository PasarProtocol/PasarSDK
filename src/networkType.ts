/**
 * Chain network enviroment - Mainnet or Testnet
 */
export enum NetworkType {
    TestNet = "TestNet",
    MainNet = "MainNet",
}

/**
 * set the network type
 *
 * @param testnet the value of network, if testnet, true, else false
 */
const setNetworkType = (testnet: NetworkType) => {
    sessionStorage.setItem("network", testnet ? NetworkType.TestNet: NetworkType.MainNet)
}

/**
 * get the network type
 *
 * @return if testnet, true, else false
 */
const isTestnetNetwork = () => {
    return (sessionStorage.getItem("network") == NetworkType.TestNet)
}

export {
    setNetworkType,
    isTestnetNetwork
}
