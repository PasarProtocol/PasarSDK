import Web3 from 'web3';
import { isTestnetNetwork } from './networkType';
import { valuesOnTestNet, valuesOnMainNet } from "./constant";
import { resizeImage, isInAppBrowser, getFilteredGasPrice } from "./global";
import { TransactionParams } from './utils';

/**
 * This class is to call the contract functions
 */
export class CallContract {

    /**
     * call the mint function on contract
     *
     * @param contractAbi abi file for calling
     * @param contractAddress address of contract
     * @param account my wallet address
     * @param tokenId tokenId of being minted
     * @param totalSupply quantity of nft of being minted
     * @param royaltyFee royalty fee of nft
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being minted the nft
     */
    public mintFunction (
        contractAbi: any,
        contractAddress: string,
        account: string,
        tokenId: string,
        totalSupply: number,
        metaData: string,
        royaltyFee: number,
        essentialsConnector: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const _gasLimit = 5000000;
            const transactionParams: TransactionParams = {
                'from': account,
                'gasPrice': gasPrice,
                'gas': _gasLimit,
                'value': 0
            };
    
            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
    
            let pasarContract = new walletConnectWeb3.eth.Contract(contractAbi, contractAddress);
            pasarContract.methods.mint(tokenId, totalSupply, metaData, royaltyFee).send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    /**
     * call the mint function on contract
     *
     * @param contractAbi abi file for calling
     * @param contractAddress address of contract
     * @param account my wallet address
     * @param tokenId tokenId of being minted
     * @param totalSupply quantity of nft of being minted
     * @param royaltyFee royalty fee of nft
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being minted the nft
     */
     public deleteFunction (
        contractAbi: any,
        contractAddress: string,
        account: string,
        tokenId: string,
        totalSupply: number,
        essentialsConnector: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const _gasLimit = 5000000;
            const transactionParams: TransactionParams = {
                'from': account,
                'gasPrice': gasPrice,
                'gas': _gasLimit,
                'value': 0
            };
    
            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
    
            let pasarContract = new walletConnectWeb3.eth.Contract(contractAbi, contractAddress);
            pasarContract.methods.burn(tokenId, totalSupply).send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }
}