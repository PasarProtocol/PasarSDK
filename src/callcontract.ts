import Web3 from 'web3';
import { LimitGas, defaultAddress } from "./constant";
import { checkPasarCollection, checkFeedsCollection } from "./global";
import { UserInfo } from './utils';
import marketV2ABI from "./contracts/abis/marketV2";
import RegistryABI from "./contracts/abis/registry";
import COMMON_CONTRACT_ABI from "./contracts/abis/commonABI";
import Token721ABI from './contracts/abis/token721ABI';
import Token1155ABI from './contracts/abis/token1155ABI';
import Token20ABI from './contracts/abis/erc20ABI';
import { RoyaltyRate } from './RoyaltyRate';
import { ERCType } from './erctype';
import { AppContext } from './appcontext';

/**
 * This class is to call the contract functions
 */
export class CallContract {
    private gasLimit = LimitGas;
    private account: string;
    private web3: Web3;

    constructor(account: string) {
        this.account = account;
        this.web3 = AppContext.getAppContext().getWeb3();
    }

    public mintFunction (
        contractAbi: any,
        contractAddress: string,
        tokenId: string,
        totalSupply: number,
        metaData: string,
        royaltyFee: number,
        userInfo: UserInfo,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams = {
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': this.gasLimit,
                'value': gasPrice,
            };

            let pasarContract = new this.web3.eth.Contract(contractAbi, contractAddress);
            if(checkPasarCollection(contractAddress)) {
                pasarContract.methods.mint(tokenId, totalSupply, metaData, royaltyFee * 10000).send(transactionParams).on('receipt', (receipt) => {
                    resolve(receipt);
                }).on('error', (error) => {
                    reject(error)
                });
            } else if(checkFeedsCollection(contractAddress)) {
                pasarContract.methods.mint(tokenId, totalSupply, metaData, royaltyFee * 10000, userInfo.did).send(transactionParams).on('receipt', (receipt) => {
                    resolve(receipt);
                }).on('error', (error: any) => {
                    reject(error)
                });
            }
        })
    }

    public mintFunctionOnCustomCollection (
        contractAddress: string,
        tokenId: string,
        collectionType: string,
        metaData: string,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            let pasarContract = new this.web3.eth.Contract(Token721ABI, contractAddress);
            let mintFunction = pasarContract.methods.mint(tokenId, metaData);

            if(collectionType == ERCType.ERC1155) {
                pasarContract = new this.web3.eth.Contract(Token1155ABI, contractAddress);
                mintFunction = pasarContract.methods.mint(tokenId, 1, metaData);
            }

            mintFunction.send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': this.gasLimit,
                'value': gasPrice,
            }).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    public deleteFunction (
        contractAbi: any,
        contractAddress: string,
        tokenId: string,
        totalSupply: number,
        collectionType: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            let pasarContract = new this.web3.eth.Contract(contractAbi, contractAddress);
            let burnFunction = pasarContract.methods.burn(tokenId, totalSupply);
            if(!checkFeedsCollection(contractAddress) && !checkPasarCollection(contractAddress) && collectionType == ERCType.ERC721) {
                pasarContract.methods.burn(tokenId);
            }
            burnFunction.send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': this.gasLimit,
                'value': gasPrice,
            }).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    public createOrderForSale (
        tokenId: string,
        baseToken: string,
        price: string,
        quoteToken: string,
        userInfo: UserInfo,
        marketContract: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            let pasarContract = new this.web3.eth.Contract(marketV2ABI, marketContract);
            pasarContract.methods.createOrderForSale(baseToken, tokenId, 1, quoteToken, price, (new Date().getTime()/1000).toFixed(), userInfo.did).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': this.gasLimit,
                'value': gasPrice,
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            });
        })
    }

    // Approve the NFT item on collection can be sold on market.
    public approvalForAll (
        contractAbi: any,
        baseToken: string,
        approvalAddress: any,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(contractAbi, baseToken).methods.setApprovalForAll(approvalAddress, true).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': this.gasLimit,
                'value': gasPrice,
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            });
        })
    }

    // Transfer NFT to another address.
    public transferNFT (
        contractAbi: any,
        toAddress: string,
        tokenId: string,
        baseToken: string,
        collectionType: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            let stickerContract = new this.web3.eth.Contract(contractAbi, baseToken);
            let transferFunction = stickerContract.methods.safeTransferFrom(this.account, toAddress, tokenId, 1);
            if(collectionType == ERCType.ERC721)
                transferFunction = stickerContract.methods.safeTransferFrom(this.account, toAddress, tokenId);

            transferFunction.send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': this.gasLimit,
                'value': gasPrice,
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            });
        })
    }

    // List NFT item on market on auction mode.
    public createOrderForAuction (
        baseToken: string,
        tokenId: string,
        quoteToken: string,
        minPrice: number,
        reservePrice: number,
        buyoutPrice: number,
        expirationTime: number,
        userInfo: UserInfo,
        marketContract: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.createOrderForAuction(
                baseToken,
                tokenId,
                1,
                quoteToken,
                BigInt(minPrice*1e18).toString(),
                BigInt(reservePrice*1e18).toString(),
                BigInt(buyoutPrice*1e18).toString(),
                (new Date().getTime()/1000).toFixed(),
                (expirationTime/1000).toFixed(), userInfo.did
            ).send({'from': this.account,
                'gasPrice': gasPrice,
                'gas': this.gasLimit,
                'value': gasPrice,
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            });
        })
    }

    public changePrice (orderId: number,
        newPrice: string,
        quoteToken: string,
        contractMarket: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, contractMarket).methods.changeSaleOrderPrice(
                orderId,
                newPrice,
                quoteToken
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': this.gasLimit,
                'value': gasPrice,
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            });
        })
    }

    // change the price for listed NFT on auction.
    public changePriceOnAuction (orderId: number,
        newMinPrice: string,
        newReservedPrice: string,
        newBuyoutPrice: string,
        quoteToken: string,
        marketContract: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.changeAuctionOrderPrice(orderId, newMinPrice, newReservedPrice, newBuyoutPrice, quoteToken).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': this.gasLimit,
                'value': gasPrice,
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            });
        })
    }

    // buy the listed nft with fixed price.
    public buyItem (orderId: string,
        price: number,
        quoteToken: string,
        did: string,
        marketContract: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.buyOrder(orderId, did).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': this.gasLimit,
                'value': quoteToken == defaultAddress ? price : 0
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            });
        })
    }

    public bidItemOnAuction (
        orderId: string,
        price: number,
        quoteToken: string,
        userInfo: UserInfo,
        marketContract: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.bidForOrder(orderId, price.toString(), userInfo.did).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': this.gasLimit,
                'value': quoteToken == defaultAddress ? price : 0
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            })
        })
    }

    public settleAuction (orderId: string,
        marketContract: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.settleAuctionOrder(orderId).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': this.gasLimit,
                'value': gasPrice
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            })
        })
    }

    // unlist NFT item from market
    public unlistItem (orderId: string,
        marketContract: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.cancelOrder(orderId).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': gasPrice
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            });
        })
    }



    /**
     * Create a NFT collection contract and deploy it on specific EVM blockchain.
     *
     * @param name The name of NFT collection
     * @param symbol The symbol of NFT collection
     * @param collectionUri the uri of nft on ipfs
     * @param contractData the contract file data
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public createCollection (
        name: string,
        symbol: string,
        collectionUri: string,
        contractData: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            let diaAddress = "0x0000000000000000000000000000000000000000"; // TODO;
            let diaValue = 0; // TODO;

            let deployArgs = [name, symbol, collectionUri, diaAddress, diaValue];

            let registerContract = new this.web3.eth.Contract(contractData.abi);
            let registeredContract = registerContract.deploy({
                data: `0x${contractData.code}`,
                arguments: deployArgs,
            })
            let transactionParams = {
                'from': this.account,
                'gas': LimitGas,
                'gasPrice': gasPrice
            }
/*
            if(isInAppBrowser())
              transactionParams['to'] = ""
              registeredContract.send(transactionParams).then(newContractInstance=>{
                console.log('Contract deployed at address: ', newContractInstance.options.address)
                resolve(newContractInstance.options.address)
            }).catch((error) => {
                reject(error);
            })
*/
        })

    }

   // Register a collection contract onto Pasar marketplace platform.
     public registerCollection (
        collectionAddr: string,
        name: string,
        collectionUri: string,
        royaltyRates: RoyaltyRate[],
        registryContract: string,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            let pasarRegister = new this.web3.eth.Contract(RegistryABI, registryContract);
            let owners = [], royalties = [];

            for(var i = 0; i < royaltyRates.length; i++) {
                owners.push(royaltyRates[i].address);
                royalties.push(royaltyRates[i].rate*10000)
            }
            pasarRegister.methods.registerToken(collectionAddr, name, collectionUri, owners, royalties).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': this.gasLimit,
                'value': gasPrice,
            }).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    // update collection with name and uri.
    public updateCollection (collectionAddr: string,
        name: string,
        collectionUri: string,
        registryContract: string,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(RegistryABI, registryContract).methods.updateTokenInfo(collectionAddr, name, collectionUri).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': this.gasLimit,
                'value': gasPrice,
            }).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    // update royalties of the collection
    public updateCollectionRoyalties (collectionAddr: string,
        royaltyRates: RoyaltyRate[],
        registryContract: string,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            let pasarRegistry = new this.web3.eth.Contract(RegistryABI, registryContract);

            let owners = [], royalties = [];

            for(var i = 0; i < royaltyRates.length; i++) {
                owners.push(royaltyRates[i].address);
                royalties.push(royaltyRates[i].rate*10000)
            }

            pasarRegistry.methods.changeTokenRoyalty(collectionAddr, owners, royalties).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': this.gasLimit,
                'value': gasPrice,
            }).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    public async approveToken (amount: number,
        quoteToken: string,
        marketContract: string,
        gasPrice: string,
    ): Promise<any> {
        let erc20Contract = new this.web3.eth.Contract(Token20ABI, quoteToken);
        let approvedAmount = BigInt(await erc20Contract.methods.allowance(this.account, marketContract).call())
        if (approvedAmount >= amount) {
            await erc20Contract.methods.approve(marketContract, amount.toString()).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': this.gasLimit,
                'value': gasPrice
            });
        }
    }
}
