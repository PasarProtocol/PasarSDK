import { AppContext } from "./appcontext"
import { Dispatcher } from "./dispatcher";
import { NftItem } from "./nftitem";

class Condition {
}

/**
 * This class represents the Pasar marketplace where NFT items are being traded.
 */
export class Marketplace {
    private appContext: AppContext;
    private numberOfItems: number;

    /**
     * Get the number of total listed NFT item on local storage
     * @returns The number of listed NFT item
     */
    public getNumberOfItems(): number {
        return this.numberOfItems;
    }

    /**
     * Get the number of total listed NFT items from remote assist service.
     *
     * @param dispatcher: The dispatcher routine to deal with the total number of listed
     *        NFT item.
     * @returns The promise object contain the total number of listed NFT items.
     */
    public fetchNumberOfListedItems(
        dispatcher: Dispatcher<number>,
    ): Promise<number> {
        throw new Error("Method not implemnted");
    }

    /**
     * TODO:
     * @param earilerThan
     * @param maximum
     * @param dispatcher
     */
    public fetchAndDipatchItems(earilerThan: number,
        maximum: number,
        condition: Condition,
        dispatcher: Dispatcher<NftItem>): Promise<NftItem[]> {

        throw new Error("Method not implemented");
    }
}