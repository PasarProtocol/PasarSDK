import { AppContext } from "../appcontext";
import { Filter } from "../filters/filter";
import { CollectionPage } from "./collectionpage";

class Registry {
    private assistURL: string;

    constructor(appContext: AppContext) {
        this.assistURL = appContext.getAssistNode();
    }

    public queryCollectionCount(): Promise<number> {
        throw new Error("Method not implemented");
    }

    public queryCollections(
        _earierThan: number,
        _capcity: number,
        _queryFilter: Filter = new Filter()
    ): Promise<CollectionPage> {
        throw new Error("Method not implemented");
    }
}

export {
    Registry
}
