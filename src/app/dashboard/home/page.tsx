/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Navbar from "@/components/navbar/navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@/components/store/authContext";
import Loader from "@/components/loader/loader";
import { toast } from "react-toastify";

export default function Statistics() {
  const [data, setData] = useState<StatisticData | null>(null);
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStatistics, setIsLoadingStatistics] = useState(false);
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState("");
  const [isLoadingTokenList, setIsLoadingTokenList] = useState(true);
  const { token } = useGlobalContext();

  /*
  useEffect(() => {
  async function getStatistics() {
  try {
  setIsLoading(true);
  
  const response = await axios.post(
  `${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/statistic`,
  {
  authtoken: token,
  token_symbol: selectedTokenSymbol,
  }
  );
  
  setData(response.data.data);
  setIsLoading(false);
  } catch (error: any) {
  setIsLoading(false);
  toast.error(error.message);
  }
  };
  
  async function loadTokenlist() {
  try {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/acceptedTokens/list`, { authtoken: token });
  
  setTokenList(response.data.data);
  } catch (error: any) {
  setIsLoading(false);
  toast.error(error.message);
  }
  };
  
  if (isLoading && !isLoadingStatistics) {
  setIsLoadingStatistics(true);
  getStatistics();
  }
  
  if (isLoading && isLoadingTokenList) {
  setIsLoadingTokenList(false);
  loadTokenlist();
  }
  }, [isLoading, isLoadingStatistics, isLoadingTokenList, selectedTokenSymbol]);
  
  const handleConfirm = async () => {
  setIsLoading(true);
  setIsLoadingStatistics(false);
  };
  */

  return (
    <>
      <Navbar />

      {isLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <h1 className="text-center mt-5">Welcome to the MegaBot</h1>
          {
            /*
            <div className="header-container">
            <div className="header-title">
            <h2>Início</h2>
            </div>
            <div className="header-options">
            <p>Selecione o token desejado</p>
            <div className="select-wrapper">
            <select value={selectedTokenSymbol} onChange={(e) => {
            setSelectedTokenSymbol(e.target.value);
            handleConfirm();
            }}>
            <option value="">All</option>
            <option value="MATIC">MATIC</option>
            <option value="WMATIC">WMATIC</option>
            {tokenList && tokenList?.length > 0
            ? tokenList.map((token: any) => (
            <option key={token.id} value={token.symbol}>
            {token.name}
            </option>
            ))
            : ""}
            </select>
            </div>
            </div>
            </div>
            
            <div className="card-container">
            <div className="card">
            <div className="card-content">
            <h3 className="title">Token Symbol</h3>
            <p className="value">{data ? data.symbol : "Loading..."}</p>
            </div>
            </div>
            <div className="card">
            <div className="card-content">
            <h3 className="title">Accepted Tokens</h3>
            <p className="value">{data ? data.accepted_tokens : "Loading..."}</p>
            </div>
            </div>
            <div className="card">
            <div className="card-content">
            <h3 className="title">Transactions</h3>
            <p className="value">{data ? data.transactions : "Loading..."}</p>
            </div>
            </div>
            <div className="card">
            <div className="card-content">
            <h3 className="title">Bots</h3>
            <p className="value">{data ? data.bots : "Loading..."}</p>
            </div>
            </div>
            <div className="card">
            <div className="card-content">
            <h3 className="title">Bot Actives</h3>
            <p className="value">{data ? data.bot_actives : "Loading..."}</p>
            </div>
            </div>
            <div className="card">
            <div className="card-content">
            <h3 className="title">Bot Inactives</h3>
            <p className="value">{data ? data.bot_inactives : "Loading..."}</p>
            </div>
            </div>
            <div className="card">
            <div className="card-content">
            <h3 className="title">Matic Success</h3>
            <p className="value">{data ? data.matic_success : "Loading..."}</p>
            </div>
            </div>
            <div className="card">
            <div className="card-content">
            <h3 className="title">Matic Fails</h3>
            <p className="value">{data ? data.matic_fails : "Loading..."}</p>
            </div>
            </div>
            <div className="card">
            <div className="card-content">
            <h3 className="title">Matic Pending</h3>
            <p className="value">{data ? data.matic_pending : "Loading..."}</p>
            </div>
            </div>
            <div className="card">
            <div className="card-content">
            <h3 className="title">Selected Token Success</h3>
            <p className="value">{data ? data.selected_token_success : "Loading..."}</p>
            </div>
            </div>
            <div className="card">
            <div className="card-content">
            <h3 className="title">Selected Token Fails</h3>
            <p className="value">{data ? data.selected_token_fails : "Loading..."}</p>
            </div>
            </div>
            <div className="card">
            <div className="card-content">
            <h3 className="title">Selected Token Pending</h3>
            <p className="value">{data ? data.selected_token_pending : "Loading..."}</p>
            </div>
            </div>
            <div className="card">
            <div className="card-content">
            <h3 className="title">Airdrops</h3>
            <p className="value">{data ? data.airdrops : "Loading..."}</p>
            </div>
            </div>
            <div className="card">
            <div className="card-content">
            <h3 className="title">Airdrop Success</h3>
            <p className="value">{data ? data.airdrop_success : "Loading..."}</p>
            </div>
            </div>
            <div className="card">
            <div className="card-content">
            <h3 className="title">Airdrop Fails</h3>
            <p className="value">{data ? data.airdrop_fails : "Loading..."}</p>
            </div>
            </div>
            </div>
            */
          }
        </>
      )
      }
    </>
  );
}
