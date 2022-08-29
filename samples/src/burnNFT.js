import { useState } from "react";
import { burn } from "@pasarprotocol/pasar-sdk-development";

const BurnNFT = () => {
    const [tokenId, setTokenId] = useState("");

    const handleBurn = async () => {
        let result = await burn(tokenId, 1);
        console.log(result);
    }

    return (
        <div>
            <div>
                <h3 className="sub_title">tokenId</h3>
                <input value={tokenId} onChange={(e) => setTokenId(e.target.value)}/>
            </div>
            <button className="button" onClick={handleBurn}>Burn</button>
        </div>
    );
}

export default BurnNFT;
