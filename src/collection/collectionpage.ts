import { CollectionInfo } from "./collectioninfo";

export class CollectionPage {
    private totalCount: number;
    private earlierThan: number;
    private capcity: number;
    private collections: CollectionInfo[];

    public constructor(totalCount: number, earlierThan: number, capcity: number, collections: CollectionInfo[]) {
        this.totalCount = totalCount;
        this.earlierThan = earlierThan;
        this.capcity = capcity;
        this.collections = collections;
    }

    public getTotalCount(): number {
        return this.totalCount;
    }

    public getEarlierTimestamp(): number {
        return this.earlierThan;
    }

    public getCapcity(): number {
        return this.capcity;
    }

    public getCollections(): CollectionInfo[] {
        return this.collections;
    }
}
