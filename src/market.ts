import { AppContext } from "./appcontext"
import { getAllListedItems } from "./assistservice";
import { Filter } from "./filters/filter";
import { ItemPage } from "./itempage";

/**
 * This class represents the Pasar marketplace where NFT items are being traded.
 */
export class Market {
    private assistUrl: string;

    public constructor() {
        this.assistUrl = AppContext.getAppContext().getAssistNode();
    }

    private earilerThan: number = Math.floor(Date.now() / 1000);

    /**
     * Get the number of total listed NFT items from remote assist service.
     * @returns The promise object contain the total number of listed NFT items.
     */
    public queryItemCount(_filter = new Filter()): Promise<number> {
        throw new Error("Method not implemnted");
    }

    /**
     * Query listed items on marketplace.
     * @param earilerThan
     * @param maximum
     * @param filter
     */
    public async queryItems(pageNum:number = 1, pageSize:number = 10,): Promise<ItemPage> {
        if(pageNum == 1) {
            this.earilerThan = Math.floor(Date.now() / 1000);
        }
        return await getAllListedItems(this.assistUrl, this.earilerThan, "", pageNum, pageSize).catch(error => {
            throw new Error(error);
        })
    }
}