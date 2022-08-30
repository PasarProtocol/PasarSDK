import { CollectionCategory } from "./collectioncategory";
import { ItemType } from "./itemtype";
import { Profile } from "./profile";
import { ProgressHandler } from "./progresshandler";
import { RoyaltyRate } from "./RoyaltyRate";

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
        category: CollectionCategory,
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
     * @param properties
     * @param sensitive Indicator whether the NFT item contains sensitive content or not.
     * @param acutalImageHandler: The handler to deal with the progress on uploading acutal
     *        image and (maybe) thumbnail of this iamge as well to IPFS storage.
     * @param metadataHandler: The handler to deal with the progress on uploading metadata
     *        json file onto IPFS storage
     * @returns The uri of this NFT item metadata.
     */
    public createItemMetadata(
        itemName: string,
        itemDescription: string,
        itemImage: string,
        properties: any = [],
        sensitive = false,
        acutalImageHandler: ProgressHandler,
        metadataHandler: ProgressHandler,
    ): Promise<string> {
        throw new Error("Method not implemented");
    }

    /**
     * Mint an NFT item from a specific collection contract with single quantity, in
     * this function, the tokenId of this NFT item would be generated by SHA25 agorithm
     * on tokenURI string of metadata json file on IPFS sotrage.
     * Notice: This function should be used for minting NFTs from DEDICATED collection.
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
     * @param progressHandler: The handler to deal with progress on minting a new NFT item
     * @returns The tokenId of the new NFT.
     */
    public createItemWithRoyalties(baseToken: string,
        tokenUri: string,
        roylatyFee: number,
        progressHandler: ProgressHandler): Promise<string> {
        throw new Error("Method Not implemented");
    }

    /**
     * Delete exiting NFT item.
     * Notice: the NFT item should be unlisted from marketplace first before deleting
     *         the item.
     *
     * @param baseToken The collection contract where NFT items would be burned
     * @param tokenId The tokenId of NFT item to be burned
     * @param progressHandler: The handler to deal with progress on deletion of an NFT item
     * @returns The result of whether the NFT is deleted or not.
     */
    public deleteItem(baseToken: string,
        tokenId: string,
        progressHandler: ProgressHandler): Promise<boolean> {
        throw new Error("Method Not implemented");
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
     * @param pricingToken The contract address of ERC20 token as pricing token
     * @param price The price value to sell
     * @param sellerUri The uri of seller information on IPFS storage
     * @param progressHandler The handler to deal with the progress on listing NFT item on
     *        Pasar marketplace
     * @returns The orderId of the order listed on marketplace.
     */
    public listNFItem(baseToken: string,
        tokenId: string,
        pricingToken: string,
        price: number,
        sellerUri: string,
        progressHandler: ProgressHandler): Promise<string> {

        throw new Error("Method not implemnted");
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
     *        Pasar marketplace
     */
    public listNFTItemOnAuction(baseToken: string,
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
}
