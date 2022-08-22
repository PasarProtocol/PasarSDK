import { useState } from "react";

const MintNFT = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleMint = () => {
        console.log(name);
        console.log(description);
    }

    return (
        <div>
            <div>
                <h3 className="sub_title">Name</h3>
                <input value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div>
                <h3 className="sub_title">Description</h3>
                <input value={description} onChange={(e) => setDescription(e.target.value)}/>
            </div>
            <button onClick={handleMint}>Mint</button>
        </div>
    );
}

export default MintNFT;
