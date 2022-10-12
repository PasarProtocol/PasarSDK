import Web3 from 'web3';
import { isTestnetNetwork } from './networkType';
import { valuesOnTestNet, valuesOnMainNet, DiaTokenConfig, LimitGas, defaultAddress } from "./constant";
import { checkPasarCollection, checkFeedsCollection, getCurrentMarketAddress, getCurrentImportingContractAddress } from "./global";
import { NormalCollectionInfo, TransactionParams, UserInfo } from './utils';
import Pasar_Market_ABI from "./contracts/abis/pasarMarketABI";
import Pasar_Register_ABI from "./contracts/abis/pasarRegisterABI";
import COMMON_CONTRACT_ABI from "./contracts/abis/commonABI";
import TOKEN_721_ABI from './contracts/abis/token721ABI';
import TOKEN_1155_ABI from './contracts/abis/token1155ABI';
import TOKEN_20_ABI from './contracts/abis/erc20ABI';
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

    private getTransactionParam(account: string, gasPrice: string, price = 0): TransactionParams {
        return {
            'from': account,
            'gasPrice': gasPrice,
            'gas': this.gasLimit,
            'value': price
        };
    }
    /**
     * call the mint function on contract
     *
     * @param contractAbi abi file for calling
     * @param contractAddress address of contract
     * @param tokenId tokenId of being minted
     * @param totalSupply quantity of nft of being minted
     * @param royaltyFee royalty fee of nft
     * @param userInfo the user information
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being minted the nft
     */
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
            const transactionParams = this.getTransactionParam(this.account, gasPrice);

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

    /**
     * call the mint function on custom contract
     *
     * @param contractAbi abi file for calling
     * @param contractAddress address of contract
     * @param tokenId tokenId of being minted
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being minted the nft
     */
     public mintFunctionOnCustomCollection (
        contractAddress: string,
        tokenId: string,
        collectionType: string,
        metaData: string,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams = this.getTransactionParam(this.account, gasPrice);

            let pasarContract = new this.web3.eth.Contract(TOKEN_721_ABI, contractAddress);
            let mintFunction = pasarContract.methods.mint(tokenId, metaData);

            if(collectionType == ERCType.ERC1155) {
                pasarContract = new this.web3.eth.Contract(TOKEN_1155_ABI, contractAddress);
                mintFunction = pasarContract.methods.mint(tokenId, 1, metaData);
            }

            mintFunction.send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    /**
     * burn the nft
     *
     * @param contractAbi abi file for calling
     * @param contractAddress address of contract
     * @param tokenId tokenId of being minted
     * @param totalSupply quantity of nft of being minted
     * @param royaltyFee royalty fee of nft
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being minted the nft
     */
     public deleteFunction (
        contractAbi: any,
        contractAddress: string,
        tokenId: string,
        totalSupply: number,
        collectionType: string,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams = this.getTransactionParam(this.account, gasPrice);

            let pasarContract = new this.web3.eth.Contract(contractAbi, contractAddress);
            let burnFunction = pasarContract.methods.burn(tokenId, totalSupply);
            if(!checkFeedsCollection(contractAddress) && !checkPasarCollection(contractAddress) && collectionType == ERCType.ERC721) {
                pasarContract.methods.burn(tokenId);
            }
            burnFunction.send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    /**
     * list the nft on marketplace
     *
     * @param tokenId tokenId of being minted
     * @param baseToken the collection address of nft
     * @param royaltyFee royalty fee of nft
     * @param userInfo user information
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public createOrderForSale (
        tokenId: string,
        baseToken: string,
        price: string,
        quoteToken: string,
        userInfo: UserInfo,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams = this.getTransactionParam(this.account, gasPrice);

            let contractAddress = getCurrentMarketAddress();
            let pasarContract = new this.web3.eth.Contract(Pasar_Market_ABI, contractAddress);
            pasarContract.methods.createOrderForSale(baseToken, tokenId, 1, quoteToken, price, (new Date().getTime()/1000).toFixed(), userInfo.did).send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    /**
     * approval the item
     *
     * @param contractAbi the abi file of collection
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being been approval the nft
     */
     public approvalForAll (
        contractAbi: any,
        baseToken: string,
        approvalAddress: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams = this.getTransactionParam(this.account, gasPrice);

            let stickerContract = new this.web3.eth.Contract(contractAbi, baseToken);
            stickerContract.methods.setApprovalForAll(approvalAddress, true).send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    /**
     * transfer the nft to another
     *
     * @param contractAbi the abi file of collection
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being been approval the nft
     */
     public transferNFT (
        contractAbi: any,
        toAddress: string,
        tokenId: string,
        baseToken: string,
        collectionType: string,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams = this.getTransactionParam(this.account, gasPrice);

            let stickerContract = new this.web3.eth.Contract(contractAbi, baseToken);
            let transferFunction = stickerContract.methods.safeTransferFrom(this.account, toAddress, tokenId, 1);
            if(collectionType == ERCType.ERC721)
                transferFunction = stickerContract.methods.safeTransferFrom(this.account, toAddress, tokenId);

            transferFunction.send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    /**
     * list the nft on auction
     *
     * @param tokenId tokenId of being minted
     * @param baseToken the collection address of nft
     * @param quoteToken The contract address of ERC20 token as pricing token
     * @param reservePrice The minimum pricing that user
     * @param buyoutPrice The buyout price for the auction order, set to 0 to disable buyout
     * @param expirationTime: The time for ending the auction
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public createOrderForAuction (
        baseToken: string,
        tokenId: string,
        quoteToken: string,
        minPrice: number,
        reservePrice: number,
        buyoutPrice: number,
        expirationTime: number,
        userInfo: UserInfo,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams = this.getTransactionParam(this.account, gasPrice);

            let minPriceValue = BigInt(minPrice*1e18).toString();
            let reservePriceValue = BigInt(reservePrice*1e18).toString();
            let buyoutPriceValue = BigInt(buyoutPrice*1e18).toString();

            let contractAddress = getCurrentMarketAddress();
            let pasarContract = new this.web3.eth.Contract(Pasar_Market_ABI, contractAddress);

            pasarContract.methods.createOrderForAuction(baseToken, tokenId, 1, quoteToken, minPriceValue, reservePriceValue, buyoutPriceValue, (new Date().getTime()/1000).toFixed(), (expirationTime/1000).toFixed(), userInfo.did).send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    /**
     * call the change function on contract
     *
     * @param account my wallet address
     * @param orderId The orderId of NFT item on maketplace
     * @param quoteToken The token address of new pricing token
     * @param newPrice The new listed price
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public changePrice (
        orderId: number,
        newPrice: string,
        quoteToken: string,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams = this.getTransactionParam(this.account, gasPrice);

            let contractAddress = getCurrentMarketAddress();
            let pasarContract = new this.web3.eth.Contract(Pasar_Market_ABI, contractAddress);
            pasarContract.methods.changeSaleOrderPrice(orderId, newPrice, quoteToken).send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    /**
     * call the change function on contract for auction listed
     *
     * @param orderId The orderId of NFT item on maketplace
     * @param quoteToken The token address of new pricing token
     * @param newMinPrice The new minimum starting price for bidding on the auction
     * @param newReservedPrice The new minimum pricing that user
     * @param newBuyoutPrice The new buyout price for the auction order, set to 0 to disable buyout
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public changePriceOnAuction (
        orderId: number,
        newMinPrice: string,
        newReservedPrice: string,
        newBuyoutPrice: string,
        quoteToken: string,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams = this.getTransactionParam(this.account, gasPrice);

            let contractAddress = getCurrentMarketAddress();
            let pasarContract = new this.web3.eth.Contract(Pasar_Market_ABI, contractAddress);
            pasarContract.methods.changeAuctionOrderPrice(orderId, newMinPrice, newReservedPrice, newBuyoutPrice, quoteToken).send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    /**
     * buy the fixed listed nft
     *
     * @param orderId The orderId of NFT item on maketplace
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public buyItem (
        orderId: string,
        price: number,
        quoteToken: string,
        did: string,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams: TransactionParams = this.getTransactionParam(this.account, gasPrice, quoteToken == defaultAddress ? price : 0);

            let contractAddress = getCurrentMarketAddress();
            let pasarContract = new this.web3.eth.Contract(Pasar_Market_ABI, contractAddress);

            pasarContract.methods.buyOrder(orderId, did).send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    /**
     * bid to the auction nft
     *
     * @param account my wallet address
     * @param orderId The orderId of NFT item on maketplace
     * @param price The prie of bid
     * @param quoteToken the token type of bidding
     * @param userInfo user Information
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public bidItemOnAuction (
        orderId: string,
        price: number,
        quoteToken: string,
        userInfo: UserInfo,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams = this.getTransactionParam(this.account, gasPrice, quoteToken == defaultAddress ? price : 0);

            let contractAddress = getCurrentMarketAddress();
            let pasarContract = new this.web3.eth.Contract(Pasar_Market_ABI, contractAddress);
            pasarContract.methods.bidForOrder(orderId, price.toString(), userInfo.did).send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    /**
     * Settle the listed NFT item on auction on marketplace
     *
     * @param account my wallet address
     * @param orderId The orderId of NFT item on maketplace
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public settleAuction (
        orderId: string,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams = this.getTransactionParam(this.account, gasPrice);

            let contractAddress = getCurrentMarketAddress();
            let pasarContract = new this.web3.eth.Contract(Pasar_Market_ABI, contractAddress);
            pasarContract.methods.settleAuctionOrder(orderId).send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    /**
     * Unlist an item from marketplace, either it's with fixed price or on auction
     * When the item is on auction with bidding price, it would fail to call this function
     * to unlist NFT item.
     *
     * @param orderId The orderId of NFT item on maketplace
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public unlistItem (
        orderId: string,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams = this.getTransactionParam(this.account, gasPrice);

            let contractAddress = getCurrentMarketAddress();
            let pasarContract = new this.web3.eth.Contract(Pasar_Market_ABI, contractAddress);
            pasarContract.methods.cancelOrder(orderId).send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
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
            const diaTokenValue = BigInt((10 ** DiaTokenConfig.diaDecimals * DiaTokenConfig.diaValue * DiaTokenConfig.nPPM) / DiaTokenConfig.PPM).toString();

            let diaAddress = isTestnetNetwork() ? valuesOnTestNet.elastos.diaTokenContract : valuesOnMainNet.elastos.diaTokenContract

            let deployArgs = [name, symbol, collectionUri, diaAddress, diaTokenValue];

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

    /**
     * Register an specific NFT collection onto Pasar marketplace.
     *
     * @param tokenAddress the address of collection
     * @param name The name of NFT collection
     * @param collectionUri the uri of nft on ipfs
     * @param royaltyRates the list of owners and royalties
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public registerCollection (
        tokenAddress: string,
        name: string,
        collectionUri: string,
        royaltyRates: RoyaltyRate[],
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams = this.getTransactionParam(this.account, gasPrice);

            let contractAddress = getCurrentImportingContractAddress();
            let pasarRegister = new this.web3.eth.Contract(Pasar_Register_ABI, contractAddress);
            let owners = [], royalties = [];

            for(var i = 0; i < royaltyRates.length; i++) {
                owners.push(royaltyRates[i].address);
                royalties.push(royaltyRates[i].rate*10000)
            }
            pasarRegister.methods.registerToken(tokenAddress, name, collectionUri, owners, royalties).send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    /**
     * Update an specific NFT collection onto Pasar marketplace.
     *
     * @param tokenAddress the address of collection
     * @param name The name of NFT collection
     * @param collectionUri the uri of nft on ipfs
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public updateCollection (
        tokenAddress: string,
        name: string,
        collectionUri: string,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams = this.getTransactionParam(this.account, gasPrice);

            let contractAddress = getCurrentImportingContractAddress();
            let pasarRegister = new this.web3.eth.Contract(Pasar_Register_ABI, contractAddress);

            pasarRegister.methods.updateTokenInfo(tokenAddress, name, collectionUri).send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    /**
     * Update the royalties of collection
     *
     * @param tokenAddress the address of collection
     * @param royaltyRates new royalties of collection
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public updateCollectionRoyalties (
        tokenAddress: string,
        royaltyRates: RoyaltyRate[],
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams: TransactionParams = this.getTransactionParam(this.account, gasPrice);

            let contractAddress = getCurrentImportingContractAddress();
            let pasarRegister = new this.web3.eth.Contract(Pasar_Register_ABI, contractAddress);

            let owners = [], royalties = [];

            for(var i = 0; i < royaltyRates.length; i++) {
                owners.push(royaltyRates[i].address);
                royalties.push(royaltyRates[i].rate*10000)
            }

            pasarRegister.methods.changeTokenRoyalty(tokenAddress, owners, royalties).send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    /**
     * Get the name, symbol, owner of collection
     *
     * @param tokenAddress address of collection
     * @returns result of being listed the nft
     */
     public async getCollectionInfo (
        tokenAddress: string,
    ): Promise<NormalCollectionInfo> {
        const tokenContract = new this.web3.eth.Contract(COMMON_CONTRACT_ABI, tokenAddress);

        let name = await tokenContract.methods.name().call();
        let symbol = await tokenContract.methods.symbol().call();
        let owner = await tokenContract.methods.owner().call();

        const collectionInfo: NormalCollectionInfo = {
            name: name,
            symbol: symbol,
            owner: owner
        };
        return collectionInfo;
    }

    /**
     * buy the fixed listed nft
     *
     * @param account my wallet address
     * @param price the price of allowanced the token
     * @param quoteToken the token address of collection
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public async approveToken (
        amount: number,
        quoteToken: string,
        gasPrice: string
    ): Promise<any> {
        const transactionParams = this.getTransactionParam(this.account, gasPrice);
        let marketPlaceAddress = getCurrentMarketAddress();
        let erc20Contract = new this.web3.eth.Contract(TOKEN_20_ABI, quoteToken);

        let erc20BidderApproved = BigInt(await erc20Contract.methods.allowance(this.account, marketPlaceAddress).call())

        if(erc20BidderApproved < amount) {
            await erc20Contract.methods.approve(marketPlaceAddress, amount.toString()).send(transactionParams);
        }
    }
}
