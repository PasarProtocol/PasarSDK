import { create } from 'ipfs-http-client';
import sha256 from 'crypto-js/sha256';
import bs58 from 'bs58';
import { Category } from "./collection/category";
import { ERCType } from "./erctype";
import { RoyaltyRate } from "./collection/RoyaltyRate";
import { defaultAddress } from "./constant";
import { resizeImage, requestSigndataOnTokenID } from "./global";
import PasarCollectionABI from './contracts/abis/pasarCollection';
import FeedsCollectionABI from './contracts/abis/feedsCollection';
import { AppContext } from './appcontext';

import { ContractHelper } from './contracthelper';
import { SocialLinks } from './sociallinks';
import TOKEN_721_ABI from "./contracts/abis/token721ABI";
import TOKEN_1155_ABI from "./contracts/abis/token1155ABI";
import TOKEN_721_CODE from "./contracts/bytecode/token721Code";
import TOKEN_1155_CODE from "./contracts/bytecode/token1155Code";

/**
 * This class represent the Profile of current signed-in user.
 */
export class MyProfile {
    private appContext: AppContext;
    private contractHelper: ContractHelper;

    private name: string;
    private did: string;
    private description: string;
    private avatar: string;
    private walletAddress: string;

    constructor(did: string,
        walletAddress: string,
        name: string,
        description: string,
        avatar: string) {

        this.did = did;
        this.walletAddress = walletAddress;
        this.name = name;
        this.description = description;
        this.avatar = avatar;
        this.appContext = AppContext.getAppContext();
        this.contractHelper = new ContractHelper(this.walletAddress, this.appContext);
    }

    public updateName(name: string): MyProfile {
        this.name = name;
        return this;
    }

    public updateDescription(description: string): MyProfile {
        this.description = description;
        return this;
    }

    public updateAvatar(avatar: string): MyProfile {
        this.avatar = avatar;
        return this;
    }

    private getGasPrice = async(): Promise<string> => {
        return await this.appContext.getWeb3().eth.getGasPrice().then((_gasPrice: any) => {
            return _gasPrice*1 > 20*1e9 ? (20*1e9).toString() : _gasPrice
        })
    }

    /**
     * Create a NFT collection contract and deploy it on specific EVM blockchain.
     *
     * @param name The name of NFT collection
     * @param description The description of NFT collection
     * @param symbol The symbol of NFT collection
     * @param avatar The avatar image of NFT collection
     * @param background The background image of NFT collection
     * @param category The category information of NFT collection
     * @param socialMedias The social information of NFT collection
     * @param royalties The royalty information of NFT collection
     * @returns The deployed NFT collection contract address.
     */
    public async createCollection (
        name: string,
        description: string,
        symbol: string,
        avatar: any,
        background: any,
        itemType: ERCType,
        category: Category,
        socialMedias: any,
        royalties: RoyaltyRate[],
    ) {
        try {
            let resultIpfs:string = await this.createCollectionMetadata(description, avatar, background, category, socialMedias);
            let collectionAddress:string = await this.handleCreateCollection(name, symbol, resultIpfs, itemType);
            await this.handleRegisterCollection(collectionAddress, name, resultIpfs, royalties);
            return collectionAddress;
        } catch(err) {
            throw new Error(err);
        }
    }

    /**
     *  Register a NFT collection contract.
     *
     * @param tokenAddress The address of NFT collection
     * @param name The name of NFT collection
     * @param description The description of NFT collection
     * @param symbol The symbol of NFT collection
     * @param avatar The avatar image of NFT collection
     * @param background The background image of NFT collection
     * @param category The category information of NFT collection
     * @param socialMedias The social information of NFT collection
     * @param royalties The royalty information of NFT collection
     * @returns
     */
    public async registerCollection (
        tokenAddress:string,
        name: string,
        description: string,
        avatar: any,
        background: any,
        category: Category,
        socialMedias: any,
        royalties: RoyaltyRate[],
    ) {
        try {
            let resultIpfs:string = await this.createCollectionMetadata(description, avatar, background, category, socialMedias);
            await this.handleRegisterCollection(tokenAddress, name, resultIpfs, royalties);
        } catch(err) {
            throw new Error(err);
        }
    }

    /**
     *  update a NFT collection
     *
     * @param tokenAddress The address of NFT collection
     * @param name The name of NFT collection
     * @param description The description of NFT collection
     * @param symbol The symbol of NFT collection
     * @param avatar The avatar image of NFT collection
     * @param background The background image of NFT collection
     * @param category The category information of NFT collection
     * @param socialMedias The social information of NFT collection
     * @param royalties The royalty information of NFT collection
     * @returns
     */
    public async updateCollection (
        tokenAddress:string,
        name: string,
        description: string,
        avatar: any,
        background: any,
        category: Category,
        socialMedias: any,
    ) {
        try {
            let resultIpfs = await this.createCollectionMetadata(description, avatar, background, category, socialMedias);
            await this.updateCollectionURI(tokenAddress, name, resultIpfs);
        } catch(err) {
            throw new Error(err);
        }
    }

    /**
     * Update royalties for the NFT collection
     * @param tokenAddress The NFT collection contract address
     * @param royaltyRates The roraylty rates for this NFT collection
     * @result
     */
     public async updateCollectionRoyalties(tokenAddress: string,
        royaltyRates: RoyaltyRate[],
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            await this.contractHelper.updateCollectionRoyalties(
                this.appContext.getRegistryContract(), tokenAddress, royaltyRates, gasPrice
            );
        }).catch(error => {
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
     * @returns The result of whether the NFT is deleted or not.
     */
     public async deleteItem(
        baseToken: string,
        tokenId: string,
    ): Promise<void> {
        return await this.getGasPrice().then (async gasPrice => {
            await this.contractHelper.burnERC721Item(baseToken, tokenId, gasPrice);
        }).catch (error => {
            throw new Error(error);
        })
    }

    public async deleteItemFromFeeds(
        tokenId: string
    ): Promise<void> {
        return await this.getGasPrice().then (async gasPrice => {
            await this.contractHelper.burnItemInFeeds(this.appContext.getFeedsCollectionAddress(), tokenId, gasPrice);
        }).catch (error => {
            throw new Error(error);
        })
    }

    public async deleteItemInPasar(
        tokenId: string
    ): Promise<void> {
        return await this.getGasPrice().then (async gasPrice => {
            await this.contractHelper.burnItemInPasar(this.appContext.getPasarCollectionAddress(), tokenId, gasPrice);
        }).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Create a NFT collection contract and deploy it on specific EVM blockchain.
     * Currently only ERC721 standard is supported.
     *
     * @param name The name of NFT collection
     * @param symbol The symbol of NFT collection
     * @param collectionUri The uri of NFT collection
     * @returns The deployed NFT collection contract address.
     */
     private async handleCreateCollection(name: string,
        symbol: string,
        collectionUri: string,
        itemType: ERCType
    ): Promise<string> {
        return await this.getGasPrice().then (async gasPrice => {
            const tokenStandard = {
                "ERC721": {abi: TOKEN_721_ABI, code: TOKEN_721_CODE},
                "ERC1155": {abi: TOKEN_1155_ABI, code: TOKEN_1155_CODE}
            }

            const {abi: tokenABI, code: tokenCode} = tokenStandard[itemType]

            return await this.contractHelper.createCollection(
                name, symbol, collectionUri, {abi: tokenABI, code: tokenCode}, gasPrice
            );
        }).catch (error => {
            throw new Error(error);
        })
    }


    /**
     * Generate a metadata json file of the NFT collection that is about to be registered.
     *
     * @param description The brief description of NFT collection
     * @param avatarPath The avatar image path
     * @param bannerPath The background image path
     * @param category The category of NFT collection
     * @param socialLinks The social media related to this NFT collection
     * @returns The URI to this collection metadata json file on IPFS storage.
     */
    private async createCollectionMetadata(description: string,
        avatarPath: string,
        bannerPath: string,
        category: Category,
        socialLinks: SocialLinks) {

        try {
            const client = create({ url: this.appContext.getIPFSNode()});
            const dataJson = {
                avatar: `pasar:image:${(await client.add(avatarPath)).path}`,
                background: `pasar:image:${(await client.add(bannerPath)).path}`,
                description,
                category: category.toString().toLowerCase(),
                socials: socialLinks.toJson(),
            }
            const plainText = bs58.encode(Buffer.from(JSON.stringify(dataJson)))
            const signature = await requestSigndataOnTokenID(plainText);
            const creatorJson = {
                did: this.did,
                name: this.name || "",
                description: this.description || "",
                signature: signature && signature.signature ? signature.signature : ""
            }

            const metadataJson = {
                "version": "1",
                "creator": creatorJson,
                "data": dataJson
            }

            return `pasar:json:${(await client.add(JSON.stringify(metadataJson))).path}`;
        }catch(error) {
            throw new Error(error);
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
     * @param royalties The roraylty rates for this NFT collection
     * @returns The result of whether this NFT collection contract is registered ont Pasar or not
     */
    private async handleRegisterCollection(
        tokenAddress: string,
        name: string,
        collectionUri: string,
        royalties: RoyaltyRate[]
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            await this.contractHelper.registerCollection(
                this.appContext.getRegistryContract(), tokenAddress, name, collectionUri, royalties, gasPrice
            );
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
     * @returns The result of whether the NFT collection is updated or not.
     */
    private async updateCollectionURI(tokenAddress: string,
        name: string,
        collectionUri: string
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            await this.contractHelper.updateCollectionInfo(
                this.appContext.getRegistryContract(), tokenAddress, name, collectionUri, gasPrice
            );
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
     * @param sensitive Indicator whether the NFT item contains sensitive content or not
     * @returns The result is the did information.
     */
    public async createItemMetadata(
        itemName: string,
        itemDescription: string,
        itemImage: any,
        properties: any = null,
        sensitive = false,
        feeds = false,
    ): Promise<string> {
        try {
            const client = create({ url: this.appContext.getIPFSNode() });
            let image_add = await client.add(itemImage);

            let thumbnail:any = await resizeImage(itemImage, 300, 300);

            let thumbnail_add = image_add;
            if(thumbnail['success'] === 0) {
                thumbnail_add = await client.add(thumbnail.fileContent);
            }

            const creatorObject = {
                "did": this.did,
                "name": this.name,
                "description": this.description,
            }

            const imageObject = {
                "image": `pasar:image:${image_add.path}`,
                "kind": itemImage.type.replace('image/', ''),
                "size": itemImage.size,
                "thumbnail": `pasar:image:${thumbnail_add.path}`,
            }

            const metaObj = {
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

            return feeds ? `Feeds:json:${metaData.path}` : `pasar:json:${metaData.path}`;
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
     * @returns The tokenId of the new NFT.
     */
    public async createItem(collection: string,
        tokenURI: string,
    ): Promise<string> {
        return await this.getGasPrice().then(async gasPrice => {
            let tokenId = `0x${sha256(tokenURI.replace("pasar:json:", ""))}`;
            await this.contractHelper.mintERC721Item(collection, tokenId, tokenURI, gasPrice);
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
     * @param tokenURI The token uri to this new NFT item
     * @param roylatyFee The royalty fee to the new NFT item
     * @returns The tokenId of being minted a nft
     */
    public async createItemFromFeeds(
        tokenURI: string,
        roylatyFee: number
    ): Promise<string> {
        return await this.getGasPrice().then(async gasPrice => {
            let tokenId = `0x${sha256(tokenURI.replace("Feeds:json:", ""))}`;
            await this.contractHelper.mintFromFeedsCollection(
                this.appContext.getFeedsCollectionAddress(), tokenId, tokenURI, roylatyFee, this.did, gasPrice
            );
            return tokenId;
        }).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Mint a nft on Pasar collection
     *
     * @param tokenURI The token uri to this new NFT item
     * @param roylatyFee The royalty fee to the new NFT item
     * @returns The tokenId of being minted a nft
     */
    public async createItemFromPasar(
        tokenURI: string,
        roylatyFee: number,
    ): Promise<string> {
        return await this.getGasPrice().then(async gasPrice => {
            let tokenId = `0x${sha256(tokenURI.replace("pasar:json:", ""))}`;
            await this.contractHelper.mintFromPasarCollection(
                this.appContext.getPasarCollectionAddress(), tokenId, tokenURI, roylatyFee, gasPrice
            );
            return tokenId;
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
     * @returns
     */
    public async transferItem(baseToken: string,
        tokenId: string,
        toAddr: string,
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            await this.contractHelper.approveItems(TOKEN_721_ABI, baseToken, toAddr, gasPrice);
            await this.contractHelper.transfer721Item(toAddr, tokenId, baseToken, gasPrice);
        }).catch (error => {
            throw new Error(error);
        })
    }

    public async transferItemInFeeds(baseToken: string,
        tokenId: string,
        toAddr: string,
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            await this.contractHelper.approveItems(FeedsCollectionABI, AppContext.getAppContext().getFeedsCollectionAddress(), toAddr, gasPrice);
            await this.contractHelper.transferItemInFeeds(toAddr, tokenId, baseToken, gasPrice);
        }).catch (error => {
            throw new Error(error);
        })
    }

    public async transferItemInPasar(baseToken: string,
        tokenId: string,
        toAddr: string
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            await this.contractHelper.approveItems(PasarCollectionABI, AppContext.getAppContext().getPasarCollectionAddress(), toAddr, gasPrice);
            await this.contractHelper.transferItemInPasar(toAddr, tokenId, baseToken, gasPrice);
        }).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Create a metadata json file for trading either buyer or seller.
     *
     * @eturns The uri of metadata json file pushed onto IPFS storage.
     */
    public async createTraderMetadata() {
        try {
            const client = create({
                 url: this.appContext.getIPFSNode()
            });

            let result = await client.add(JSON.stringify({
                "did": this.did,
                "name": this.name,
                "description": this.description
            }));

            return `pasar:json:${result.path}`;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * List an specific NFT item onto marketplace for rading with fixed price.
     *
     * @param baseToken The collection of this NFT item
     * @param tokenId The tokenId of NFT item
     * @param pricingToken The token address of pricing token
     * @param price The price value to sell
     * @param sellerURI:
     */
    public async listItem(baseToken: string,
        tokenId: string,
        pricingToken: string,
        price: number,
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            let contractABI = TOKEN_721_ABI;
            if(baseToken == this.appContext.getFeedsCollectionAddress() || baseToken == this.appContext.getPasarCollectionAddress()) {
                contractABI = TOKEN_1155_ABI
            }
            await this.contractHelper.approveItems(contractABI, baseToken, this.appContext.getMarketContract(), gasPrice);
            await this.contractHelper.createOrderForSale(
                this.appContext.getMarketContract(),
                tokenId,
                baseToken,
                BigInt(price*1e18).toString(),
                pricingToken,
                this.did,
                gasPrice
            );
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
     * @returns The result of bidding action.
     */
    public async changePrice(orderId: string,
        newPricingToken: string,
        newPrice: number,
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            await this.contractHelper.changePrice(
                this.appContext.getMarketContract(),
                parseInt(orderId),
                BigInt(newPrice*1e18).toString(),
                newPricingToken,
                gasPrice
            );
        }).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Buy an item listed on marketplace
     * This function is used to buy the item with fixed price.
     *
     * @param orderId The orderId of NFT item on maketplace
     * @returns The orderId of buying the order
     */
    public async buyItem(orderId: string,
        buyingPrice: number,
        quoteToken: string,
        buyerURI: string,
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            if(quoteToken != defaultAddress) {
                await this.contractHelper.approveToken(
                    buyingPrice, quoteToken, this.appContext.getMarketContract(), gasPrice
                );
            }
            await this.contractHelper.buyItem(
                this.appContext.getMarketContract(),
                orderId, buyingPrice, quoteToken, buyerURI,  gasPrice
            );
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
     * @param sellerURI The uri of seller information on IPFS storage
     */
    public async listItemOnAuction(baseToken: string,
        tokenId: string,
        pricingToken: string,
        minPrice: number,
        reservePrice: number,
        buyoutPrice: number,
        expirationTime: number,
    ): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            await this.contractHelper.approveItems(PasarCollectionABI, baseToken, this.appContext.getMarketContract(), gasPrice);
            await this.contractHelper.createOrderForAuction(
                this.appContext.getMarketContract(),
                baseToken,
                tokenId,
                pricingToken,
                minPrice,
                reservePrice,
                buyoutPrice,
                expirationTime,
                this.did,
                gasPrice
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
     * @returns The orderId
     */
    public async changePriceOnAuction(orderId: string,
        newPricingToken: string,
        newMinPrice: number,
        newReservedPrice: number,
        newBuyoutPrice: number
    ): Promise<void> {
        return await this.getGasPrice().then (async gasPrice => {
            let priceValue = BigInt(newMinPrice*1e18).toString();
            let reservePriceValue = BigInt(newReservedPrice*1e18).toString();
            let buyoutPriceValue = BigInt(newBuyoutPrice*1e18).toString();

            await this.contractHelper.changePriceOnAuction(
                this.appContext.getMarketContract(),
                parseInt(orderId),
                priceValue,
                reservePriceValue,
                buyoutPriceValue,
                newPricingToken,
                gasPrice
            );
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
     * @returns The result of bidding action.
     */
    public async bidItemOnAuction(orderId: string,
        quoteToken: string,
        price: number,
        bidderURI: string
    ): Promise<void> {
        return await this.getGasPrice().then (async gasPrice => {
            let priceValue = Number(BigInt(price*1e18));
            if(quoteToken != defaultAddress) {
                await this.contractHelper.approveToken(priceValue, quoteToken, this.appContext.getMarketContract(), gasPrice);
            }

            await this.contractHelper.bidItemOnAuction(
                this.appContext.getMarketContract(),
                orderId,
                priceValue,
                quoteToken,
                bidderURI,
                gasPrice);
        }).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Settle the listed NFT item on auction on marketplace
     *
     * @param orderId The orderId of NFT item listed on auciton.
     */
    public async settleAuction(orderId: string): Promise<void> {
        return await this.getGasPrice().then(async gasPrice => {
            await this.contractHelper.settleAuction(this.appContext.getMarketContract(), orderId, gasPrice);
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
     * @returns
     */
    public async unlistItem(orderId: string): Promise<void> {
        await this.getGasPrice().then(async gasPrice => {
            await this.contractHelper.unlistItem(this.appContext.getMarketContract(), orderId, gasPrice);
        }).catch (error => {
            throw new Error(error);
        })
    }
}
