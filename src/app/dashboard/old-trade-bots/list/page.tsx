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
import { FaRegEdit, FaChartBar, FaArrowUp, FaRobot, FaArrowDown, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import { convertStringToNumber, getMinifiedAddress } from "@/app/utils/data";
import { useRouter } from 'next/navigation'
import { useGlobalContext } from "@/components/store/authContext";
import Toggle from 'react-toggle'
import Loader from "@/components/loader/loader";

export default function Home() {
  const [listBot, setListBot] = useState<ListBotData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBotList, setIsLoadingBotList] = useState(true);
  const [isLoadingTokenList, setIsLoadingTokenList] = useState(true);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isChangeBotStatus, setIsChangeBotStatus] = useState(false);
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [configAdvanced, setConfigAdvanced] = useState(false);
  const [showEditModal, setShowEditModal] = useState<any>(false);
  const [botType, setBotType] = useState('');
  const [editBotData, setEditBotData] = useState<ListBotData | any>({
    name: "",
    account_private_key: "",
    destiny_address: "",
    target_price: 1,
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
    type: "",
    friendly_name: ""
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

        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/old-trade-bot/list`, { authtoken: token, type: botType });

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

    if (token) {
      if ((isLoading && isLoadingBotList) || isChangeBotStatus) {
        setIsLoadingBotList(false);
        loadBotList();
      }

      if (isLoading && isLoadingTokenList) {
        setIsLoadingTokenList(false);
        loadTokenlist();
      }

      if (isLoading && tokenList.length > 0 && !isLoadingBotList) {
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
    botType,
    token
  ]);

  const handleChange = async (uuid: string, active: number, type: string) => {
    try {
      let endpoint = "";

      if (type == "buy") {
        endpoint = "play-buy";

        if (active) {
          endpoint = "stop-buy";
        } else {
          /*
         if (!confirm("Você realmente deseja ativar este bot?")) {
           return;
         }
         */
        }
      } else if (type == "sell") {
        endpoint = "play-sell";

        if (active) {
          endpoint = "stop-sell";
        } else {
          /*
          if (!confirm("Você realmente deseja ativar este bot?")) {
            return;
          }
          */
        }
      }

      if (endpoint == "") {
        return;
      }

      setIsLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/old-trade-bot/run`,
        {
          uuid,
          endpoint,
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

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/old-trade-bot/edit`, { editBotData, authtoken: token });

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
    setConfigAdvanced(false);
  };

  const handleEdit = async (e: any) => {
    const { name, value } = e.target;
    setEditBotData((prevData: any) => ({
      ...prevData,
      [name]: name === "type" ? value : value || value,
    }));
  };

  const pageExecutions = (uuid: string, botType: string, botName: string) => {
    push(`/dashboard/old-trade-bots/executions?uuid=${uuid}&type=${botType}&name=${botName}`);
  };

  const handleHide = async (uuid: string) => {
    try {
      if (!confirm("Você tem certeza que deseja ocultar este bot?")) {
        return;
      }

      setIsLoadingEdit(true);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/old-trade-bot/hide-unhide`, { uuid, authtoken: token });

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

  return (
    <>
      <Navbar />
      {isLoading || isLoadingEdit ? (
        <Loader></Loader>
      ) : (
        <>
          <div className="header-container">
            <div className="header-title">
              <h2>Bots de Compra e Venda</h2>
            </div>
            <div className="header-options">
              <p>Selecione a estratégia</p>
              <div className="select-wrapper">
                <select value={botType} onChange={(e) => {
                  setBotType(e.target.value);
                  setIsChangeBotStatus(true);
                }}>
                  <option value="">Todas</option>
                  <option value="buy">Compra</option>
                  <option value="sell">Venda</option>
                </select>
              </div>
            </div>
          </div>

          <div className="table-container">
            <Table>
              <THeader>
                <Th style={{ maxWidth: "120px" }}>Estratégia</Th>
                <Th>
                  Nome do bot
                  <br />
                  Nome amigável
                </Th>
                <Th style={{ maxWidth: "140px", textAlign: "center" }}>Execução</Th>
                <Th>
                  Cart. de Dest.
                  <br />
                  Nome amig.
                </Th>
                <Th style={{ maxWidth: "120px" }}>Preço Alvo</Th>
                <Th>
                  Valor Mínimo
                  <br />
                  Valor Máximo
                </Th>
                <Th>
                  T. Mínimo
                  <br />
                  T. Máximo
                  <br />
                  Atraso Ini.
                </Th>
                <Th>
                  Utilizado
                  <br />
                  Limite
                </Th>
                <Th style={{ maxWidth: "120px" }}>Holder</Th>
                <Th style={{ maxWidth: "120px" }}>
                  Execuções
                </Th>
                <Th style={{ maxWidth: "120px" }}>
                  Transações
                </Th>
                <Th style={{ maxWidth: "80px" }}>Ações</Th>
              </THeader>
              <TBody>
                {listBot?.map((bot) => (
                  <Tr key={bot.id}>
                    <Td style={{ maxWidth: "120px" }}>
                      {bot.type === "buy" ? "Compra" : "Venda"}
                    </Td>
                    <Td>
                      {bot.name}
                      <br />
                      {bot.friendly_name}
                    </Td>
                    <Td style={{ maxWidth: "140px", textAlign: "center" }}>
                      <Toggle
                        id='biscuit-status'
                        icons={{
                          checked: <FaRobot />,
                          unchecked: null,
                        }}
                        defaultChecked={bot.active === 1}
                        onChange={() => handleChange(bot.uuid, bot.active, bot.type)}
                      />
                    </Td>
                    <Td>
                      {getMinifiedAddress(bot.destiny_address)}
                      <br />
                      {bot.destiny_friendly_name}
                    </Td>
                    <Td style={{ maxWidth: "120px" }}>{bot.target_price}</Td>
                    <Td>
                      {bot.min_amount}
                      <br />
                      {bot.max_amount}
                    </Td>
                    <Td>
                      {bot.min_delay} segundos
                      <br />
                      {bot.max_delay} segundos
                      <br />
                      {bot.delay_to_start} minutos
                    </Td>
                    <Td>
                      {bot.spent_balance}
                      <br />
                      {bot.target_balance}
                    </Td>
                    <Td style={{ maxWidth: "120px" }}>{bot.holder_percent.toFixed(2)}%</Td>
                    <Td style={{ maxWidth: "120px" }}>
                      {bot.executions}
                    </Td>
                    <Td style={{ maxWidth: "120px" }}>
                      {bot.transactions}
                    </Td>
                    <Td style={{ maxWidth: "80px" }}>
                      <FaChartBar
                        size={15}
                        onClick={() => pageExecutions(bot.uuid, bot.type, bot.name)}
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
                      name="friendly_name"
                      onChange={handleEdit}
                      placeholder="You can add a friendly name"
                      value={editBotData?.friendly_name}
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
                    <label>Preço alvo</label>
                    <input
                      type="number"
                      name="target_price"
                      value={convertStringToNumber(editBotData.target_price)}
                      onChange={handleEdit}
                    />
                  </span>
                  <span>
                    <label>Limite para utilizar (Matic/Token) (Opcional)</label>
                    <input
                      type="number"
                      name="target_balance"
                      value={editBotData.target_balance}
                      onChange={handleEdit}
                    />
                  </span>
                  <span className="configAdvanced">
                    <h1>Configurações Avançadas</h1>
                    <button type="button" onClick={() => setConfigAdvanced(!configAdvanced)}>
                      {configAdvanced ? <FaArrowUp size={16} /> : <FaArrowDown size={16} />}
                    </button>
                  </span>
                  {configAdvanced && (
                    <>
                      <span>
                        <label>Valor mínimo de transação</label>
                        <input
                          type="number"
                          name="min_amount"
                          value={editBotData.min_amount}
                          onChange={handleEdit}
                        />
                      </span>
                      <span>
                        <label>Valor máximo de transação</label>
                        <input
                          type="number"
                          name="max_amount"
                          value={editBotData.max_amount}
                          onChange={handleEdit}
                        />
                      </span>
                      <span>
                        <label>Tempo Mínimo (seg)</label>
                        <input
                          type="number"
                          name="min_delay"
                          value={editBotData.min_delay}
                          onChange={handleEdit}
                        />
                      </span>
                      <span>
                        <label>Tempo Máximo (seg)</label>
                        <input
                          type="number"
                          name="max_delay"
                          value={editBotData.max_delay}
                          onChange={handleEdit}
                        />
                      </span>
                      <span>
                        <label>Holders (%)</label>
                        <input
                          type="number"
                          name="holder_percent"
                          value={editBotData.holder_percent}
                          onChange={handleEdit}
                        />
                      </span>
                      <span>
                        <label>Airdrop time (min)</label>
                        <input
                          type="number"
                          name="airdrop_time"
                          value={editBotData.airdrop_time}
                          onChange={handleEdit}
                        />
                      </span>
                      <span>
                        <label>Taxa de derrapagem</label>
                        <input
                          type="number"
                          name="slippage_tolerance"
                          value={editBotData.slippage_tolerance}
                          onChange={handleEdit}
                        />
                      </span>
                      <span>
                        <label>Atraso de inicialização (min)</label>
                        <input
                          type="number"
                          name="delay_to_start"
                          value={editBotData.delay_to_start}
                          onChange={handleEdit}
                        />
                      </span>
                    </>
                  )}
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
