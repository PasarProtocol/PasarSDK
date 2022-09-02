import { create, IPFSHTTPClient } from 'ipfs-http-client';
import sha256 from 'crypto-js/sha256';
import Web3 from 'web3';
import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';
import { CollectionType } from "./collectiontype";
import { ItemType } from "./itemtype";
import { Profile } from "./profile";
import { ProgressHandler } from "./progresshandler";
import { RoyaltyRate } from "./RoyaltyRate";
import { isTestnetNetwork } from './networkType';
import { valuesOnTestNet, valuesOnMainNet } from "./constant";
import { resizeImage, isInAppBrowser, getFilteredGasPrice } from "./global";
import { ImageDidInfo, NFTDidInfo, ResultCallContract, ResultOnIpfs, UserDidInfo } from './utils';
import PASAR_CONTRACT_ABI from './contracts/abis/stickerV2ABI';
import { ItemInfo } from './iteminfo';

/**
 * This class represent the Profile of current signed-in user.
 */
export class MyProfile extends Profile {
    
    /**
     * Create a NFT collection contract and deploy it on specific EVM blockchain.
     *
     * @param name The name of NFT collection
     * @param symobl The symbol of NFT collection
     * @param itemType The type of NFT collection, currenly only supports ERC721 and ERC1155.
     * @param progressHandler The handler to deal with progress on creating and deploying an
     *        NFT collection contract
     * @returns The deployed NFT collection contract address.
     */
     public createCollection(name: string,
        symobl: string,
        itemType: ItemType,
        progressHandler: ProgressHandler): Promise<string> {
        throw new Error("Method not implemtend");
    }

    /**
     * Generate a metadata json file of the NFT collection that is about to be registered.
     *
     * @param name The name of NFT collection
     * @param description The brief description of NFT collection
     * @param avatar The avatar image path
     * @param category The category of NFT collection
     * @param socialMedias The social media related to this NFT collection
     * @param avatarHandler The handler to deal with the progress on uploading avatar image onto
     *        IPFS storage
     * @param metadataHandler The handler to deal with the progress on uploading a metadata json
     *        file onto IPFS storage
     * @returns The URI to this collection metadata json file on IPFS storage.
     */
    public createCollectionMetadata(name: string,
        description: string,
        avatar: string,
        category: CollectionType,
        socialMedias: any,
        avatarHandler: ProgressHandler,
        metadataHandler: ProgressHandler) : Promise<string> {

        throw new Error("Method not implemtend");
    }

    /**
     * Register an specific NFT collection onto Pasar marketplace.
     * Once the collection is registered to Pasar marketplace, the NFTs in this collection can
     * be listed onto market for trading.
     *
     * @param tokenAddress The NFT collection contract address.
     * @param name The name of NFT collection
     * @param collectionUri The uri of the NFT collection referring to the metadata json file on
     *        IPFS storage
     * @param royaltyRates The roraylty rates for this NFT collection
     * @param progressHandler: The handlder to deal with the progress on registeraton of this
     *        NFT collection onto Pasar marketplace
     * @returns The result of whether this NFT collection contract is registered ont Pasar or not
     */
    public registerCollection(tokenAddress: string,
        name: string,
        collectionUri: string,
        royaltyRates: RoyaltyRate[],
        progressHandler: ProgressHandler): Promise<boolean> {

        throw new Error("Method not implemted");
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
    public updateCollectionURI(tokenAddress: string,
        name: string,
        collectionUri: string,
        progressHandler: ProgressHandler): Promise<boolean> {

        throw new Error("Method not implemented");
    }

    /**
     * Update royalties for the NFT collection
     * @param tokenAddress The NFT collection contract address
     * @param royaltyRates The roraylty rates for this NFT collection
     * @param progressHandler The handler to deal with the progress on updating this NFT collection
     *        on Pasar marketplace
     * The result of whether the NFT collection is updated or not.
     */
    public updateCollectionRoyalties(tokenAddress: string,
        royaltyRates: RoyaltyRate[],
        progressHandler: ProgressHandler): Promise<boolean> {

        throw new Error("Method not implemented");
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
     * @returns The result included tokenId, metadata, etc.
     */
    public async createItemMetadata(
        itemName: string,
        itemDescription: string,
        itemImage: any,
        baseToken: string,
        properties: any = null,
        sensitive = false,
        handleProgress:any = null,
    ): Promise<ResultOnIpfs> {
        let result:ResultOnIpfs;
        try {
            let ipfsURL:string;
            let version:number;

            if(isTestnetNetwork()) {
                ipfsURL = valuesOnTestNet.urlIPFS;
                version = baseToken == valuesOnTestNet.elastos.stickerContract ? 1 : 2;
            } else {
                ipfsURL = valuesOnMainNet.urlIPFS;
                version = baseToken == valuesOnMainNet.elastos.stickerContract ? 1 : 2;
            }
            const client = create({ url: ipfsURL });
            handleProgress ? handleProgress(10) : null;

            let image_add = await client.add(itemImage);
            handleProgress ? handleProgress(20) : null;

            let thumbnail:any = await resizeImage(itemImage, 300, 300);
            handleProgress ? handleProgress(30) : null;

            let thumbnail_add = image_add;

            if(thumbnail.success === 0) {
                thumbnail_add = await client.add(thumbnail.fileContent);
            }

            let jsonDid = JSON.parse(sessionStorage.getItem('USER_DID'));

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
                "version": version,
                "type": 'image',
                "name": itemName,
                "description": itemDescription,
                "creator": creatorObject,
                "data": imageObject,
                "adult": sensitive,
                "properties": properties || "",
            }

            let metaData = await client.add(JSON.stringify(metaObj));
            console.log(metaData.path);
            handleProgress ? handleProgress(40) : null;

            return result = {
                success: true,
                result: "success",
                medadata: `pasar:json:${metaData.path}`,
            }
        } catch(err) {
            return result = {
                success: false,
                result: err,
                medadata: null,
            }
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
    public creatItem(baseToken: string,
        tokenUri: string,
        progressHandler: ProgressHandler): Promise<string> {
        throw new Error("Method Not implemented");
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
     * @returns The result of being minted the nft. if success = true, data is tokenId, else data is error infomation
     */
    public async createItemWithRoyalties(
        baseToken: string,
        tokenUri: string,
        roylatyFee: number,
        handleProgress:any = null
    ): Promise<ResultCallContract> {
        let result: ResultCallContract;

        const essentialsConnector = new EssentialsConnector();

        const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());

        let accounts = await walletConnectWeb3.eth.getAccounts();
        handleProgress ? handleProgress(50) : null;

        let gasPrice = await walletConnectWeb3.eth.getGasPrice();
        gasPrice = getFilteredGasPrice(gasPrice);
        handleProgress ? handleProgress(60) : null;
        let tokenId = `0x${sha256(tokenUri.replace("pasar:json:", ""))}`;
        try {
            await this.getCallContext().mintFunction(PASAR_CONTRACT_ABI, baseToken, accounts[0], tokenId, 1, tokenUri, roylatyFee, essentialsConnector, gasPrice);
            result = {
                success: true,
                data: tokenId
            }
            handleProgress ? handleProgress(100) : null;
        } catch(err) {
            result = {
                success: false,
                data: err
            }
        }

        return result;
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
        handleProgress:any = null): Promise<ResultCallContract> {
        let result: ResultCallContract;

        const essentialsConnector = new EssentialsConnector();

        const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());

        let accounts = await walletConnectWeb3.eth.getAccounts();
        handleProgress ? handleProgress(50) : null;

        let gasPrice = await walletConnectWeb3.eth.getGasPrice();
        gasPrice = getFilteredGasPrice(gasPrice);
        handleProgress ? handleProgress(60) : null;
        try {
            await this.getCallContext().deleteFunction(PASAR_CONTRACT_ABI, baseToken, accounts[0], tokenId, totalSupply, essentialsConnector, gasPrice);
            result = {
                success: true,
                data: tokenId
            }
            handleProgress ? handleProgress(100) : null;
        } catch(err) {
            result = {
                success: false,
                data: err
            }
        }

        return result;
    }

    /**
     * Transfer NFT item to another address.
     *
     * @param baseToken the collection of this NFT item
     * @param tokenId The tokenId of NFT item
     * @param toAddr the target wallet address to recieve the NFT item
     * @param progressHandler The handler to deal with progress on transferring NFT item
     * @returns The result of whether the NFT is transfered or not.
     */
    public transferItem(baseToken: string,
        tokenId: string,
        toAddr: string,
        progressHandler: ProgressHandler): Promise<boolean> {
        throw new Error("Method not impelmented");
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
     * @param sellerUri The uri of seller information on IPFS storage
     * @param progressHandler The handler to deal with the progress on listing NFT item on
     *        Pasar marketplace
     * @returns The orderId of the NFT item listed on marketplace
     */
    public async listItem(
        baseToken: string,
        tokenId: string,
        pricingToken: string,
        price: number,
        progressHandler: any=null): Promise<ResultCallContract> {
            let result: ResultCallContract;

            const essentialsConnector = new EssentialsConnector();

            const walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider());

            let accounts = await walletConnectWeb3.eth.getAccounts();
            progressHandler ? progressHandler(50) : null;

            let gasPrice = await walletConnectWeb3.eth.getGasPrice();
            gasPrice = getFilteredGasPrice(gasPrice);
            progressHandler ? progressHandler(60) : null;
            let priceValue = BigInt(price*1e18).toString();
            try {
                await this.getCallContext().createOrderForSale(accounts[0], tokenId, baseToken, priceValue, pricingToken, essentialsConnector, gasPrice);
                result = {
                    success: true,
                    data: tokenId
                }
                progressHandler ? progressHandler(100) : null;
            } catch(err) {
                result = {
                    success: false,
                    data: err
                }
            }

            return result;
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
    public changePrice(orderId: number,
        newPricingToken: string,
        newPrice: number,
        progressHandler: ProgressHandler): Promise<boolean> {
        throw new Error("Method not implemented");
    }

    /**
     * Buy an item listed on marketplace
     * This function is used to buy the item with fixed price.
     *
     * @param orderId The orderId of NFT item on maketplace
     * @param buyerUri  The uri of buyer information on IPFS storage
     * @param progressHandler The handler to deal with the progress on buying listed item
     * @returns The result of buying action.
     */
    public buyItem(orderId: number,
        buyerUri: string): Promise<boolean> {
        throw new Error("Method not implemented");
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
    public listItemOnAuction(baseToken: string,
        tokenId: string,
        pricingToken: string,
        minPrice: number,
        reservePrice: number,
        buyoutPrice: number,
        startTime: number,
        exipirationTime: number,
        sellerUri: string,
        progressHandler: ProgressHandler): Promise<string> {

        throw new Error("Method not implemented");
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
     * @returns The result of bidding action.
     */
    public changePriceOnAuction(orderId: number,
        newPricingToken: string,
        newMinPrice: number,
        newReservedPrice: number,
        newBuyoutPrice: number,
        progressHandler: ProgressHandler): Promise<boolean> {

        throw new Error("Method not implemented");
    }

    /**
     * Offer a bidding price on list item that is being on auciton on marketplace.
     *
     * @param orderId The orderId of NFT item on auction
     * @param value The price offered by bidder
     * @param bidderUri The uri of bidder information on IPFS storage
     * @param progressHandler The handler to deal with the progress on bidding for NFT item
     *        on marketplace
     * @returns The result of bidding action.
     */
    public bidItemOnAuction(orderId: number,
        value: number,
        bidderUri: string,
        progressHandler: ProgressHandler): Promise<boolean> {

        throw new Error("Method not implemented");
    }

    /**
     * Settle the listed NFT item on auction on marketplace
     *
     * @param orderId The orderId of NFT item on auction
     * @param progressHandler The handler to deal with the progress on settling auction.
     * @returns The result of settling action.
     */
    public settleAuction(orderId: number,
        progressHandler: ProgressHandler): Promise<boolean> {
        throw new Error("Method not implemented");
    }

    /**
     * Unlist an item from marketplace, either it's with fixed price or on auction
     * When the item is on auction with bidding price, it would fail to call this function
     * to unlist NFT item.
     *
     * @param orderId The orderId of NFT listed item on marketplace
     * @param progressHandler The handler to deal with the progress on unlisting the NFT item.
     * @returns The result of unlisting action.
     */
    public unlistItem(orderId: number,
        progressHandler: ProgressHandler): Promise<boolean> {

        throw new Error("Method not implemented");
    }
}
