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
  const [formData, setFormData] = useState<TradeBotData>({
    id: 0,
    uuid: "",
    name: "",
    helper_private_key: "",
    account_private_key: "",
    destiny_address: "",
    target_price: 0,
    min_amount: 0.1,
    max_amount: 0.3,
    min_delay: 60,
    max_delay: 120,
    target_balance: 0,
    holder_percent: 0,
    airdrop_time: 60,
    token_symbol: "",
    slippage_tolerance: 5,
    delay_to_start: 0,
    cycles: 1,
    cycle_ghosts: 5,
    cycle_delay: 90,
    actual_cycle: 0,
    strategy: "",
    friendly_name: "",
    destiny_friendly_name: "",
    work_start: '00:00',
    work_end: '00:00',
    active: 0,
    is_hidden: 0,
    created_at: "",
    updated_at: "",
    token_name: "",
    token_address: "",
    spent_balance: 0,
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

    if (token) {
      if (isLoading == true && isLoadingTokenList == true) {
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

      if (!formData.helper_private_key) {
        toast.warning("Preencha a chave privada de regaste");
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

      if (!formData.strategy) {
        toast.warning("Selecione a estratégia de automação");
        return;
      }

      if (!formData.target_price) {
        toast.warning("Preencha o preço alvo");
        return;
      }

      setIsLoading(true);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/trade-bot/create`, {
        formData,
        authtoken: token
      });

      setIsLoading(false);

      if (response.data.success) {
        toast.success(response.data.message)
        push("/dashboard/trade-bots/list");
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
                  name="friendly_name"
                  value={formData.friendly_name}
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
                <label>Estratégia da automação</label>
                <select name="strategy" value={formData.strategy} onChange={handleChange}>
                  <option value="">Selecione...</option>
                  <option value="buy">compra</option>
                  <option value="sell">venda</option>
                </select>
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
                <label>Preço alvo</label>
                <input
                  type="text"
                  name="target_price"
                  value={formData.target_price}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label>Limite para utilizar (Matic/Token) (Opcional)</label>
                <input
                  type="text"
                  name="target_balance"
                  value={formData.target_balance}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label>Horário de início</label>
                <input
                  type="time"
                  name="work_start"
                  value={formData.work_start}
                  onChange={handleChange}
                  step="60"
                  lang="pt-BR"
                />
              </span>
              <span>
                <label>Horário de pausa</label>
                <input
                  type="time"
                  name="work_end"
                  value={formData.work_end}
                  onChange={handleChange}
                  step="60"
                  lang="pt-BR"
                />
              </span>
              <h1>Configurações Avançadas</h1>
              <span>
                <label>Valor mínimo de transação</label>
                <input
                  type="number"
                  name="min_amount"
                  value={formData.min_amount}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label>Valor máximo de transação</label>
                <input
                  type="number"
                  name="max_amount"
                  value={formData.max_amount}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label>Tempo Mínimo (seg)</label>
                <input
                  type="number"
                  name="min_delay"
                  value={formData.min_delay}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label>Tempo Máximo (seg)</label>
                <input
                  type="number"
                  name="max_delay"
                  value={formData.max_delay}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label>Holders (%)</label>
                <input
                  type="number"
                  name="holder_percent"
                  value={formData.holder_percent}
                  onChange={handleChange}
                />
              </span>
              <span>
                <label style={{ display: "flex" }}>Ciclos</label>
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
                <label>Airdrop time (min)</label>
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
                <label>Atraso de inicialização (min)</label>
                <input
                  type="number"
                  name="delay_to_start"
                  value={formData.delay_to_start}
                  onChange={handleChange}
                />
              </span>
              <Separator />
              <BlocoBtn>
                <Link href="/dashboard/trade-bots/list">
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
