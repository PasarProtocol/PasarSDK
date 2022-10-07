import { create, IPFSHTTPClient } from 'ipfs-http-client';
import sha256 from 'crypto-js/sha256';
import Web3 from 'web3';
import bs58 from 'bs58';
import { CollectionCategory } from "./collectioncategory";
import { ItemType } from "./itemtype";
import { Profile } from "./profile";
import { ProgressHandler } from "./progresshandler";
import { RoyaltyRate } from "./RoyaltyRate";
import { isTestnetNetwork } from './networkType';
import { valuesOnTestNet, valuesOnMainNet, DiaTokenConfig, LimitGas, defaultAddress } from "./constant";
import { resizeImage, isInAppBrowser, getFilteredGasPrice, requestSigndataOnTokenID, checkFeedsCollection, getCurrentChainType, getCurrentMarketAddress } from "./global";
import { CollectionSocialField, ImageDidInfo, NFTDidInfo, NormalCollectionInfo, UserDidInfo } from './utils';
import { getUserInfo } from './userinfo';
import { UserInfo } from './userinfo';
import PASAR_CONTRACT_ABI from './contracts/abis/stickerV2ABI';
import FEED_CONTRACT_ABI from './contracts/abis/stickerABI';
import TOKEN_721_ABI from './contracts/abis/token721ABI';
import TOKEN_1155_ABI from './contracts/abis/token1155ABI';
import TOKEN_20_ABI from './contracts/abis/erc20ABI';
import TOKEN_721_CODE from './contracts/bytecode/token721Code';
import TOKEN_1155_CODE from './contracts/bytecode/token1155Code';
import { ChainType } from './chaintype';
import { Collection } from './collection';
import { NftItem } from './nftitem';
import { AppContext } from './appcontext';

/**
 * This class represent the Profile of current signed-in user.
 */
export class MyProfile extends Profile {

    /**
     * Create a NFT collection contract and deploy it on specific EVM blockchain.
     *
     * @param name The name of NFT collection
     * @param symbol The symbol of NFT collection
     * @param collectionUri The uri of NFT collection
     * @param itemType The type of NFT collection, currenly only supports ERC721 and ERC1155.
     * @param progressHandler The handler to deal with progress on creating and deploying an
     *        NFT collection contract
     * @returns The deployed NFT collection contract address.
     */
     public async createCollection(
        name: string,
        symbol: string,
        collectionUri: string,
        itemType: ItemType,
        progressHandler: any): Promise<string> {
        let account = await this.getWalletAddress();
        let gasPrice = await this.getGasPrice();

        gasPrice = getFilteredGasPrice(gasPrice);
        const tokenStandard = {
            "ERC721": {abi: TOKEN_721_ABI, code: TOKEN_721_CODE},
            "ERC1155": {abi: TOKEN_1155_ABI, code: TOKEN_1155_CODE}
        }

        try {
            let collectionAddress = await AppContext.getAppContext().getCallContract().createCollection(account, name, symbol, collectionUri, tokenStandard[itemType], gasPrice);
            progressHandler ? progressHandler(70) : null;
            return collectionAddress;
        } catch(err) {
            throw new Error(err);
        }
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
    public async createCollectionMetadata(
        description: string,
        avatar: any,
        background: any,
        category: CollectionCategory,
        socialMedias: CollectionSocialField,
        handleProgress: any) : Promise<string> {
        let ipfsURL:string;
        try {
            if(isTestnetNetwork()) {
                ipfsURL = valuesOnTestNet.urlIPFS;
            } else {
                ipfsURL = valuesOnMainNet.urlIPFS;
            }
            const client = create({ url: ipfsURL });
            handleProgress ? handleProgress(10) : null;

            let avatar_add = await client.add(avatar);
            handleProgress ? handleProgress(20) : null;

            let background_add = await client.add(background);
            handleProgress ? handleProgress(30) : null;

            let avatarsrc =  `pasar:image:${avatar_add.path}`;
            let backgroundsrc =  `pasar:image:${background_add.path}`;

            let jsonDid:UserInfo = getUserInfo();
            
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
            handleProgress ? handleProgress(40) : null;
            const creatorObject = {
                did: jsonDid.did,
                name: jsonDid.name || "",
                description: jsonDid.bio || "",
                signature: signature && signature.signature ? signature.signature : ""
            }

            const metaObj = {
                "version": "1",
                "creator": creatorObject,
                "data": dataObj
            }
            
            let metaData = await client.add(JSON.stringify(metaObj));
            handleProgress ? handleProgress(50) : null;

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
        collectionUri: string,
        royaltyRates: RoyaltyRate[],
        progressHandler: any): Promise<string> {
        let account = await this.getWalletAddress();
        let gasPrice = await this.getGasPrice();

        gasPrice = getFilteredGasPrice(gasPrice);
        
        try {
            let collectionInfo: NormalCollectionInfo = await AppContext.getAppContext().getCallContract().getCollectionInfo(tokenAddress);
            if(collectionInfo.owner.toLowerCase() != account.toLowerCase()) {
                throw new Error("You can't register this collection");
            }
            await AppContext.getAppContext().getCallContract().registerCollection(account, tokenAddress, collectionInfo.name, collectionUri, royaltyRates, gasPrice);
            progressHandler ? progressHandler(100) : null;
            return tokenAddress;
        } catch(err) {
            throw new Error(err);
        }
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
        progressHandler: any): Promise<void> {
        let account = await this.getWalletAddress();
        let gasPrice = await this.getGasPrice();

        gasPrice = getFilteredGasPrice(gasPrice);
        
        try {
            let collectionInfo: NormalCollectionInfo = await AppContext.getAppContext().getCallContract().getCollectionInfo(tokenAddress);
            if(collectionInfo.owner.toLowerCase() != account.toLowerCase()) {
                throw new Error("You can't update the information of this collection");
            }
            await AppContext.getAppContext().getCallContract().updateCollection(account, tokenAddress, name, collectionUri, gasPrice);
            progressHandler ? progressHandler(100) : null;
        } catch(err) {
            throw new Error(err);
        }
    }

    /**
     * Update royalties for the NFT collection
     * @param tokenAddress The NFT collection contract address
     * @param royaltyRates The roraylty rates for this NFT collection
     * @param progressHandler The handler to deal with the progress on updating this NFT collection
     *        on Pasar marketplace
     * @result 
     */
    public async updateCollectionRoyalties(
        tokenAddress: string,
        royaltyRates: RoyaltyRate[],
        progressHandler: any): Promise<void> {
        let account = await this.getWalletAddress();
        let gasPrice = await this.getGasPrice();

        gasPrice = getFilteredGasPrice(gasPrice);
        
        try {
            let collectionInfo: NormalCollectionInfo = await AppContext.getAppContext().getCallContract().getCollectionInfo(tokenAddress,);
            if(collectionInfo.owner.toLowerCase() != account.toLowerCase()) {
                throw new Error("You can't update the royalties of this collection");
            }
            await AppContext.getAppContext().getCallContract().updateCollectionRoyalties(account, tokenAddress, royaltyRates, gasPrice);
            progressHandler ? progressHandler(100) : null;
        } catch(err) {
            throw new Error(err);
        }
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
        handleProgress:any = null,
    ): Promise<string> {
        try {
            let ipfsURL:string;

            if(isTestnetNetwork()) {
                ipfsURL = valuesOnTestNet.urlIPFS;
            } else {
                ipfsURL = valuesOnMainNet.urlIPFS;
            }
            const client = create({ url: ipfsURL });
            handleProgress ? handleProgress(10) : null;

            let image_add = await client.add(itemImage);
            handleProgress ? handleProgress(20) : null;

            let thumbnail:any = await resizeImage(itemImage, 300, 300);
            handleProgress ? handleProgress(30) : null;

            let thumbnail_add = image_add;
            if(thumbnail['success'] === 0) {
                thumbnail_add = await client.add(thumbnail.fileContent);
            }

            let jsonDid:UserInfo = getUserInfo();

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
            handleProgress ? handleProgress(40) : null;

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
     * @param baseToken The collection contract where NFT items would be minted
     * @param tokenUri The token uri to this new NFT item
     * @param progressHandler: The handler to deal with progress on minting a new NFT item
     * @returns The tokenId of the new NFT.
     */
    public async creatItem(baseToken: string,
        tokenUri: string,
        progressHandler: any): Promise<string> {
        let account = await this.getWalletAddress();
        let gasPrice = await this.getGasPrice();

        gasPrice = getFilteredGasPrice(gasPrice);
        progressHandler ? progressHandler(60) : null;
        let tokenId = `0x${sha256(tokenUri.replace("pasar:json:", ""))}`;
        try {
            let collection:Collection = await AppContext.getAppContext().getCallAssistService().getDetailedCollectionInfo(baseToken, ChainType.ESC);
            if(collection == null) {
                throw new Error("Failed to get the collection Information");
            }
            let collectionType = collection.getERCStandard();
            
            await AppContext.getAppContext().getCallContract().mintFunctionOnCustomCollection(baseToken, account, tokenId, collectionType, tokenUri, gasPrice);
            progressHandler ? progressHandler(100) : null;

            return tokenId;
        } catch(err) {
            throw new Error(err);
        }
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
    public async createItemWithRoyalties(
        baseToken: string,
        tokenUri: string,
        roylatyFee: number,
        handleProgress:any = null
    ): Promise<string> {
        let account = await this.getWalletAddress();
        let gasPrice = await this.getGasPrice();

        gasPrice = getFilteredGasPrice(gasPrice);
        handleProgress ? handleProgress(60) : null;
        let tokenId = `0x${sha256(tokenUri.replace("pasar:json:", ""))}`;
        try {
            let abiFile = PASAR_CONTRACT_ABI;

            if(checkFeedsCollection(baseToken))
                abiFile = FEED_CONTRACT_ABI;
            await AppContext.getAppContext().getCallContract().mintFunction(abiFile, baseToken, account, tokenId, 1, tokenUri, roylatyFee, gasPrice);
            handleProgress ? handleProgress(100) : null;

            return tokenId;
        } catch(err) {
            throw new Error(err);
        }
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
        totalSupply: number,
        handleProgress:any = null): Promise<void> {
        let account = await this.getWalletAddress();
        let gasPrice = await this.getGasPrice();

        gasPrice = getFilteredGasPrice(gasPrice);
        handleProgress ? handleProgress(60) : null;
        try {
            let chainId = this.getChainId();
            let chainType = getCurrentChainType(chainId);

            let collection:Collection = await AppContext.getAppContext().getCallAssistService().getDetailedCollectionInfo(baseToken, chainType);
            if(collection == null) {
                throw new Error("Failed to get the collection Information");
            }
            
            let collectionType = collection.getERCStandard();
            let abiFile = PASAR_CONTRACT_ABI;
            if(collectionType == ItemType.ERC721) 
                abiFile = TOKEN_721_ABI;
            await AppContext.getAppContext().getCallContract().deleteFunction(abiFile, baseToken, account, tokenId, totalSupply, collectionType, gasPrice);
            
            handleProgress ? handleProgress(100) : null;
        } catch(err) {
            throw new Error(err);
        }
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
    public async transferItem(
        baseToken: string,
        tokenId: string,
        toAddr: string,
        progressHandler: any): Promise<void> {
            let account = await this.getWalletAddress();
            let gasPrice = await this.getGasPrice();

            gasPrice = getFilteredGasPrice(gasPrice);
            progressHandler ? progressHandler(30) : null;

            try {
                let chainId = this.getChainId();
                let chainType = getCurrentChainType(chainId);
                let collection:Collection = await AppContext.getAppContext().getCallAssistService().getDetailedCollectionInfo(baseToken, chainType);
                if(collection == null) {
                    throw new Error("Can't find the this collection");
                }
                
                let collectionType = collection.getERCStandard();
                let abiFile = PASAR_CONTRACT_ABI;
                if(collectionType == ItemType.ERC721) 
                    abiFile = TOKEN_721_ABI;
                    
                await AppContext.getAppContext().getCallContract().approvalForAll(abiFile, baseToken, toAddr, account, gasPrice);
                progressHandler ? progressHandler(50) : null;

                await AppContext.getAppContext().getCallContract().transferNFT(abiFile, account, toAddr, tokenId, baseToken, collectionType, gasPrice);
                progressHandler ? progressHandler(100) : null;
            } catch(err) {
                throw new Error(err);
            }
    }

    /**List
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
     * @returns The orderId of the NFT item listed on marketplace
     */
    public async listItem(
        baseToken: string,
        tokenId: string,
        pricingToken: string,
        price: number,
        progressHandler: any=null): Promise<string> {
            let account = await this.getWalletAddress();
            let gasPrice = await this.getGasPrice();

            gasPrice = getFilteredGasPrice(gasPrice);
            progressHandler ? progressHandler(30) : null;
            let priceValue = BigInt(price*1e18).toString();
            try {
                let marketPlaceAddress = getCurrentMarketAddress();
                await AppContext.getAppContext().getCallContract().approvalForAll(PASAR_CONTRACT_ABI, baseToken, marketPlaceAddress, account, gasPrice);
                progressHandler ? progressHandler(50) : null;

                await AppContext.getAppContext().getCallContract().createOrderForSale(account, tokenId, baseToken, priceValue, pricingToken, gasPrice);
                
                progressHandler ? progressHandler(100) : null;
                return tokenId;
            } catch(err) {
                throw new Error(err);
            }
    }

    /**
     * Change the listed price for NFT item on marketplace
     * This function would be used to change the price of listed item with fixed price.
     *
     * @param tokenId The tokenId of NFT item on maketplace
     * @param baseToken The collection address of NFT item
     * @param newPricingToken The token address of new pricing token
     * @param newPrice The new listed price
     * @param progressHandler The handler to deal with the progress on changing price for
     *        specific listed item on marketplace
     * @returns The result of bidding action.
     */
    public async changePrice(
        tokenId: string,
        baseToken: string,
        newPricingToken: string,
        newPrice: number,
        progressHandler: any): Promise<string> {
        let account = await this.getWalletAddress();
        let gasPrice = await this.getGasPrice();

        gasPrice = getFilteredGasPrice(gasPrice);
        progressHandler ? progressHandler(30) : null;
        let priceValue = BigInt(newPrice*1e18).toString();
        try {
            let itemNft:NftItem = await AppContext.getAppContext().getCallAssistService().getCollectibleByTokenId(tokenId, baseToken);
            if(itemNft == null || itemNft.getOrderId() == null || itemNft.getOrderState() != "1" || itemNft.getOrderType() != "1") {
                throw new Error("You can't change the price of this nft");
            }
            let orderId = itemNft.getOrderId();

            await AppContext.getAppContext().getCallContract().changePrice(account, parseInt(orderId), priceValue, newPricingToken, gasPrice);
            progressHandler ? progressHandler(100) : null;

            return orderId;
        } catch(err) {
            throw new Error(err);
        }
    }

    /**
     * Buy an item listed on marketplace
     * This function is used to buy the item with fixed price.
     *
     * @param tokenId The tokenId of NFT item on maketplace
     * @param baseToken The collection address of NFT item
     * @param progressHandler The handler to deal with the progress on buying listed item
     * @returns The orderId of buying the order
     */
    public async buyItem(
        tokenId: string,
        baseToken: string,
        progressHandler: any): Promise<string> {

        let account = await this.getWalletAddress();
        let gasPrice = await this.getGasPrice();

        gasPrice = getFilteredGasPrice(gasPrice);
        progressHandler ? progressHandler(30) : null;
        let did = await this.getUserDid();
        try {
            let itemNft:NftItem = await AppContext.getAppContext().getCallAssistService().getCollectibleByTokenId(tokenId, baseToken);
            
            if(itemNft == null || itemNft.getOrderId() == null || itemNft.getOrderState() != "1") {
                throw new Error("You can't buy this nft");
            }

            let orderId = itemNft.getOrderId();
            let quoteToken = itemNft.getQuoteToken();

            let buyoutPriceValue;
            if(itemNft.getOrderType() == "1") {
                let price = itemNft.getPrice();
                buyoutPriceValue = Number(BigInt(parseFloat(price)));
            } else if(itemNft.getOrderType() == "2") {
                if(itemNft.getBuyoutPrice() == null) {
                    throw new Error("You can't buy this nft");
                } else {
                    let price = itemNft.getBuyoutPrice();
                    buyoutPriceValue = Number(BigInt(parseFloat(price)))
                }
            }

            if(quoteToken != defaultAddress) {
                await AppContext.getAppContext().getCallContract().approveToken(account, buyoutPriceValue, quoteToken, gasPrice);
            }

            await AppContext.getAppContext().getCallContract().buyItem(account, orderId, buyoutPriceValue, quoteToken, did, gasPrice);
            
            progressHandler ? progressHandler(100) : null;

            return orderId;
        } catch(err) {
            throw new Error(err);
        }
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
     * @returns The orderId of the NFT item listed on marketplace
     */
    public async listItemOnAuction(
        baseToken: string,
        tokenId: string,
        pricingToken: string,
        minPrice: number,
        reservePrice: number,
        buyoutPrice: number,
        expirationTime: number,
        progressHandler: any
    ): Promise<string> {
        let account = await this.getWalletAddress();
        let gasPrice = await this.getGasPrice();

        gasPrice = getFilteredGasPrice(gasPrice);
        progressHandler ? progressHandler(30) : null;

        try {
            let marketPlaceAddress = getCurrentMarketAddress();
            await AppContext.getAppContext().getCallContract().approvalForAll(PASAR_CONTRACT_ABI, baseToken, marketPlaceAddress, account, gasPrice);
            progressHandler ? progressHandler(50) : null;
            await AppContext.getAppContext().getCallContract().createOrderForAuction(account, baseToken, tokenId, pricingToken, minPrice, reservePrice, buyoutPrice, expirationTime, gasPrice);
            return tokenId;
        } catch(err) {
            throw new Error(err);
        }
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
    public async changePriceOnAuction(
        tokenId: string,
        baseToken: string,
        newPricingToken: string,
        newMinPrice: number,
        newReservedPrice: number,
        newBuyoutPrice: number,
        progressHandler: any): Promise<string> {

        let account = await this.getWalletAddress();
        let gasPrice = await this.getGasPrice();

        gasPrice = getFilteredGasPrice(gasPrice);
        progressHandler ? progressHandler(30) : null;
        let priceValue = BigInt(newMinPrice*1e18).toString();
        let reservePriceValue = BigInt(newReservedPrice*1e18).toString();
        let buyoutPriceValue = BigInt(newBuyoutPrice*1e18).toString();

        try {
            let itemNft:NftItem = await AppContext.getAppContext().getCallAssistService().getCollectibleByTokenId(tokenId, baseToken);
            if(itemNft == null || itemNft.getOrderId() == null || itemNft.getOrderState() != "1" || itemNft.getOrderType() != "2") {
                throw new Error("You can't change the price of this nft");
            }
            let orderId = itemNft.getOrderId();

            await AppContext.getAppContext().getCallContract().changePriceOnAuction(account, parseInt(orderId), priceValue, reservePriceValue, buyoutPriceValue, newPricingToken, gasPrice);
            
            progressHandler ? progressHandler(100) : null;

            return orderId;
        } catch(err) {
            throw new Error(err);
        }
    }

    /**
     * Offer a bidding price on list item that is being on auciton on marketplace.
     *
     * @param tokenId The tokenId of NFT item on auction
     * @param baseToken the collectiona address of collection
     * @param value The price offered by bidder
     * @param bidderUri The uri of bidder information on IPFS storage
     * @param progressHandler The handler to deal with the progress on bidding for NFT item
     *        on marketplace
     * @returns The result of bidding action.
     */
    public async bidItemOnAuction(
        tokenId: string,
        baseToken: string,
        price: number,
        progressHandler: any): Promise<string> {
        let account = await this.getWalletAddress();
        let gasPrice = await this.getGasPrice();

        gasPrice = getFilteredGasPrice(gasPrice);
        progressHandler ? progressHandler(30) : null;
        
        try {
            let itemNft:NftItem = await AppContext.getAppContext().getCallAssistService().getCollectibleByTokenId(tokenId, baseToken);
            if(itemNft == null || itemNft.getOrderId() == null || itemNft.getOrderState() != "1" || itemNft.getOrderType() != "2") {
                throw new Error("You can't bid to this nft");
            }
            let orderId = itemNft.getOrderId();
            let quoteToken = itemNft.getQuoteToken();

            let priceValue = Number(BigInt(price*1e18));

            if(quoteToken != defaultAddress) {
                await AppContext.getAppContext().getCallContract().approveToken(account, priceValue, quoteToken, gasPrice);
            }
            await AppContext.getAppContext().getCallContract().bidItemOnAuction(account, orderId, priceValue, quoteToken, gasPrice);
            progressHandler ? progressHandler(100) : null;

            return orderId;
        } catch(err) {
            throw new Error(err);
        }
    }

    /**
     * Settle the listed NFT item on auction on marketplace
     *
     * @param tokenId The tokenId of NFT item on auction
     * @param baseToken The collection address of NFT item
     * @param progressHandler The handler to deal with the progress on settling auction.
     * @returns orderId
     */
    public async settleAuction(
        tokenId: string,
        baseToken: string,
        progressHandler: any): Promise<string> {
        let account = await this.getWalletAddress();
        let gasPrice = await this.getGasPrice();

        gasPrice = getFilteredGasPrice(gasPrice);
        progressHandler ? progressHandler(30) : null;
        try {
            let itemNft:NftItem = await AppContext.getAppContext().getCallAssistService().getCollectibleByTokenId(tokenId, baseToken);
            if(itemNft == null || itemNft.getOrderId() == null || itemNft.getOrderState() != "1" || itemNft.getOrderType() != "2") {
                throw new Error("You can't settle auction to this nft");
            }
            let orderId = itemNft.getOrderId();

            await AppContext.getAppContext().getCallContract().settleAuction(account, orderId, gasPrice);
            progressHandler ? progressHandler(100) : null;

            return orderId;
        } catch(err) {
            throw new Error(err);
        }
    }

    /**
     * Unlist an item from marketplace, either it's with fixed price or on auction
     * When the item is on auction with bidding price, it would fail to call this function
     * to unlist NFT item.
     *
     * @param tokenId The tokenId of NFT listed item on marketplace
     * @param baseToken The collection address of NFT iten
     * @param progressHandler The handler to deal with the progress on unlisting the NFT item.
     * @returns 
     */
    public async unlistItem(
        tokenId: string,
        baseToken: string,
        progressHandler: any): Promise<void> {
        let account = await this.getWalletAddress();
        let gasPrice = await this.getGasPrice();

        gasPrice = getFilteredGasPrice(gasPrice);
        progressHandler ? progressHandler(30) : null;
        try {
            let itemNft:NftItem = await AppContext.getAppContext().getCallAssistService().getCollectibleByTokenId(tokenId, baseToken);
            if(itemNft == null || itemNft.getOrderId() == null || itemNft.getOrderState() != "1") {
                throw new Error("You can't unlist this nft on marketplace");
            }
            let orderId = itemNft.getOrderId();

            await AppContext.getAppContext().getCallContract().unlistItem(account, orderId, gasPrice);
            
            progressHandler ? progressHandler(100) : null;
        } catch(err) {
            throw new Error(err);
        }
    }

    /**
     * Upload the user did info to ipfs
     *
     * @returns ipfs path.
     */
    public async getUserDid(): Promise<string> {
        let ipfsURL:string;

        if(isTestnetNetwork()) {
            ipfsURL = valuesOnTestNet.urlIPFS;
        } else {
            ipfsURL = valuesOnMainNet.urlIPFS;
        }

        const client = create({ url: ipfsURL });
        
        let jsonDid:UserInfo = getUserInfo();

        const creatorObject: UserDidInfo = {
            "did": jsonDid.did,
            "name": jsonDid.name || "",
            "description": jsonDid.bio || ""
        }

        let didUri = await client.add(JSON.stringify(creatorObject));
        return `pasar:json:${didUri.path}`;
    }
}
