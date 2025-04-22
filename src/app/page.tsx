/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import axios from "axios";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useGlobalContext } from "@/components/store/authContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { setToken, setAddress } = useGlobalContext();
  const { push } = useRouter();

  async function handleSignMessage() {
    try {
      if (!window?.ethereum) {
        toast.error("Wait feel seconds");
        return;
      }

      if (!window?.ethereum.selectedAddress) {
        toast.error("Verify you browser permissions");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = new ethers.JsonRpcSigner(provider, window?.ethereum.selectedAddress);

      const address = signer.address;
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/user/getSignMessage`);
      const message = response.data.message;
      const signature = await signer.signMessage(message);

      const authResponse = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/user/auth`, {
        address,
        message,
        signature
      });

      if (authResponse.data.status) {
        window.localStorage?.setItem('wallet_address', address);
        window.localStorage?.setItem('authtoken', authResponse.data.auth_token);
        setToken(authResponse.data.auth_token);
        setAddress(address);
        push('/dashboard/home')
      } else {
        toast.error((authResponse.data.message).toString());
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="login-page">
      <div>
        <ConnectButton chainStatus="icon" showBalance={false} />
      </div>

      <div className="button-container">
        <p>Conecte sua carteira e depois clique no botão abaixo</p>
      </div>

      <div className="button-container">
        <button type="button" onClick={() => { handleSignMessage() }}>ENTRAR</button>
      </div>
    </div >
  );
}
