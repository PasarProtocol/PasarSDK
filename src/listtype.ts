export enum ListTypes {
    fixPrice = "FixPrice",
    auction = "Auction"
}

export class ListType {
    
    public getListTypes() {
        var returnValue = [
            ListTypes.fixPrice,
            ListTypes.auction,
        ]

        return returnValue;
    }

    public isAuction(type: string) {
        if(type == ListTypes.auction) {
            return true;
        } else {
            return false;
        }
    }
}