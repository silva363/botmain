/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Navbar from "@/components/navbar/navbar";
import React, { useEffect, useState } from "react";
import { BlocoBtn, Separator } from "./styles";
import Link from "next/link";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/components/store/authContext";
import Loader from "@/components/loader/loader";
import { getGasFeePrices } from "@/app/utils/data";
import { ethers } from "ethers";

const CreateSeedBot = () => {
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTokenList, setIsLoadingTokenList] = useState(true);
  const [isLoadingEstimatedGas, setIsLoadingEstimatedGas] = useState(true);
  const [estimatedGas, setEstimatedGas] = useState("0");
  const [actualGasPrice, setActualGasPrice] = useState(BigInt(0));
  const [formData, setFormData] = useState<SeedBotData>({
    id: 0,
    uuid: "",
    name: "",
    helper_private_key: "",
    account_private_key: "",
    account_friendly_name: "",
    destiny_address: "",
    destiny_friendly_name: "",
    amount: 10,
    cycles: 10,
    cycle_ghosts: 15,
    cycle_delay: 180,
    actual_cycle: 0,
    airdrop_time: 60,
    token_symbol: "",
    active: 0,
    executions: 0,
    transactions: 0
  });
  const { push } = useRouter();
  const { token } = useGlobalContext();

  useEffect(() => {
    async function loadTokenlist() {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/acceptedTokens/list`, {
          formData,
          authtoken: token
        });

        setIsLoading(false);
        setTokenList(response.data.data);
      } catch (error: any) {
        setIsLoading(false);
        toast.error(error.message);
      }
    };

    async function loadEstimatedGas() {
      try {
        const gasFee = await getGasFeePrices();
        const maticTaxNeed = gasFee.gasPrice * BigInt(30000) * BigInt(formData.cycles * formData.cycle_ghosts * 10);
        const gas = ethers.formatEther(maticTaxNeed);
        setEstimatedGas(gas);
        setActualGasPrice(gasFee.gasPrice);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        toast.error(error.message);
      }
    };

    if (token) {
      if (isLoading && isLoadingTokenList) {
        setIsLoadingTokenList(false);
        loadTokenlist();
      }

      if (isLoading && isLoadingEstimatedGas) {
        setIsLoadingEstimatedGas(false);
        loadEstimatedGas();
      }
    }
  }, [isLoading, isLoadingTokenList, formData, tokenList, token, actualGasPrice, estimatedGas, isLoadingEstimatedGas]);

  const handleChange = async (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "type" ? value : value || value,
    }));

    if (name == 'cycles') {
      const maticTaxNeed = actualGasPrice * BigInt(30000) * BigInt(value * formData.cycle_ghosts * 10);
      const gas = ethers.formatEther(maticTaxNeed);
      setEstimatedGas(gas);
    } else if (name == 'cycle_ghosts') {
      const maticTaxNeed = actualGasPrice * BigInt(30000) * BigInt(value * formData.cycles * 10);
      const gas = ethers.formatEther(maticTaxNeed);
      setEstimatedGas(gas);
    }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    try {
      if (!formData.name) {
        toast.warning("Preencha o nome do bot");
        return;
      }

      if (!formData.account_private_key) {
        toast.warning("Preencha a chave privada");
        return;
      }

      if (!formData.destiny_address) {
        toast.warning("Preencha a carteira de destino");
        return;
      }

      if (!formData.token_symbol) {
        toast.warning("Selecione o símbolo do token");
        return;
      }

      if (!formData.amount) {
        toast.warning("Preencha a quantidade de tokens");
        return;
      }

      if (!formData.cycles) {
        toast.warning("Preencha a quantidade de ciclos");
        return;
      }

      if (!formData.cycle_ghosts) {
        toast.warning("Preencha a quantidade de ghost wallets por ciclo");
        return;
      }


      if (!formData.cycle_delay) {
        toast.warning("Preencha o atraso entre ciclos");
        return;
      }

      if (!formData.airdrop_time) {
        toast.warning("Preencha o tempo de airdrop");
        return;
      }

      setIsLoading(true);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/seed-bot/create`, {
        formData,
        authtoken: token
      });

      setIsLoading(false);
      console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message)
        push("/dashboard/seed-bots/list");
      } else {
        if (response.data.message) {
          toast.error(response.data.message);
        } else {
          toast.error(response.data);
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Navbar />
      {isLoading ?
        (
          <Loader></Loader>
        ) : (
          <div className="form-style">
            <h1>Configuração da Automação</h1>
            <form onSubmit={handleSave}>
              <span>
                <label>Nome do Bot</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label>Chave privada de regaste <b>(AUXILIAR)</b></label>
                <input
                  type="password"
                  name="helper_private_key"
                  value={formData.helper_private_key}
                  onInput={handleChange}
                />
              </span>
              <span>
                <label>Chave privada</label>
                <input
                  type="password"
                  name="account_private_key"
                  value={formData.account_private_key}
                  onInput={handleChange}
                />
              </span>
              <span>
                <label>Nome amigavel da chave privada (Opcional)</label>
                <input
                  type="text"
                  name="account_friendly_name"
                  value={formData.account_friendly_name}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label>Carteira de destino</label>
                <input
                  type="text"
                  name="destiny_address"
                  value={formData.destiny_address}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label>Nome amigavel da carteira de destino (Opcional)</label>
                <input
                  type="text"
                  name="destiny_friendly_name"
                  value={formData.destiny_friendly_name}
                  onChange={handleChange}
                />
              </span>

              <span>
                <label>Selecione o token</label>
                <select
                  name="token_symbol"
                  value={formData.token_symbol}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  {
                    tokenList && tokenList?.length > 0 ?
                      tokenList.map((token: any) => (
                        <option key={token.id} value={token.symbol}>
                          {token.name}
                        </option>
                      ))
                      :
                      ''
                  }
                </select>
              </span>
              <span>
                <label>Quantidade de tokens</label>
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label style={{ display: "flex" }}>Ciclos <label style={{ color: "red", marginLeft: "5px" }}>(Gas estimado para conclusão - <b>{estimatedGas} POL</b>)</label></label>
                <input
                  type="text"
                  name="cycles"
                  value={formData.cycles}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label style={{ display: "flex" }}>Ghosts por Ciclo</label>
                <input
                  type="text"
                  name="cycle_ghosts"
                  value={formData.cycle_ghosts}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label style={{ display: "flex" }}>Atraso entre ciclos (segundos)</label>
                <input
                  type="text"
                  name="cycle_delay"
                  value={formData.cycle_delay}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label style={{ display: "flex" }}>Airdrop time (minutos)</label>
                <input
                  type="text"
                  name="airdrop_time"
                  value={formData.airdrop_time}
                  onChange={handleChange}
                />
              </span>

              <Separator />
              <BlocoBtn>
                <Link href="/dashboard/seed-bots/list">
                  <button type="button">Voltar</button>
                </Link>
                <button type="submit">Salvar</button>
              </BlocoBtn>
            </form>
          </div>
        )}
    </>
  );
};

export default CreateSeedBot;
