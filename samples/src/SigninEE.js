
import React, {useState} from 'react'
import { signin, signout } from '@pasarprotocol/pasar-sdk-development';
import {
  useNavigate
} from "react-router-dom";

function SigninEE() {
  const navigate = useNavigate();
  const [login, setLogin] = useState(false);

  const handleSigninEE1 = async () => {
    let result = await signin();
    setLogin(result);
  }

  const handleSignout = async () => {
    await signout();
    setLogin(false);
  }

  const handleClickMint = () => {
    navigate("/mint");
  }

  const handleClickBurn = () => {
    navigate("/burn");
  }

  return (
    !login ?
    <div>
        <button onClick={handleSigninEE1}>Sign in with EE</button>
        {/* <button onClick={handleSigninMM}>Sign in with MM</button> */}
    </div> :
    <div>
        <button onClick={handleSignout}>Sign out</button>

        <div>
          <button onClick={handleClickMint}>Add New NFT</button>
          <button onClick={handleClickBurn}>Burn NFT</button>
        </div>
        
    </div>

    
  );
}

export default SigninEE;
