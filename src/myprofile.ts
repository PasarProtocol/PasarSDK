import { create } from 'ipfs-http-client';
import sha256 from 'crypto-js/sha256';
import bs58 from 'bs58';
import { Category } from "./collection/category";
import { ERCType } from "./erctype";
import { RoyaltyRate } from "./RoyaltyRate";
import { defaultAddress } from "./constant";
import { resizeImage, requestSigndataOnTokenID } from "./global";
import { CollectionSocialField, ImageDidInfo, NFTDidInfo, UserDidInfo, UserInfo } from './utils';
import PASAR_CONTRACT_ABI from './contracts/abis/pasarCollection';
import { AppContext } from './appcontext';
import { EmptyHandler, ProgressHandler } from './progresshandler';

import {VerifiableCredential } from '@elastosfoundation/did-js-sdk';
import { ContractHelper } from './contracthelper';

/**
 * This class represent the Profile of current signed-in user.
 */
export class MyProfile {
    private appContext: AppContext;
    private contractHelper: ContractHelper;

    private name: VerifiableCredential;
    private bio: VerifiableCredential;
    private did: string;
    private walletAddress: string;

    private userInfo: UserInfo;

    constructor(name: VerifiableCredential, did: string, address: string, appContext: AppContext) {
        this.name = name;
        this.did = did;
        this.walletAddress = address;
        this.contractHelper = new ContractHelper(this.walletAddress, appContext);
        this.appContext = appContext;
    }

    public setBioCredential(bio: VerifiableCredential): MyProfile {
        this.bio = bio;
        return this;
    }

    private getGasPrice = async(): Promise<string> => {
        return await this.appContext.getWeb3().eth.getGasPrice().then((_gasPrice: any) => {
            return _gasPrice*1 > 20*1e9 ? (20*1e9).toString() : _gasPrice
        })
    }

    public setUserInfo = (info: UserInfo) => {
        this.userInfo = info;
    }

    public getUserInfo = ():UserInfo => {
        return this.userInfo;
    }

    public deleteUserInfo = () => {
        this.userInfo.name = null;
        this.userInfo.bio = null;
        this.userInfo.did = null;
        this.userInfo.address = null;
    }

    /**
     * Create a NFT collection contract and deploy it on specific EVM blockchain.
     *
     * @param name The name of NFT collection
     * @param symbol The symbol of NFT collection
     * @param collectionUri The uri of NFT collection
     * @param progressHandler The handler to deal with progress on creating and deploying an
     *        NFT collection contract
     * @returns The deployed NFT collection contract address.
     */
     public async createCollection(name: string,
        symbol: string,
        collectionUri: string,
        progressHandler: ProgressHandler = new EmptyHandler()
    ): Promise<string> {
        return await this.getGasPrice().then (async gasPrice => {
            progressHandler.onProgress(70);

            let address = await this.contractHelper.createCollection(
                name, symbol, collectionUri, ERCType.ERC721, gasPrice
            );
            progressHandler.onProgress(100);
            return address;
        }).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Generate a metadata json file of the NFT collection that is about to be registered.
     *
     * @param name The name of NFT collection
     * @param description The brief description of NFT collection
     * @param avatar The avatar image path
     * @param background The background image path
     * @param category The category of NFT collection
     * @param socialMedias The social media related to this NFT collection
     * @param handleProgress The handler to deal with the progress
     * @returns The URI to this collection metadata json file on IPFS storage.
     */
    public async createCollectionMetadata(description: string,
        avatar: any,
        background: any,
        category: Category,
        socialMedias: CollectionSocialField,
        progressHandler: ProgressHandler = new EmptyHandler()
    ) : Promise<string> {
        let ipfsURL:string;
        try {
            const client = create({ url: this.appContext.getIPFSNode()});
            progressHandler.onProgress(10);

            let avatar_add = await client.add(avatar);
            progressHandler.onProgress(20);

            let background_add = await client.add(background);
            progressHandler.onProgress(30);

            let avatarsrc =  `pasar:image:${avatar_add.path}`;
            let backgroundsrc =  `pasar:image:${background_add.path}`;
            let userInfo = this.getUserInfo();
            const dataObj = {
                avatar: avatarsrc,
                background: backgroundsrc,
                description,
                category: category.toString().toLowerCase(),
                socials: socialMedias
            }
            const plainBuffer = Buffer.from(JSON.stringify(dataObj))
            const plainText = bs58.encode(plainBuffer)

            const signature = await requestSigndataOnTokenID(plainText);
            progressHandler.onProgress(40);
            const creatorObject = {
                did: userInfo.did,
                name: userInfo.name || "",
                description: userInfo.bio || "",
                signature: signature && signature.signature ? signature.signature : ""
            }

            const metaObj = {
                "version": "1",
                "creator": creatorObject,
                "data": dataObj
            }

            let metaData = await client.add(JSON.stringify(metaObj));
            progressHandler.onProgress(50);

            return `pasar:json:${metaData.path}`;
        } catch(err) {
            throw new Error(err);
        }
    }

    /**
     * Register an specific NFT collection onto Pasar marketplace.
     * Once the collection is registered to Pasar marketplace, the NFTs in this collection can
     * be listed onto market for trading.
     *
     * @param tokenAddress The NFT collection contract address
     * @param collectionUri The uri of the NFT collection referring to the metadata json file on
     *        IPFS storage
     * @param royaltyRates The roraylty rates for this NFT collection
     * @param progressHandler: The handlder to deal with the progress on registeraton of this
     *        NFT collection onto Pasar marketplace
     * @returns The result of whether this NFT collection contract is registered ont Pasar or not
     */
    public async registerCollection(
        tokenAddress: string,
        name: string,
        collectionUri: string,
        royaltyRates: RoyaltyRate[],
        progressHandler: ProgressHandler = new EmptyHandler()
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            progressHandler.onProgress(20);

            await this.contractHelper.registerCollection(
                tokenAddress, name, collectionUri, royaltyRates, this.appContext.getRegistryContract(), gasPrice
            );
            progressHandler.onProgress(100);
        }).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Update collection URI or name for the NFT collection
     * Notice: the current wallet address should be the owner of this NFT collection.
     * @param tokenAddress The NFT collection contract address
     * @param name The new name of NFT collection
     * @param collectionUri The new uri of NFT collection to metadata json file on IPFS storage
     * @param progressHandler The handler to deal with the progress to updating this NFT collection
     *        on Pasar marketplace
     * @returns The result of whether the NFT collection is updated or not.
     */
    public async updateCollectionURI(tokenAddress: string,
        name: string,
        collectionUri: string,
        progressHandler: ProgressHandler = new EmptyHandler()
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            progressHandler.onProgress(20);
            await this.contractHelper.updateCollectionInfo(
                tokenAddress, name, collectionUri, this.appContext.getRegistryContract(), gasPrice
            );
            progressHandler.onProgress(100);
        }).catch(error => {
            throw new Error(error);
        })
    }

    /**
     * Update royalties for the NFT collection
     * @param tokenAddress The NFT collection contract address
     * @param royaltyRates The roraylty rates for this NFT collection
     * @param progressHandler The handler to deal with the progress on updating this NFT collection
     *        on Pasar marketplace
     * @result
     */
    public async updateCollectionRoyalties(tokenAddress: string,
        royaltyRates: RoyaltyRate[],
        progressHandler: ProgressHandler = new EmptyHandler()
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            progressHandler.onProgress(20);
            await this.contractHelper.updateCollectionRoyalties(
                tokenAddress, royaltyRates, this.appContext.getRegistryContract(), gasPrice
            );
            progressHandler.onProgress(100);
        }).catch(error => {
            throw new Error(error);
        })
    }

    /**
     * Generate an metadata json file of the NFT that is about to be minted
     *
     * @param itemName The name of NFT item to be minted
     * @param itemDescription The brief description of an NFT item
     * @param itemImage The actual image of an NFT item
     * @param version The version of nft
     * @param properties properties of nft
     * @param sensitive Indicator whether the NFT item contains sensitive content or not.
     * @param handleProgress The function to set the progress value of being uploaded ipfs process
     * @returns The result is the did information.
     */
    public async createItemMetadata(
        itemName: string,
        itemDescription: string,
        itemImage: any,
        properties: any = null,
        sensitive = false,
        progressHandler:ProgressHandler = new EmptyHandler(),
    ): Promise<string> {
        try {
            const client = create({ url: this.appContext.getIPFSNode() });
            progressHandler.onProgress(10);

            let image_add = await client.add(itemImage);
            progressHandler.onProgress(20);

            let thumbnail:any = await resizeImage(itemImage, 300, 300);
            progressHandler.onProgress(30);

            let thumbnail_add = image_add;
            if(thumbnail['success'] === 0) {
                thumbnail_add = await client.add(thumbnail.fileContent);
            }

            let jsonDid:UserInfo = this.getUserInfo();

            const creatorObject: UserDidInfo = {
                "did": jsonDid.did,
                "name": jsonDid.name || "",
                "description": jsonDid.bio || ""
            }

            const imageObject: ImageDidInfo = {
                "image": `pasar:image:${image_add.path}`,
                "kind": itemImage.type.replace('image/', ''),
                "size": itemImage.size,
                "thumbnail": `pasar:image:${thumbnail_add.path}`,
            }

            const metaObj: NFTDidInfo = {
                "version": "2",
                "type": 'image',
                "name": itemName,
                "description": itemDescription,
                "creator": creatorObject,
                "data": imageObject,
                "adult": sensitive,
                "properties": properties || "",
            }

            let metaData = await client.add(JSON.stringify(metaObj));
            progressHandler.onProgress(60);

            return `pasar:json:${metaData.path}`;
        } catch(err) {
            throw new Error(err);
        }
    }

    /**
     * Mint an NFT item from a specific collection contract with single quantity, in
     * this function, the tokenId of this NFT item would be generated by SHA25 agorithm
     * on tokenURI string of metadata json file on IPFS sotrage.
     * Notice: This function should be used for minting NFTs from dedicated collection.
     *
     * @param collection The collection contract where NFT items would be minted
     * @param tokenURI The token uri to this new NFT item
     * @param progressHandler: The handler to deal with progress on minting a new NFT item
     * @returns The tokenId of the new NFT.
     */
    public async creatItem(collection: string,
        tokenURI: string,
        creatorURI: string,
        progressHandler: ProgressHandler = new EmptyHandler()
    ): Promise<string> {
        return await this.getGasPrice().then(async gasPrice => {
            progressHandler.onProgress(20);
            let tokenId = `0x${sha256(tokenURI.replace("pasar:json:", ""))}`;
            await this.contractHelper.mintERC721Item(collection, tokenId, tokenURI, creatorURI, gasPrice);
            progressHandler.onProgress(60);
            return tokenId;
        }).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Mint an NFT item from a specific collection contract with single quantity, in
     * this function, the tokenId of this NFT item would be generated by SHA25 agorithm
     * on tokenURI string of metadata json file on IPFS sotrage.
     * Notice: This function should be used for minting NFTs from public collection.
     *
     * @param baseToken The collection contract where NFT items would be minted
     * @param tokenUri The token uri to this new NFT item
     * @param roylatyFee:The royalty fee to the new NFT item
     * @param handleProgress: The handler to deal with progress on minting a new NFT item
     * @returns The tokenId of being minted a nft
     */
    public async createItemFromFeeds(
        baseToken: string,
        tokenURI: string,
        creatorURI: string,
        roylatyFee: number,
        handleProgress: ProgressHandler = new EmptyHandler()
    ): Promise<string> {
        return await this.getGasPrice().then(async gasPrice => {
            handleProgress.onProgress(20);
            let tokenId = `0x${sha256(tokenURI.replace("pasar:json:", ""))}`;
            await this.contractHelper.mintFromFeedsCollection(
                baseToken, tokenId, tokenURI, roylatyFee, creatorURI, gasPrice
            );
            handleProgress.onProgress(100);
            return tokenId;
        }).catch (error => {
            throw new Error(error);
        })
    }

    public async createItemFromPasar(
        baseToken: string,
        tokenURI: string,
        creatorURI: string,
        roylatyFee: number,
        handleProgress: ProgressHandler = new EmptyHandler()
    ): Promise<string> {
        return await this.getGasPrice().then(async gasPrice => {
            handleProgress.onProgress(20);
            let tokenId = `0x${sha256(tokenURI.replace("pasar:json:", ""))}`;
            await this.contractHelper.mintFromPasarCollection(
                baseToken, tokenId, tokenURI, roylatyFee, creatorURI, gasPrice
            );
            handleProgress.onProgress(100);
            return tokenId;
        }).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Delete exiting NFT item.
     * Notice: the NFT item should be unlisted from marketplace first before deleting
     *         the item.
     *
     * @param baseToken The collection contract where NFT items would be burned
     * @param tokenId The tokenId of NFT item to be burned
     * @param handleProgress The handler to deal with progress on deletion of an NFT item
     * @returns The result of whether the NFT is deleted or not.
     */
    public async deleteItem(
        baseToken: string,
        tokenId: string,
        handleProgress: ProgressHandler = new EmptyHandler()
    ): Promise<void> {
        return await this.getGasPrice().then (async gasPrice => {
            handleProgress.onProgress(20);

            await this.contractHelper.burnERC721Item(baseToken, tokenId, gasPrice);

            handleProgress.onProgress(100);
        }).catch (error => {
            throw new Error(error);
        })
    }

    public async deleteItemFromFeeds(
        baseToken: string,
        tokenId: string,
        handleProgress: ProgressHandler = new EmptyHandler()
    ): Promise<void> {
        return await this.getGasPrice().then (async gasPrice => {
            handleProgress.onProgress(20);
            await this.contractHelper.burnItemInFeeds(baseToken, tokenId, gasPrice);
            handleProgress.onProgress(100);
        }).catch (error => {
            throw new Error(error);
        })
    }

    public async deleteItemInPasar(
        baseToken: string,
        tokenId: string,
        handleProgress: ProgressHandler = new EmptyHandler()
    ): Promise<void> {
        return await this.getGasPrice().then (async gasPrice => {
            handleProgress.onProgress(20);
            await this.contractHelper.burnItemInPasar(baseToken, tokenId, gasPrice);
            handleProgress.onProgress(100);
        }).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Transfer NFT item to another address.
     *
     * @param baseToken the collection of this NFT item
     * @param tokenId The tokenId of NFT item
     * @param toAddr the target wallet address to recieve the NFT item
     * @param progressHandler The handler to deal with progress on transferring NFT item
     * @returns
     */
    public async transferItem(baseToken: string,
        tokenId: string,
        toAddr: string,
        ercType: ERCType,
        progressHandler: ProgressHandler = new EmptyHandler()
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            progressHandler.onProgress(20);
            //await this.callContract.approvalForAll(abiFile, baseToken, toAddr, gasPrice);
            progressHandler.onProgress(50);

            await this.contractHelper.transfer721Item(toAddr, tokenId, baseToken, gasPrice);
            progressHandler.onProgress(100);
        }).catch (error => {
            throw new Error(error);
        })
    }

    public async transferItemInFeeds(baseToken: string,
        tokenId: string,
        toAddr: string,
        progressHandler: ProgressHandler = new EmptyHandler()
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            progressHandler.onProgress(20);

            //await this.contractHelper.approveItems(baseToken, toAddr, gasPrice);
            progressHandler.onProgress(50);
            await this.contractHelper.transferItemInFeeds(toAddr, tokenId, baseToken, gasPrice);
            progressHandler.onProgress(100);
        }).catch (error => {
            throw new Error(error);
        })
    }

    public async transferItemInPasar(baseToken: string,
        tokenId: string,
        toAddr: string,
        progressHandler: ProgressHandler = new EmptyHandler()
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            progressHandler.onProgress(20);

            //await this.contractHelper.approveItems(baseToken, toAddr, gasPrice);
            progressHandler.onProgress(50);
            await this.contractHelper.transferItemInPasar(toAddr, tokenId, baseToken, gasPrice);
            progressHandler.onProgress(100);
        }).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Create a metadata json file for trading either buyer or seller.
     *
     * @param progressHandler The handler to deal with the progress on uploading json
     *        metadata file for current user
     * @eturns The uri of metadata json file pushed onto IPFS storage.
     */
    public createTraderMetadata(): Promise<string> {
        throw new Error("Method not implemented");
    }

    /**
     * List an specific NFT item onto marketplace for rading with fixed price.
     *
     * @param baseToken The collection of this NFT item
     * @param tokenId The tokenId of NFT item
     * @param pricingToken The token address of pricing token
     * @param price The price value to sell
     * @param progressHandler The handler to deal with the progress on listing NFT item on
     *        Pasar marketplace
     */
    public async listItem(baseToken: string,
        tokenId: string,
        pricingToken: string,
        price: number,
        sellerURI: string,
        progressHandler: ProgressHandler=new EmptyHandler()
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            progressHandler.onProgress(20);
            await this.contractHelper.createOrderForSale(
                tokenId,
                baseToken,
                BigInt(price*1e18).toString(),
                pricingToken,
                sellerURI,
                this.appContext.getMarketContract(),
                gasPrice
            );
            progressHandler.onProgress(100);
        }).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Change the listed price for NFT item on marketplace
     * This function would be used to change the price of listed item with fixed price.
     *
     * @param orderId The orderId of NFT item on maketplace
     * @param newPricingToken The token address of new pricing token
     * @param newPrice The new listed price
     * @param progressHandler The handler to deal with the progress on changing price for
     *        specific listed item on marketplace
     * @returns The result of bidding action.
     */
    public async changePrice(orderId: string,
        newPricingToken: string,
        newPrice: number,
        progressHandler: ProgressHandler = new EmptyHandler()
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            progressHandler.onProgress(20);
            await this.contractHelper.changePrice(
                parseInt(orderId),
                BigInt(newPrice*1e18).toString(),
                newPricingToken,
                this.appContext.getMarketContract(),
                gasPrice
            );
            progressHandler.onProgress(100);
        }).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Buy an item listed on marketplace
     * This function is used to buy the item with fixed price.
     *
     * @param orderId The orderId of NFT item on maketplace
     * @param progressHandler The handler to deal with the progress on buying listed item
     * @returns The orderId of buying the order
     */
    public async buyItem(orderId: string,
        buyingPrice: number,
        quoteToken: string,
        buyerURI: string,
        progressHandler: ProgressHandler = new EmptyHandler()
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            progressHandler.onProgress(20);
            if(quoteToken != defaultAddress) {
                await this.contractHelper.approveToken(
                    buyingPrice, quoteToken, this.appContext.getMarketContract(), gasPrice
                );
            }
            await this.contractHelper.buyItem(
                orderId, buyingPrice, quoteToken, buyerURI, this.appContext.getMarketContract(), gasPrice
            );

            progressHandler.onProgress(100);
        }).catch(error => {
            throw new Error(error);
        })
    }

    /**
     * List an specific NFT item onto marketplace for rading on auction.
     *
     * @param baseToken The collection of this NFT item
     * @param tokenId The tokenId of NFT item
     * @param pricingToken The contract address of ERC20 token as pricing token
     * @param minPrice The minimum starting price for bidding on the auction
     * @param reservePrice The minimum pricing that user
     * @param buyoutPrice The buyout price for the auction order, set to 0 to disable buyout
     * @param expirationTime: The time for ending the auction
     * @param sellerUri The uri of seller information on IPFS storage
     * @param progressHandler The handler to deal with the progress on listing NFT item on
     *        marketplace.
     */
    public async listItemOnAuction(baseToken: string,
        tokenId: string,
        pricingToken: string,
        minPrice: number,
        reservePrice: number,
        buyoutPrice: number,
        expirationTime: number,
        sellerURI: string,
        progressHandler: ProgressHandler = new EmptyHandler()
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            progressHandler.onProgress(20);
            await this.contractHelper.approveItems(PASAR_CONTRACT_ABI, baseToken, this.appContext.getMarketContract(), gasPrice);
            progressHandler.onProgress(50);

            await this.contractHelper.createOrderForAuction(
                baseToken, tokenId, pricingToken, minPrice, reservePrice, buyoutPrice, expirationTime, sellerURI, this.appContext.getMarketContract(), gasPrice
            );
        }).catch(error => {
            throw new Error(error);
        })
    }

    /**
     * Change the auction price for listed item on marketplace
     * This function would be used to change the price of listed item on auction
     *
     * @param orderId The orderId of NFT item on maketplace
     * @param newPricingToken The token address of new pricing token
     * @param newMinPrice The new minimum starting price for bidding on the auction
     * @param newReservedPrice The new minimum pricing that user
     * @param newBuyoutPrice The new buyout price for the auction order, set to 0 to disable
     *        buyout
     * @param progressHandler The handler to deal with the progress on chaning price for
     *        specific auction item on marketplace
     * @returns The orderId
     */
    public async changePriceOnAuction(orderId: string,
        newPricingToken: string,
        newMinPrice: number,
        newReservedPrice: number,
        newBuyoutPrice: number,
        progressHandler: ProgressHandler = new EmptyHandler()
    ): Promise<void> {
        return await this.getGasPrice().then (async gasPrice => {
            progressHandler.onProgress(20);

            let priceValue = BigInt(newMinPrice*1e18).toString();
            let reservePriceValue = BigInt(newReservedPrice*1e18).toString();
            let buyoutPriceValue = BigInt(newBuyoutPrice*1e18).toString();

            await this.contractHelper.changePriceOnAuction(
                parseInt(orderId),
                priceValue,
                reservePriceValue,
                buyoutPriceValue,
                newPricingToken,
                this.appContext.getMarketContract(),
                gasPrice
            );
            progressHandler.onProgress(100);
        }).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Offer a bidding price on list item that is being on auciton on marketplace.
     *
     * @param orderId The orderId of NFT item listed on auciton.
     * @param price The price offered by bidder
     * @param bidderUri The uri of bidder information on IPFS storage
     * @param progressHandler The handler to deal with the progress on bidding for NFT item
     *        on marketplace
     * @returns The result of bidding action.
     */
    public async bidItemOnAuction(orderId: string,
        quoteToken: string,
        price: number,
        bidderURI: string,
        progressHandler: ProgressHandler = new EmptyHandler()
    ): Promise<void> {
        return await this.getGasPrice().then (async gasPrice => {
            progressHandler.onProgress(20);

            let priceValue = Number(BigInt(price*1e18));
            if(quoteToken != defaultAddress) {
                await this.contractHelper.approveToken(priceValue, quoteToken, this.appContext.getMarketContract(), gasPrice);
            }

            await this.contractHelper.bidItemOnAuction(orderId, priceValue, quoteToken, bidderURI, this.appContext.getMarketContract(), gasPrice);
            progressHandler.onProgress(100);
        }).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Settle the listed NFT item on auction on marketplace
     *
     * @param orderId The orderId of NFT item listed on auciton.
     * @param progressHandler The handler to deal with the progress on settling auction.
     */
    public async settleAuction(orderId: string,
        progressHandler: ProgressHandler = new EmptyHandler()
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            progressHandler.onProgress(20);
            await this.contractHelper.settleAuction(orderId, this.appContext.getMarketContract(), gasPrice);
            progressHandler.onProgress(100);
        }).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Unlist an item from marketplace, either it's with fixed price or on auction
     * When the item is on auction with bidding price, it would fail to call this function
     * to unlist NFT item.
     *
     * @param orderId The orderId of NFT item listed on marketplace
     * @param progressHandler The handler to deal with the progress on unlisting the NFT item.
     * @returns
     */
    public async unlistItem(
        orderId: string,
        progressHandler: ProgressHandler = new EmptyHandler()
    ): Promise<void> {
        await this.getGasPrice().then(async gasPrice => {
            progressHandler.onProgress(20);
            await this.contractHelper.unlistItem(orderId, this.appContext.getMarketContract(), gasPrice);
            progressHandler.onProgress(100);
        }).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Upload the user did info to ipfs
     *
     * @returns ipfs path.
     */
    public async getUserDid(): Promise<string> {
        const client = create({ url: this.appContext.getIPFSNode() });

        let jsonDid:UserInfo = this.getUserInfo();

        const creatorObject: UserDidInfo = {
            "did": jsonDid.did,
            "name": jsonDid.name || "",
            "description": jsonDid.bio || ""
        }

        let didUri = await client.add(JSON.stringify(creatorObject));
        return `pasar:json:${didUri.path}`;
    }
}
