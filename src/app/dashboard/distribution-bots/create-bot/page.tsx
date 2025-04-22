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

const Listagem = () => {
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTokenList, setIsLoadingTokenList] = useState(true);
  const [formData, setFormData] = useState<DistributionBotData>({
    id: 0,
    name: "",
    account_private_key: "",
    account_friendly_name: "",
    password: "",
    delay: 5,
    token_symbol: "",
    wallets: [],
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

    function loadWallet() {
      formData.wallets.push({ name: "", wallet_address: "", percent: 100 });
    }

    if (token) {
      if (isLoading == true && isLoadingTokenList == true) {
        setIsLoadingTokenList(false);
        loadTokenlist();
        loadWallet();
      }
    }
  }, [isLoading, isLoadingTokenList, formData, tokenList, token]);

  const handleChange = async (e: any, index: number = 0) => {
    const { name, value } = e.target;

    if (index == 0) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: name === "type" ? value : value || value,
      }));
    } else {
      index = index - 1;

      setFormData((prevData) => ({
        ...prevData,
        wallets: prevData.wallets.map((wallet, i) =>
          i === index ? { ...wallet, [name]: value } : wallet
        )
      }));
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

      if (!formData.password) {
        toast.warning("Preencha uma senha");
        return;
      }

      if (formData.wallets.length == 0) {
        toast.warning("Preencha a carteira de destino");
        return;
      }

      if (!formData.token_symbol) {
        toast.warning("Selecione o símbolo do token");
        return;
      }

      if (!formData.delay) {
        toast.warning("Preencha o tempo entre verificações");
        return;
      }

      if (!/^[0-9]+$/.test(formData.delay.toString())) {
        toast.warning("O tempo entre verificações deve conter apenas números");
        return;
      }

      if (!formData.password || formData.password.length < 8) {
        toast.warning("A senha precisa ter ao menos 8 caracteres");
        return;
      }

      setIsLoading(true);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/distribution-bot/create`, {
        formData,
        authtoken: token
      });

      setIsLoading(false);

      if (response.data.success) {
        toast.success(response.data.message)
        push("/dashboard/distribution-bots/list");
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

  const handleAddWallet = () => {
    const newWallets = [
      ...formData.wallets,
      {
        name: "",
        wallet_address: "",
        percent: calcPercentage()
      }
    ];

    const newPercentage = calcPercentage(newWallets.length);
    const updatedWallets = newWallets.map(wallet => ({
      ...wallet,
      percent: newPercentage
    }));

    setFormData({
      ...formData,
      wallets: updatedWallets
    });

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 300);
  };

  const handleRemoveWallet = (indexToRemove: number) => {
    if (!confirm("Você tem certeza que deseja remover esta carteira?")) {
      return;
    }

    const newWallets = formData.wallets.filter((_, index) => index !== indexToRemove);
    const newPercentage = calcPercentage(newWallets.length);

    const updatedWallets = newWallets.map(wallet => ({
      ...wallet,
      percent: newPercentage
    }));

    setFormData({
      ...formData,
      wallets: updatedWallets
    });
  };

  const calcPercentage = (numWallets = formData.wallets.length + 1): number => {
    return numWallets > 0 ? Number((100 / numWallets).toFixed(2)) : 0;
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
                  onInput={(e) => handleChange(e, 0)}
                />
              </span>
              <span>
                <label>Senha</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onInput={(e) => handleChange(e, 0)}
                />
              </span>
              <span>
                <label>Chave privada</label>
                <input
                  type="password"
                  name="account_private_key"
                  value={formData.account_private_key}
                  onInput={(e) => handleChange(e, 0)}
                />
              </span>
              <span>
                <label>Nome amigavel da chave privada (Opcional)</label>
                <input
                  type="text"
                  name="account_friendly_name"
                  value={formData.account_friendly_name}
                  onInput={(e) => handleChange(e, 0)}
                />
              </span>
              <span>
                <label>Selecione o token</label>
                <select
                  name="token_symbol"
                  value={formData.token_symbol}
                  onChange={(e) => handleChange(e, 0)}
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
                <label>Tempo entre verificações de saldo (Minutos)</label>
                <input
                  type="text"
                  name="delay"
                  value={formData.delay}
                  onInput={(e) => handleChange(e, 0)}
                />
              </span>
              <div style={{ padding: "10px" }}>
                <h2 style={{ display: "flex", alignItems: "center" }}>
                  Carteiras
                  <button className="btn-success" type="button" style={{ marginLeft: "10px" }} onClick={handleAddWallet}>
                    Adicionar Carteira
                  </button>
                </h2>
                {formData?.wallets?.map((wallet, index) => (
                  <div key={index} className="card" style={{ margin: "10px" }}>
                    <h4>{`Carteira ${index + 1}`}</h4>
                    <span>
                      <label>Nome amigavel da carteira</label>
                      <input
                        type="text"
                        name={`name`}
                        value={wallet.name}
                        onInput={(e) => handleChange(e, index + 1)}
                      />
                    </span>
                    <span>
                      <label>Endereço</label>
                      <input
                        type="text"
                        name={`wallet_address`}
                        value={wallet.wallet_address}
                        onInput={(e) => handleChange(e, index + 1)}
                      />
                    </span>
                    <span>
                      <label>Porcentagem</label>
                      <input
                        type="text"
                        name={`percent`}
                        value={wallet.percent}
                        onInput={(e) => handleChange(e, index + 1)}
                      />
                    </span>
                    <button className="btn-danger" type="button" onClick={() => handleRemoveWallet(index)}>Remover Carteira</button>
                  </div>
                ))}
              </div>
              <Separator />
              <BlocoBtn>
                <Link href="/dashboard/distribution-bots/list">
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

export default Listagem;
