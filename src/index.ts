
'use strict';

import { MyProfile } from "./myprofile";
import { getListTypes, isOnAuction } from "./listtype";
import { Category } from "./collection/category";
import { ERCType } from "./erctype";
import { RoyaltyRate } from "./collection/RoyaltyRate";
import { StringIsNumber } from "./global";
import { Profile } from "./profile";
import { Market } from "./market";
import { getChainTypes as _getChainTypes} from "./chaintype";
import { SocialLinks } from "./sociallinks";
import { AppContext } from "./appcontext";
import { ListType } from "./listtype";
import { Token } from "./token";

let myProfileInfo, profileInfo;

const getMyProfileInfo = () => {
    if(!myProfileInfo) {
        myProfileInfo = new MyProfile('', '', null, null, null);
    }
    return myProfileInfo;
}

export {
    Category,
    ERCType,
    SocialLinks,
    ListType,
    Token,
    AppContext,
    Profile,
    MyProfile,
    Market
}
