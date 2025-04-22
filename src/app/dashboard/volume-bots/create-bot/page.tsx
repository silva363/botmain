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

const CreateVolumeBot = () => {
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTokenList, setIsLoadingTokenList] = useState(true);
  const [formData, setFormData] = useState<VolumeBotData>({
    id: 0,
    uuid: "",
    name: "",
    min_amount: 0.1,
    max_amount: 0.3,
    min_delay: 60,
    max_delay: 120,
    sell_swap_times: 2,
    airdrop_time: 60,
    account_private_key_buy: "",
    private_key_buy_friendly_name: "",
    account_private_key_sell: "",
    private_key_sell_friendly_name: "",
    slippage_tolerance: 5,
    delay_to_start: 0,
    token_name: "",
    token_symbol: "",
    token_address: "",
    active: 0
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

    if (token) {
      if (isLoading && isLoadingTokenList) {
        setIsLoadingTokenList(false);
        loadTokenlist();
      }
    }
  }, [isLoading, isLoadingTokenList, formData, tokenList, token]);

  const handleChange = async (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "type" ? value : value || value,
    }));
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    try {
      if (!formData.name) {
        toast.warning("Preencha o nome do bot");
        return;
      }

      if (!formData.account_private_key_buy) {
        toast.warning("Preencha a chave privada de compra");
        return;
      }

      if (!formData.account_private_key_sell) {
        toast.warning("Preencha a chave privada de venda");
        return;
      }

      if (!formData.token_symbol) {
        toast.warning("Selecione o símbolo do token");
        return;
      }

      setIsLoading(true);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/volume-bot/create`, {
        formData,
        authtoken: token
      });

      setIsLoading(false);
      console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message)
        push("/dashboard/volume-bots/list");
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
                <label>Chave privada de compra</label>
                <input
                  type="password"
                  name="account_private_key_buy"
                  value={formData.account_private_key_buy}
                  onInput={handleChange}
                />
              </span>
              <span>
                <label>Nome amigavel da chave privada de venda (Opcional)</label>
                <input
                  type="text"
                  name="private_key_buy_friendly_name"
                  value={formData.private_key_buy_friendly_name}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label>Chave privada de venda</label>
                <input
                  type="password"
                  name="account_private_key_sell"
                  value={formData.account_private_key_sell}
                  onInput={handleChange}
                />
              </span>
              <span>
                <label>Nome amigavel da chave privada de venda (Opcional)</label>
                <input
                  type="text"
                  name="private_key_sell_friendly_name"
                  value={formData.private_key_sell_friendly_name}
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
                <label>Valor mínimo de transação (MATIC)</label>
                <input
                  type="number"
                  name="min_amount"
                  value={formData.min_amount}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label>Valor máximo de transação (MATIC)</label>
                <input
                  type="number"
                  name="max_amount"
                  value={formData.max_amount}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label>Quantidade de vendas por fluxo</label>
                <input
                  type="number"
                  name="sell_swap_times"
                  value={formData.sell_swap_times}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label>Tempo mínimo entre fluxos (seg)</label>
                <input
                  type="number"
                  name="min_delay"
                  value={formData.min_delay}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label>Tempo máximo entre fluxos (seg)</label>
                <input
                  type="number"
                  name="max_delay"
                  value={formData.max_delay}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label>Atrasdo ao enviar tokens de venda para a carteira de compra (min)</label>
                <input
                  type="number"
                  name="airdrop_time"
                  value={formData.airdrop_time}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label>Taxa de derrapagem</label>
                <input
                  type="number"
                  name="slippage_tolerance"
                  value={formData.slippage_tolerance}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label>Atraso de inicialização ao clicar em executar (min)</label>
                <input
                  type="number"
                  name="delay_to_start"
                  value={formData.delay_to_start}
                  onChange={handleChange}
                />
              </span>
              <Separator />
              <BlocoBtn>
                <Link href="/dashboard/volume-bots/list">
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

export default CreateVolumeBot;
