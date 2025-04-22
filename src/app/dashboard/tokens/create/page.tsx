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

const CreateSeedBot = () => {
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Token>({
    id: 0,
    name: "",
    symbol: "",
    address: "",
    decimals: 18,
    pool_name: "",
    pool_symbol: "",
    pool_address: "",
    pool_decimals: 18,
    active: 0,
    created_at: "",
    updated_at: "",
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
      if (isLoading) {
        loadTokenlist();
      }
    }
  }, [isLoading, formData, tokenList, token]);

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
        toast.warning("Preencha o nome do token");
        return;
      }

      if (!formData.symbol) {
        toast.warning("Preencha symbol do token");
        return;
      }

      if (!formData.address) {
        toast.warning("Preencha o endereço do token");
        return;
      }

      if (!formData.decimals) {
        toast.warning("Preencha os decimais do token");
        return;
      }

      if (!formData.pool_name) {
        toast.warning("Preencha o nome da pool do token");
        return;
      }

      if (!formData.pool_symbol) {
        toast.warning("Preencha symbol da pool do token");
        return;
      }

      if (!formData.pool_address) {
        toast.warning("Preencha o endereço da pool do token");
        return;
      }

      if (!formData.pool_decimals) {
        toast.warning("Preencha os decimais da pool do token");
        return;
      }

      setIsLoading(true);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/acceptedTokens/create`, {
        formData,
        authtoken: token
      });

      setIsLoading(false);
      console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message)
        push("/dashboard/tokens/list");
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
                <label>Nome do Token</label>
                <input
                  type="text"
                  name="name"
                  onInput={handleChange}
                  value={formData.name}
                />
              </span>
              <span>
                <label>Symbol</label>
                <input
                  type="text"
                  name="symbol"
                  onInput={handleChange}
                  value={formData.symbol}
                />
              </span>
              <span>
                <label>Endereço</label>
                <input
                  type="text"
                  name="address"
                  onInput={handleChange}
                  value={formData.address}
                />
              </span>
              <span>
                <label>Quantidade de decimais</label>
                <input
                  type="number"
                  name="decimals"
                  onInput={handleChange}
                  value={formData.decimals}
                />
              </span>

              <span>
                <label>Nome da pool do Token</label>
                <input
                  type="text"
                  name="pool_name"
                  onInput={handleChange}
                  value={formData.pool_name}
                />
              </span>
              <span>
                <label>Symbol da pool</label>
                <input
                  type="text"
                  name="pool_symbol"
                  onInput={handleChange}
                  value={formData.pool_symbol}
                />
              </span>
              <span>
                <label>Endereço da pool</label>
                <input
                  type="text"
                  name="pool_address"
                  onInput={handleChange}
                  value={formData.pool_address}
                />
              </span>
              <span>
                <label>Quantidade de decimais da pool</label>
                <input
                  type="number"
                  name="pool_decimals"
                  onInput={handleChange}
                  value={formData.pool_decimals}
                />
              </span>

              <Separator />
              <BlocoBtn>
                <Link href="/dashboard/tokens/list">
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
