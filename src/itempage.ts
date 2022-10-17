import { ItemInfo } from "./iteminfo"

export class ItemPage {
    private totalCount: number;
    private earlierThan: number;
    private capcity: number;
    private items: ItemInfo[];

    public constructor(totalCount: number, earlierThan: number, capcity: number, items: ItemInfo[]) {
        this.totalCount = totalCount;
        this.earlierThan = earlierThan;
        this.capcity = capcity;
        this.items = items;
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

    public getItems(): ItemInfo[] {
        return this.items;
    }
}