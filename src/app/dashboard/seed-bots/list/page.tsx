/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Navbar from "@/components/navbar/navbar";
import {
  BlocoBtn,
  Form,
  ModalEdit,
  TBody,
  THeader,
  Table,
  Td,
  Th,
  Tr,
} from "./styles";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaRegEdit, FaChartBar, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import { getGasFeePrices, getMinifiedAddress } from "@/app/utils/data";
import { useRouter } from 'next/navigation';
import { useGlobalContext } from "@/components/store/authContext";
import Loader from "@/components/loader/loader";
import { ethers } from "ethers";

export default function Home() {
  const [listBot, setListBot] = useState<SeedBotData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBotList, setIsLoadingBotList] = useState(true);
  const [isLoadingTokenList, setIsLoadingTokenList] = useState(true);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isChangeBotStatus, setIsChangeBotStatus] = useState(false);
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [showEditModal, setShowEditModal] = useState<any>(false);
  const [isLoadingEstimatedGas, setIsLoadingEstimatedGas] = useState(true);
  const [actualGasPrice, setActualGasPrice] = useState(BigInt(0));
  const [editBotData, setEditBotData] = useState<SeedBotData | any>({
    name: "",
    account_private_key: "",
    account_friendly_name: "",
    destiny_address: "",
    destiny_friendly_name: "",
    amount: 10,
    cycles: 10,
    cycle_ghosts: 15,
    cycle_delay: 180,
    airdrop_time: 60,
    token_symbol: ""
  });
  const { token } = useGlobalContext();
  const { push } = useRouter();

  useEffect(() => {
    async function loadBotList() {
      try {
        setIsChangeBotStatus(false);

        if (isChangeBotStatus) {
          setIsLoading(true);
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/seed-bot/list`, { authtoken: token });

        if (response.data.success) {
          if (isChangeBotStatus) {
            setListBot([]);
            setTimeout(() => {
              setListBot(response.data.data);
              setIsLoading(false);
            }, 300);

          } else {
            setListBot(response.data.data);
          }
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
    }

    async function loadTokenlist() {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/acceptedTokens/list`, { authtoken: token });

        setTokenList(response.data.data);
      } catch (error: any) {
        setIsLoading(false);
        toast.error(error.message);
      }
    };

    async function loadEstimatedGas() {
      try {
        const gasFee = await getGasFeePrices();
        setActualGasPrice(gasFee.gasPrice);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    if (token) {
      if ((isLoading && isLoadingBotList) || isChangeBotStatus) {
        setIsLoadingBotList(false);
        loadBotList();
      }

      if (isLoading && isLoadingTokenList) {
        setIsLoadingTokenList(false);
        loadTokenlist();
      }

      if (isLoading && isLoadingEstimatedGas) {
        setIsLoadingEstimatedGas(false);
        loadEstimatedGas();
      }

      if (isLoading && tokenList.length > 0 && !isLoadingBotList && actualGasPrice > 0) {
        setIsLoading(false);
      }
    }
  }, [
    listBot,
    tokenList,
    isLoading,
    isLoadingBotList,
    isChangeBotStatus,
    isLoadingTokenList,
    editBotData,
    actualGasPrice,
    isLoadingEstimatedGas,
    token
  ]);

  const handleChange = async (uuid: string) => {
    try {
      if (!confirm("Você realmente deseja ativar este bot?")) {
        return;
      }

      setIsLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/seed-bot/run`,
        {
          uuid,
          authtoken: token
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setIsChangeBotStatus(true);
      } else {
        if (response.data.message) {
          toast.error(response.data.message);
        } else {
          toast.error(response.data);
        }

        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const handleSave = async (e: any) => {
    try {
      e.preventDefault();
      setIsLoadingEdit(true);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/seed-bot/edit`, { editBotData, authtoken: token });

      setIsLoadingEdit(false);

      if (response.data.success) {
        toast.success(response.data.message);
        handleCloseEditClick();
        setIsChangeBotStatus(true);
      } else {
        if (response.data.message) {
          toast.error(response.data.message);
        } else {
          toast.error(response.data);
        }
      }
    } catch (error: any) {
      setIsLoadingEdit(false);
      toast.error(error.message);
    }
  };

  const handleEditClick = (bot: any) => {
    setEditBotData(bot);
    setShowEditModal(true);
  };

  const handleCloseEditClick = () => {
    setShowEditModal(false);
  };

  const handleEdit = async (e: any) => {
    const { name, value } = e.target;
    setEditBotData((prevData: any) => ({
      ...prevData,
      [name]: name === "type" ? value : value || value,
    }));
  };

  const pageExecutions = (uuid: string, name: string, cycles: number, cycleGhosts: number) => {
    push(`/dashboard/seed-bots/executions?uuid=${uuid}&name=${name}&cycles=${cycles}&cycle_ghosts=${cycleGhosts}`);
  };

  const handleHide = async (uuid: string) => {
    try {
      if (!confirm("Você tem certeza que deseja ocultar este bot?")) {
        return;
      }

      setIsLoadingEdit(true);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/seed-bot/hide-unhide`, { uuid, authtoken: token });

      setIsLoadingEdit(false);

      if (response.data.success) {
        toast.success(response.data.message);
        setIsChangeBotStatus(true);
      } else {
        if (response.data.message) {
          toast.error(response.data.message);
        } else {
          toast.error(response.data);
        }
      }
    } catch (error: any) {
      setIsLoadingEdit(false);
      toast.error(error.message);
    }
  };

  const calcTotalGasPrice = (cycles: number, cycleGhosts: number): string => {
    const maticTaxNeed = actualGasPrice * BigInt(30000) * BigInt(cycles * cycleGhosts * 10);
    const gas = ethers.formatEther(maticTaxNeed);
    return gas;
  };

  return (
    <>
      <Navbar />
      {isLoading || isLoadingEdit ? (
        <Loader></Loader>
      ) : (
        <>
          <div className="header-container">
            <div className="header-title">
              <h2>Bots de Alimentação</h2>
            </div>
          </div>

          <div className="table-container">
            <Table>
              <THeader>
                <Th>
                  Nome do bot
                  <br />
                  Nome amigável
                </Th>
                <Th>
                  Carteira de Destino
                  <br />
                  Nome amigável
                </Th>
                <Th style={{ maxWidth: "140px" }}>Token</Th>
                <Th style={{ maxWidth: "140px" }}>Quant. Tokens</Th>
                <Th style={{ maxWidth: "200px" }}>
                  Ghosts por Ciclo
                  <br></br>
                  Taxa de Execução
                </Th>
                <Th style={{ maxWidth: "120px" }}>
                  C. Atual/Total
                  <br></br>
                  Execuções
                </Th>
                <Th style={{ maxWidth: "120px" }}>
                  Transações
                </Th>
                <Th style={{ maxWidth: "120px" }}>Ações</Th>
                <Th style={{ maxWidth: "140px", textAlign: "center" }}>Execução</Th>
              </THeader>
              <TBody>
                {listBot?.map((bot) => (
                  <Tr key={bot.id}>
                    <Td>
                      {bot.name}
                      <br />
                      {bot.account_friendly_name}
                    </Td>
                    <Td>
                      {getMinifiedAddress(bot.destiny_address)}
                      <br />
                      {bot.destiny_friendly_name}
                    </Td>
                    <Td style={{ maxWidth: "140px" }}>{bot.token_symbol}</Td>
                    <Td style={{ maxWidth: "140px" }}>  {bot.amount}</Td>
                    <Td style={{ maxWidth: "200px" }}>
                      {bot.cycle_ghosts}
                      <br />
                      <span style={{ color: "red" }}>
                        <b>{calcTotalGasPrice(bot.cycles, bot.cycle_ghosts)} Matics</b>
                      </span>
                    </Td>
                    <Td style={{ maxWidth: "120px" }}>
                      {bot.actual_cycle}/{bot.cycles}
                      <br></br>
                      {bot.executions}
                    </Td>
                    <Td style={{ maxWidth: "120px" }}>
                      {bot.transactions}
                    </Td>
                    <Td style={{ maxWidth: "120px" }}>
                      <FaChartBar
                        size={15}
                        onClick={() => pageExecutions(bot.uuid, bot.name, bot.cycles, bot.cycle_ghosts)}
                        className="icon"
                        style={{ margin: "4px" }}
                      />
                      <FaRegEdit
                        size={15}
                        onClick={() => handleEditClick(bot)}
                        className="icon"
                        style={{ margin: "4px" }}
                      />
                      <FaEyeSlash
                        size={15}
                        onClick={() => handleHide(bot.uuid)}
                        className="icon"
                        style={{ margin: "4px" }}
                      />
                    </Td>
                    <Td style={{ maxWidth: "140px", textAlign: "center" }}>
                      <div style={{ minHeight: "40px", height: "100%", marginTop: "-10px", textTransform: "uppercase", letterSpacing: "1px", backgroundColor: "yellow", borderRadius: "6px", display: "flex" }}>
                        {bot.active == 1 ? (
                          <div style={{ marginTop: '10px', marginLeft: 'auto', marginRight: 'auto' }}>
                            <b>Executando</b>
                          </div>
                        ) : (
                          <button
                            style={{ backgroundColor: "black", color: "whitesmoke", width: "100%", height: "100%", border: "none", borderRadius: "6px", textTransform: "uppercase", letterSpacing: "2px" }}
                            onClick={() => handleChange(bot.uuid)}
                          >
                            <b>Alimentar</b>
                          </button>
                        )}
                      </div>

                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </div>

          <div className="container">
            <Link href="create-bot" >
              <button className="floating-button">+</button>
            </Link>
          </div>

          {showEditModal && editBotData && (
            <ModalEdit>
              <IoIosCloseCircleOutline
                size={35}
                onClick={() => setShowEditModal(false)}
              />
              <ul>
                <Form onSubmit={handleSave}>
                  <span>
                    <label>Nome do Bot</label>
                    <input
                      type="text"
                      name="name"
                      onChange={handleEdit}
                      value={editBotData.name}
                    />
                  </span>
                  <span>
                    <label>Chave privada</label>
                    <input
                      type="password"
                      name="account_private_key"
                      onChange={handleEdit}
                      placeholder="Fill to change value"
                    />
                  </span>
                  <span>
                    <label>Nome amigavel da chave privada (Opcional)</label>
                    <input
                      type="text"
                      name="account_friendly_name"
                      onChange={handleEdit}
                      placeholder="You can add a friendly name"
                      value={editBotData?.account_friendly_name}
                    />
                  </span>
                  <span>
                    <label>Carteira de destino</label>
                    <input
                      type="text"
                      name="destiny_address"
                      onChange={handleEdit}
                      value={editBotData.destiny_address}
                    />
                  </span>
                  <span>
                    <label>Nome amigavel da carteira de destino (Opcional)</label>
                    <input
                      type="text"
                      name="destiny_friendly_name"
                      onChange={handleEdit}
                      placeholder="You can add a friendly name"
                      value={editBotData?.destiny_friendly_name}
                    />
                  </span>
                  <span>
                    <label>Selecione o token</label>
                    <select
                      name="token_symbol"
                      value={editBotData.token_symbol}
                      onChange={handleEdit}
                    >
                      <option value="">Selecione</option>
                      {tokenList && tokenList?.length > 0
                        ? tokenList.map((token: any) => (
                          <option key={token.id} value={token.symbol}>
                            {token.name}
                          </option>
                        ))
                        : ""}
                    </select>
                  </span>
                  <span>
                    <label>Quantidade de tokens</label>
                    <input
                      type="number"
                      name="amount"
                      value={editBotData.amount}
                      onChange={handleEdit}
                    />
                  </span>
                  <span>
                    <label>Ciclos</label>
                    <input
                      type="number"
                      name="cycles"
                      value={editBotData.cycles}
                      onChange={handleEdit}
                    />
                  </span>
                  <span>
                    <label>Ghosts por ciclo</label>
                    <input
                      type="number"
                      name="cycle_ghosts"
                      value={editBotData.cycle_ghosts}
                      onChange={handleEdit}
                    />
                  </span>
                  <span>
                    <label>Atraso entre ciclos (segundos)</label>
                    <input
                      type="number"
                      name="cycle_delay"
                      value={editBotData.cycle_delay}
                      onChange={handleEdit}
                    />
                  </span>
                  <span>
                    <label>Airdrop time (minutos)</label>
                    <input
                      type="number"
                      name="airdrop_time"
                      value={editBotData.airdrop_time}
                      onChange={handleEdit}
                    />
                  </span>
                  <BlocoBtn>
                    <Link href="#">
                      <button type="button" onClick={handleCloseEditClick}>Fechar</button>
                    </Link>
                    <button type="submit">Salvar</button>
                  </BlocoBtn>
                </Form>
              </ul>
            </ModalEdit>
          )}
        </>
      )}
    </>
  );
}
