import { useState } from "react";
import { MyProfile } from "@pasarprotocol/pasar-sdk-development";

const TransferNFT = () => {
    const [tokenId, setTokenId] = useState("");
    const [toAddress, setToAddress] = useState("");

    const handleTransfer = async () => {
        try {
            let user = JSON.parse(localStorage.getItem("user"));
            const myProfile = new MyProfile(user['did'], user['address'], user['name'], user['bio'], null);
            await myProfile.transferItem("0x686D6cB8f81dF709564Ed0041A5d522716892c37", tokenId, toAddress);
        } catch(err) {
            console.log(err);
        }
    }   

    return (
        <div>
            <div>
                <h3 className="sub_title">tokenId</h3>
                <input value={tokenId} onChange={(e) => setTokenId(e.target.value)}/>
            </div>
            <div>
                <h3 className="sub_title">to</h3>
                <input value={toAddress} onChange={(e) => setToAddress(e.target.value)}/>
            </div>
            <button className="button" onClick={handleTransfer}>Transfer</button>
        </div>
    );
}

export default TransferNFT;
