import { AppContext } from "../appcontext";
import { Filter } from "../filters/filter";
import { CollectionInfo } from "./collectioninfo";

class Registry {
    private appContext: AppContext;

    public queryCollectionNum(): Promise<number> {
        throw new Error("Method not implemented");
    }

    public queryCollections(earierThan: number, maximum: number, queryFilter: Filter = null): Promise<CollectionInfo> {
        throw new Error("Method not implemented");
    }
}

export {
    Registry
}
