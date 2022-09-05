export interface UserInfo {
    name:string,
    bio:string,
    did:string,
    address:string,
}

let userInfo: UserInfo;

const setUserInfo = (info: UserInfo) => {
    userInfo = info;
}

const getUserInfo = ():UserInfo => {
    return userInfo;
}

const deleteUserInfo = () => {
    userInfo.name = null;
    userInfo.bio = null;
    userInfo.did = null;
    userInfo.address = null;
}

export {
    setUserInfo,
    getUserInfo,
    deleteUserInfo
}

