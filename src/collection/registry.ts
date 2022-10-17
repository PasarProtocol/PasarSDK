import { AppContext } from "../appcontext";
import { Filter } from "../filters/filter";
import { CollectionPage } from "./collectionpage";

class Registry {
    private appContext: AppContext;

    public queryCollectionNum(): Promise<number> {
        throw new Error("Method not implemented");
    }

    public queryCollections(
        earierThan: number,
        capcity: number,
        queryFilter: Filter = null
    ): Promise<CollectionPage> {
        throw new Error("Method not implemented");
    }
}

export {
    Registry
}
