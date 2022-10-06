import { useState, useEffect } from "react";
import { buyItem } from "@pasarprotocol/pasar-sdk-development";
import { useNavigate } from "react-router-dom";

const BuyNFT = () => {
    const navigate = useNavigate();
    const [tokenId, setTokenId] = useState("");
    const [baseToken, setBaseToken] = useState("");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        console.log(progress);
    }, [progress]);

    const handleBuy = async () => {
        try {
            let orderId = await buyItem(tokenId, baseToken, setProgress);
            console.log(orderId);
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div>
            <div>
                <h3 className="sub_title">TokenId</h3>
                <input value={tokenId} onChange={(e) => setTokenId(e.target.value)}/>
            </div>
            <div>
                <h3 className="sub_title">BaseToken</h3>
                <input value={baseToken} onChange={(e) => setBaseToken(e.target.value)}/>
            </div>
            <button className="button" onClick={handleBuy}>Buy</button>
        </div>
    );
}

export default BuyNFT;
