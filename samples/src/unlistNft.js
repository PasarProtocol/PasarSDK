import { useState, useEffect } from "react";
import { unlistItem } from "@pasarprotocol/pasar-sdk-development";
import { useNavigate } from "react-router-dom";

const UnlistNFT = () => {
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState("");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        console.log(progress);
    }, [progress]);

    const handleSettle = async () => {
        let result;
        result = await unlistItem(orderId, setProgress);
        console.log(result);
    }

    const handleClickHome = () => {
        navigate('/')
    }

    return (
        <div>
            <button className="button" onClick={handleClickHome}>Go to first page</button>
            <div>
                <h3 className="sub_title">OrderId</h3>
                <input value={orderId} onChange={(e) => setOrderId(e.target.value)}/>
            </div>
            <button className="button" onClick={handleSettle}>Unlist NFT</button>
        </div>
    );
}

export default UnlistNFT;
