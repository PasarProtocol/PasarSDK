import { useState, useEffect } from "react";
import { MyProfile, AppContext } from "@pasarprotocol/pasar-sdk-development";

const MintNFT = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [collectionAddress, setCollectionAddress] = useState("");
    const [urlImage, setUrlImage] = useState('');

    const handleMint = async () => {
        try {
            console.log(name);
            console.log(description);
            console.log(urlImage);
            let user = JSON.parse(localStorage.getItem("user"));
            const myProfile = new MyProfile(AppContext.getInstance(), user['did'], user['address'], user['name'], user['bio'], null);
            let metaData = await myProfile.createItemMetadata(name, description, urlImage, null, false, false);
            let tokenId = await myProfile.createItemFromPasar(metaData, 10)
            console.log(tokenId);
        } catch(err) {
            console.log(err);
        }
    }

    const handleChangeImage = (e) => {
        setUrlImage(e.target.files[0]);
    }

    return (
        <div>
            <div>
                <input type="file" onChange={e => handleChangeImage(e)}/>

            </div>
            <div>
                <h3 className="sub_title">Collection Address</h3>
                <input value={collectionAddress} onChange={(e) => setCollectionAddress(e.target.value)}/>
            </div>
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
