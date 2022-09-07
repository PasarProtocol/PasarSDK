import Web3 from 'web3';
import { isTestnetNetwork } from './networkType';
import { valuesOnTestNet, valuesOnMainNet, DiaTokenConfig, LimitGas } from "./constant";
import { resizeImage, isInAppBrowser, getFilteredGasPrice } from "./global";
import { NormalCollectionInfo, TransactionParams } from './utils';
import Pasar_Market_ABI from "./contracts/abis/pasarMarketABI";
import Pasar_Register_ABI from "./contracts/abis/pasarRegisterABI";
import COMMON_CONTRACT_ABI from "./contracts/abis/commonABI";
import TOKEN_721_ABI from './contracts/abis/token721ABI';
import TOKEN_1155_ABI from './contracts/abis/token1155ABI';
import { getUserInfo } from './userinfo';
import { UserInfo } from './userinfo';
import { RoyaltyRate } from './RoyaltyRate';
import { ItemType } from './itemtype';

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
            const transactionParams: TransactionParams = {
                'from': account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': 0
            };
    
            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
    
            let pasarContract = new walletConnectWeb3.eth.Contract(contractAbi, contractAddress);
            pasarContract.methods.mint(tokenId, totalSupply, metaData, royaltyFee * 10000).send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    /**
     * call the mint function on custom contract
     *
     * @param contractAbi abi file for calling
     * @param contractAddress address of contract
     * @param account my wallet address
     * @param tokenId tokenId of being minted
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being minted the nft
     */
     public mintFunctionOnCustomCollection (
        contractAddress: string,
        account: string,
        tokenId: string,
        collectionType: ItemType,
        metaData: string,
        essentialsConnector: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams: TransactionParams = {
                'from': account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': 0
            };
    
            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
    
            let pasarContract = new walletConnectWeb3.eth.Contract(TOKEN_721_ABI, contractAddress);
            let mintFunction = pasarContract.methods.mint(tokenId, metaData);

            if(collectionType == ItemType.ERC1155) {
                pasarContract = new walletConnectWeb3.eth.Contract(TOKEN_1155_ABI, contractAddress);
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
            const transactionParams: TransactionParams = {
                'from': account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
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

    /**
     * list the nft on marketplace
     *
     * @param account my wallet address
     * @param tokenId tokenId of being minted
     * @param baseToken the collection address of nft
     * @param royaltyFee royalty fee of nft
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public createOrderForSale (
        account: string,
        tokenId: string,
        baseToken: string,
        price: string,
        quoteToken: string,
        essentialsConnector: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams: TransactionParams = {
                'from': account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': 0
            };
    
            let jsonDid:UserInfo = getUserInfo();

            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
            
            let contractAddress = isTestnetNetwork() ? valuesOnTestNet.elastos.pasarMarketPlaceContract : valuesOnMainNet.elastos.pasarMarketPlaceContract;
            let pasarContract = new walletConnectWeb3.eth.Contract(Pasar_Market_ABI, contractAddress);
            pasarContract.methods.createOrderForSale(baseToken, tokenId, 1, quoteToken, price, (new Date().getTime()/1000).toFixed(), jsonDid.did).send(transactionParams).on('receipt', (receipt) => {
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
     * @param account my wallet address
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being been approval the nft
     */
     public approvalForAll (
        contractAbi: any,
        approvalAddress: any,
        account: string,
        essentialsConnector: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams: TransactionParams = {
                'from': account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': 0
            };
            
            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
            let contractAddress = isTestnetNetwork() ? valuesOnTestNet.elastos.stickerV2Contract : valuesOnMainNet.elastos.stickerV2Contract;

            let stickerContract = new walletConnectWeb3.eth.Contract(contractAbi, contractAddress);
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
     * @param account my wallet address
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being been approval the nft
     */
     public transferNFT (
        contractAbi: any,
        account:string,
        toAddress: string,
        tokenId: string,
        baseToken: string,
        essentialsConnector: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams: TransactionParams = {
                'from': account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': 0
            };
            
            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());

            let stickerContract = new walletConnectWeb3.eth.Contract(contractAbi, baseToken);
            stickerContract.methods.safeTransferFrom(account, toAddress, tokenId, 1).send(transactionParams).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    /**
     * list the nft on auction
     *
     * @param account my wallet address
     * @param tokenId tokenId of being minted
     * @param baseToken the collection address of nft
     * @param quoteToken The contract address of ERC20 token as pricing token
     * @param reservePrice The minimum pricing that user
     * @param buyoutPrice The buyout price for the auction order, set to 0 to disable buyout
     * @param expirationTime: The time for ending the auction
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public createOrderForAuction (
        account: string,
        baseToken: string,
        tokenId: string,
        quoteToken: string,
        minPrice: number,
        reservePrice: number,
        buyoutPrice: number,
        expirationTime: number,
        essentialsConnector: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams: TransactionParams = {
                'from': account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': 0
            };
    
            let minPriceValue = BigInt(minPrice*1e18).toString();
            let reservePriceValue = BigInt(reservePrice*1e18).toString();
            let buyoutPriceValue = BigInt(buyoutPrice*1e18).toString();

            let jsonDid:UserInfo = getUserInfo();

            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
            
            let contractAddress = isTestnetNetwork() ? valuesOnTestNet.elastos.pasarMarketPlaceContract : valuesOnMainNet.elastos.pasarMarketPlaceContract;
            let pasarContract = new walletConnectWeb3.eth.Contract(Pasar_Market_ABI, contractAddress);

            pasarContract.methods.createOrderForAuction(baseToken, tokenId, 1, quoteToken, minPriceValue, reservePriceValue, buyoutPriceValue, (new Date().getTime()/1000).toFixed(), (expirationTime/1000).toFixed(), jsonDid.did).send(transactionParams).on('receipt', (receipt) => {
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
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public changePrice (
        account: string,
        orderId: number,
        newPrice: string,
        quoteToken: string,
        essentialsConnector: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams: TransactionParams = {
                'from': account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': 0
            };

            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
            
            let contractAddress = isTestnetNetwork() ? valuesOnTestNet.elastos.pasarMarketPlaceContract : valuesOnMainNet.elastos.pasarMarketPlaceContract;
            let pasarContract = new walletConnectWeb3.eth.Contract(Pasar_Market_ABI, contractAddress);
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
     * @param account my wallet address
     * @param orderId The orderId of NFT item on maketplace
     * @param quoteToken The token address of new pricing token
     * @param newMinPrice The new minimum starting price for bidding on the auction
     * @param newReservedPrice The new minimum pricing that user
     * @param newBuyoutPrice The new buyout price for the auction order, set to 0 to disable buyout
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public changePriceOnAuction (
        account: string,
        orderId: number,
        newMinPrice: string,
        newReservedPrice: string,
        newBuyoutPrice: string,
        quoteToken: string,
        essentialsConnector: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams: TransactionParams = {
                'from': account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': 0
            };

            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
            
            let contractAddress = isTestnetNetwork() ? valuesOnTestNet.elastos.pasarMarketPlaceContract : valuesOnMainNet.elastos.pasarMarketPlaceContract;
            let pasarContract = new walletConnectWeb3.eth.Contract(Pasar_Market_ABI, contractAddress);
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
     * @param account my wallet address
     * @param orderId The orderId of NFT item on maketplace
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public buyItem (
        account: string,
        orderId: string,
        price: number,
        did: string,
        essentialsConnector: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams: TransactionParams = {
                'from': account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': price
            };

            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
            
            let contractAddress = isTestnetNetwork() ? valuesOnTestNet.elastos.pasarMarketPlaceContract : valuesOnMainNet.elastos.pasarMarketPlaceContract;
            let pasarContract = new walletConnectWeb3.eth.Contract(Pasar_Market_ABI, contractAddress);

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
     * @param price The price of bid
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public bidItemOnAuction (
        account: string,
        orderId: string,
        price: number,
        essentialsConnector: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            let priceValue = Number(BigInt(price*1e18)).toString();

            const transactionParams: TransactionParams = {
                'from': account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': price*1e18
            };

            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
            
            let jsonDid:UserInfo = getUserInfo();

            let contractAddress = isTestnetNetwork() ? valuesOnTestNet.elastos.pasarMarketPlaceContract : valuesOnMainNet.elastos.pasarMarketPlaceContract;
            let pasarContract = new walletConnectWeb3.eth.Contract(Pasar_Market_ABI, contractAddress);
            pasarContract.methods.bidForOrder(orderId, priceValue, jsonDid.did).send(transactionParams).on('receipt', (receipt) => {
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
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public settleAuction (
        account: string,
        orderId: string,
        essentialsConnector: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams: TransactionParams = {
                'from': account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': 0
            };

            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
            
            let contractAddress = isTestnetNetwork() ? valuesOnTestNet.elastos.pasarMarketPlaceContract : valuesOnMainNet.elastos.pasarMarketPlaceContract;
            let pasarContract = new walletConnectWeb3.eth.Contract(Pasar_Market_ABI, contractAddress);
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
     * @param account my wallet address
     * @param orderId The orderId of NFT item on maketplace
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public unlistItem (
        account: string,
        orderId: string,
        essentialsConnector: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams: TransactionParams = {
                'from': account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': 0
            };

            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
            
            let contractAddress = isTestnetNetwork() ? valuesOnTestNet.elastos.pasarMarketPlaceContract : valuesOnMainNet.elastos.pasarMarketPlaceContract;
            let pasarContract = new walletConnectWeb3.eth.Contract(Pasar_Market_ABI, contractAddress);
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
     * @param account my wallet address
     * @param name The name of NFT collection
     * @param symbol The symbol of NFT collection
     * @param collectionUri the uri of nft on ipfs
     * @param contractData the contract file data
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public createCollection (
        account: string,
        name: string,
        symbol: string,
        collectionUri: string,
        contractData: any,
        essentialsConnector: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const diaTokenValue = BigInt((10 ** DiaTokenConfig.diaDecimals * DiaTokenConfig.diaValue * DiaTokenConfig.nPPM) / DiaTokenConfig.PPM).toString();
            
            let diaAddress = isTestnetNetwork() ? valuesOnTestNet.elastos.diaTokenContract : valuesOnMainNet.elastos.diaTokenContract

            let deployArgs = [name, symbol, collectionUri, diaAddress, diaTokenValue];

            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());

            gasPrice = getFilteredGasPrice(gasPrice);

            let registerContract = new walletConnectWeb3.eth.Contract(contractData.abi);
            let registeredContract = registerContract.deploy({
                data: `0x${contractData.code}`,
                arguments: deployArgs,
            })
            let transactionParams = {
                'from': account,
                'gas': LimitGas,
                'gasPrice': gasPrice
            }
            
            if(isInAppBrowser())
              transactionParams['to'] = ""
              registeredContract.send(transactionParams).then(newContractInstance=>{
                console.log('Contract deployed at address: ', newContractInstance.options.address)
                resolve(newContractInstance.options.address)
            }).catch((error) => {
                reject(error);
            })

        })
    }

    /**
     * Register an specific NFT collection onto Pasar marketplace.
     *
     * @param account my wallet address
     * @param tokenAddress the address of collection
     * @param name The name of NFT collection
     * @param collectionUri the uri of nft on ipfs
     * @param royaltyRates the list of owners and royalties
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public registerCollection (
        account: string,
        tokenAddress: string,
        name: string,
        collectionUri: string,
        royaltyRates: RoyaltyRate[],
        essentialsConnector: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams: TransactionParams = {
                'from': account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': 0
            };

            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
            
            let contractAddress = isTestnetNetwork() ? valuesOnTestNet.elastos.pasarRegisterContract : valuesOnMainNet.elastos.pasarRegisterContract;
            let pasarRegister = new walletConnectWeb3.eth.Contract(Pasar_Register_ABI, contractAddress);
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
     * @param account my wallet address
     * @param tokenAddress the address of collection
     * @param name The name of NFT collection
     * @param collectionUri the uri of nft on ipfs
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public updateCollection (
        account: string,
        tokenAddress: string,
        name: string,
        collectionUri: string,
        essentialsConnector: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams: TransactionParams = {
                'from': account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': 0
            };

            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
            
            let contractAddress = isTestnetNetwork() ? valuesOnTestNet.elastos.pasarRegisterContract : valuesOnMainNet.elastos.pasarRegisterContract;
            let pasarRegister = new walletConnectWeb3.eth.Contract(Pasar_Register_ABI, contractAddress);

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
     * @param account my wallet address
     * @param tokenAddress the address of collection
     * @param royaltyRates new royalties of collection
     * @param essentialsConnector essestial connector for creating web3
     * @param gasPrice the value of gas process for calling the contract
     * @returns result of being listed the nft
     */
     public updateCollectionRoyalties (
        account: string,
        tokenAddress: string,
        royaltyRates: RoyaltyRate[],
        essentialsConnector: any,
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionParams: TransactionParams = {
                'from': account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': 0
            };

            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
            
            let contractAddress = isTestnetNetwork() ? valuesOnTestNet.elastos.pasarRegisterContract : valuesOnMainNet.elastos.pasarRegisterContract;
            let pasarRegister = new walletConnectWeb3.eth.Contract(Pasar_Register_ABI, contractAddress);

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
     * @param essentialsConnector essestial connector for creating web3
     * @returns result of being listed the nft
     */
     public async getCollectionInfo (
        tokenAddress: string,
        essentialsConnector: any,
    ): Promise<NormalCollectionInfo> {
        const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
        const tokenContract = new walletConnectWeb3.eth.Contract(COMMON_CONTRACT_ABI, tokenAddress);

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
}