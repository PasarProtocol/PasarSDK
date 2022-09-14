import { useState, useEffect } from "react";
import { getCoinType, bidItemOnAuction} from "@pasarprotocol/pasar-sdk-development";
import { useNavigate } from "react-router-dom";

const BidNFT = () => {
    const navigate = useNavigate();
    const [tokenId, setTokenId] = useState("");
    const [collectionAddr, setCollectionAddr] = useState("");
    const [price, setPrice] = useState("");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        console.log(progress);
    }, [progress]);

    const handleList = async () => {
        let result;
        result = await bidItemOnAuction(tokenId, collectionAddr, price, setProgress);
        console.log(result);
    }

    return (
        <div>
            <div>
                <h3 className="sub_title">tokenId</h3>
                <input value={tokenId} onChange={(e) => setTokenId(e.target.value)}/>
            </div>
            <div>
                <h3 className="sub_title">Collection Address</h3>
                <input value={collectionAddr} onChange={(e) => setCollectionAddr(e.target.value)}/>
            </div>
            <div>
                <h3 className="Price">Price</h3>
                <input value={price} onChange={(e) => setPrice(e.target.value)}/>
            </div>
            <button className="button" onClick={handleList}>Bid</button>
        </div>
    );
}

export default BidNFT;
