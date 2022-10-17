import Web3 from 'web3';
import { LimitGas } from "./constant";
import marketV2ABI from "./contracts/abis/marketV2";
import RegistryABI from "./contracts/abis/registry";
import FeedsCollectionABI from "./contracts/abis/feedsCollection";
import PasarCollectionABI from "./contracts/abis/pasarCollection";
import Token721ABI from './contracts/abis/token721ABI';
import Token20ABI from './contracts/abis/erc20ABI';
import { RoyaltyRate } from './collection/RoyaltyRate';
import { AppContext } from './appcontext';

/**
 * This class is to call the contract functions
 */
export class ContractHelper {
    private static zeroAddr = "0x0000000000000000000000000000000000000000";
    private gasLimit = LimitGas;
    private account: string;
    private web3: Web3;

    constructor(account: string, appContext: AppContext) {
        this.account = account;
        this.web3 = appContext.getWeb3();
    }

    private mintERC1155Item = (
        collectionABI: any,
        collectionAddress: string,
        tokenId: string,
        tokenURI: string,
        royaltyRate: number,
        didURI: string,
        gasPrice: string
    ): Promise<void> => {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(collectionABI, collectionAddress).methods.mint(
                tokenId, 1, tokenURI, royaltyRate * 10000, didURI
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': gasPrice,
            }).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error: any) => {
                reject(error)
            });
        })
    }

    public mintFromFeedsCollection(
        collectionAddr: string,
        tokenId: string,
        tokenURI: string,
        royaltyRate: number,
        didURI: string,
        gasPrice: string
    ):Promise<void> {
        return this.mintERC1155Item(FeedsCollectionABI, collectionAddr, tokenId, tokenURI, royaltyRate, didURI, gasPrice);
    }

    public mintFromPasarCollection(
        collectionAddr: string,
        tokenId: string,
        tokenURI: string,
        royaltyRate: number,
        didURI: string,
        gasPrice: string
    ): Promise<void> {
        return this.mintERC1155Item(PasarCollectionABI, collectionAddr, tokenId, tokenURI, royaltyRate, didURI, gasPrice);
    }

    public mintERC721Item (
        collectionAddr: string,
        tokenId: string,
        tokenURI: string,
        didURI: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(Token721ABI, collectionAddr).methods.mint(
                tokenId, tokenURI, didURI
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': gasPrice,
            }).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error: any) => {
                reject(error)
            });
        })
    }

    private burnERC1155Item = (
        collectionABI: any,
        collectionAddr: string,
        tokenId: string,
        gasPrice: string
    ): Promise<void> => {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(collectionABI, collectionAddr).methods.burn(tokenId, 1).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': gasPrice,
            }).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    public burnItemInFeeds(
        collectionAddr: string,
        tokenId: string,
        gasPrice: string
    ): Promise<void> {
        return this.burnERC1155Item(FeedsCollectionABI, collectionAddr, tokenId, gasPrice);
    }

    public burnItemInPasar(
        collectionAddr: string,
        tokenId: string,
        gasPrice: string
    ): Promise<void> {
        return this.burnERC1155Item(PasarCollectionABI, collectionAddr, tokenId, gasPrice);
    }

    public burnERC721Item(
        collectionAddr: string,
        tokenId: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(Token721ABI, collectionAddr).methods.burn(tokenId).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': LimitGas,
                'value': gasPrice,
            }).on('receipt', (receipt) => {
                resolve(receipt);
            }).on('error', (error) => {
                reject(error)
            });
        })
    }

    // Approve the NFT item on collection can be sold on market.
    public approveItems (
        contractABI: any,
        baseToken: string,
        approvalAddress: any,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(contractABI, baseToken).methods.setApprovalForAll(
                approvalAddress, true
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

    private transferERC1155Item = (
        contractABI: any,
        toAddress: string,
        tokenId: string,
        baseToken: string,
        gasPrice: string
    ): Promise<void> => {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(contractABI, baseToken).methods.safeTransferFrom(
                this.account, toAddress, tokenId, 1
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

    public transferItemInFeeds(
        to: string,
        tokenId: string,
        baseToken: string,
        gasPrice: string
    ): Promise<void> {
        return this.transferERC1155Item(FeedsCollectionABI, to, tokenId, baseToken, gasPrice);
    }

    public transferItemInPasar(
        to: string,
        tokenId: string,
        baseToken: string,
        gasPrice: string
    ): Promise<void> {
        return this.transferERC1155Item(PasarCollectionABI, to, tokenId, baseToken, gasPrice);
    }

    public transfer721Item = (
        toAddress: string,
        tokenId: string,
        baseToken: string,
        gasPrice: string
    ): Promise<void> => {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(Token721ABI, baseToken).methods.safeTransferFrom(
                this.account, toAddress, tokenId
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

    public createOrderForSale (
        marketContract: string,
        tokenId: string,
        baseToken: string,
        price: string,
        quoteToken: string,
        sellerURI: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            let startTime = (new Date().getTime()/1000).toFixed();
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.createOrderForSale(
                baseToken, tokenId, 1, quoteToken, price, startTime, sellerURI
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

    public createOrderForAuction (
        marketContract: string,
        baseToken: string,
        tokenId: string,
        quoteToken: string,
        minPrice: number,
        reservePrice: number,
        buyoutPrice: number,
        expirationTime: number,
        sellerURI: string,
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
                (expirationTime/1000).toFixed(), sellerURI
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

    public changePrice (contractMarket: string,
        orderId: number,
        newPrice: string,
        quoteToken: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, contractMarket).methods.changeSaleOrderPrice(
                orderId, newPrice, quoteToken
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

    public changePriceOnAuction (marketContract: string,
        orderId: number,
        newMinPrice: string,
        newReservedPrice: string,
        newBuyoutPrice: string,
        quoteToken: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.changeAuctionOrderPrice(
                orderId, newMinPrice, newReservedPrice, newBuyoutPrice, quoteToken
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

    public buyItem (marketContract: string,
        orderId: string,
        price: number,
        quoteToken: string,
        did: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.buyOrder(
                orderId, did
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': this.gasLimit,
                'value': quoteToken == ContractHelper.zeroAddr ? price : 0
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            });
        })
    }

    public bidItemOnAuction (marketContract: string,
        orderId: string,
        price: number,
        quoteToken: string,
        bidderURI: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.bidForOrder(
                orderId, price.toString(), bidderURI,
            ).send({
                'from': this.account,
                'gasPrice': gasPrice,
                'gas': this.gasLimit,
                'value': quoteToken == ContractHelper.zeroAddr ? price : 0
            }).on('receipt', (receipt: any) => {
                resolve(receipt);
            }).on('error', (error: Error) => {
                reject(error)
            })
        })
    }

    public settleAuction (marketContract: string,
        orderId: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.settleAuctionOrder(
                orderId
            ).send({
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

    public unlistItem (marketContract: string,
        orderId: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(marketV2ABI, marketContract).methods.cancelOrder(
                orderId
            ).send({
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

            new this.web3.eth.Contract(contractData.abi).deploy({
                data: `0x${contractData.code}`,
                arguments: [
                    name,
                    symbol,
                    collectionUri,
                    diaAddress,
                    diaValue
                ],
            })
            let transactionParams = {
                'from': this.account,
                'gas': LimitGas,
                'gasPrice': gasPrice,
                "to": "",
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

    public registerCollection (registryContract: string,
        collectionAddr: string,
        name: string,
        collectionUri: string,
        royalties: RoyaltyRate[],
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            let addresses: string[] = [];
            let values: number[] = [];
            let item: any;

            for (item in royalties) {
                addresses.push(item.receiptAddr);
                values.push(item.value * 10000);
            }

            new this.web3.eth.Contract(RegistryABI, registryContract).methods.registerToken(
                collectionAddr, name, collectionUri, addresses, values,
            ).send({
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

    public updateCollectionInfo(registryContract: string,
        collectionAddr: string,
        name: string,
        collectionUri: string,
        gasPrice: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            new this.web3.eth.Contract(RegistryABI, registryContract).methods.updateTokenInfo(
                collectionAddr, name, collectionUri
            ).send({
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

    public updateCollectionRoyalties (registryContract: string,
        collectionAddr: string,
        royalties: RoyaltyRate[],
        gasPrice: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            let addresses: string[] = [];
            let values: number[] = [];
            let item: any;

            for (item in royalties) {
                addresses.push(item.receiptAddr);
                values.push(item.value * 10000);
            }

            new this.web3.eth.Contract(RegistryABI, registryContract).methods.changeTokenRoyalty(
                collectionAddr, addresses, values
            ).send({
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
