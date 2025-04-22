/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Navbar from "@/components/navbar/navbar";
import {
  BlocoBtn,
  Form,
  ModalEdit,
  ModalPassword,
  TBody,
  THeader,
  Table,
  Td,
  Th,
  Tr,
} from "./styles";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaRegEdit, FaChartBar, FaRobot, FaEyeSlash, FaArrowUp, FaArrowDown } from "react-icons/fa";
import Link from "next/link";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation'
import { useGlobalContext } from "@/components/store/authContext";
import Toggle from 'react-toggle'
import Loader from "@/components/loader/loader";

export default function Home() {
  const [listBot, setListBot] = useState<DistributionBotData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBotList, setIsLoadingBotList] = useState(true);
  const [isLoadingTokenList, setIsLoadingTokenList] = useState(true);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isChangeBotStatus, setIsChangeBotStatus] = useState(false);
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [showEditModal, setShowEditModal] = useState<any>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<any>(false);
  const [botUuid, setBotUuid] = useState('');
  const [botActive, setBotActive] = useState(0);
  const [changePassword, setChangePassword] = useState(false);
  const [showWallets, setShowWallets] = useState(false);
  const [editBotData, setEditBotData] = useState<DistributionBotData>({
    id: 0,
    name: "",
    account_private_key: "",
    account_friendly_name: "",
    password: "",
    new_password: "",
    new_password_confirm: "",
    delay: 5,
    token_symbol: "",
    wallets: [],
    active: 0,
    executions: 0,
    transactions: 0
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

        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/distribution-bot/list`, { authtoken: token });

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
    token
  ]);

  const handleChange = async (uuid: string, active: number) => {
    setBotUuid(uuid);
    setBotActive(active);
    setShowPasswordModal(true);
  };

  const handleEditChange = async (e: any, index: number = 0) => {
    const { name, value } = e.target;

    if (index == 0) {
      setEditBotData((prevData) => ({
        ...prevData,
        [name]: name === "type" ? value : value || value,
      }));
    } else {
      index = index - 1;

      setEditBotData((prevData) => ({
        ...prevData,
        wallets: prevData.wallets.map((wallet, i) =>
          i === index ? { ...wallet, [name]: value } : wallet
        )
      }));
    }
  };

  const runBot = async () => {
    try {
      if (!editBotData.password || editBotData.password.length < 8) {
        toast.warning("A senha precisa ter ao menos 8 caracteres");
        return;
      }

      setShowPasswordModal(false);

      let endpoint = "play";

      if (botActive) {
        endpoint = "stop";
      }

      if (endpoint == "") {
        return;
      }

      setIsLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/distribution-bot/run`,
        {
          uuid: botUuid,
          endpoint,
          password: editBotData.password,
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

      if (!editBotData.name) {
        toast.warning("Preencha o nome do bot");
        return;
      }

      if (!editBotData.password) {
        toast.warning("Preencha uma senha");
        return;
      }

      if (editBotData.wallets.length == 0) {
        toast.warning("Preencha a carteira de destino");
        return;
      }

      if (!editBotData.token_symbol) {
        toast.warning("Selecione o símbolo do token");
        return;
      }

      if (!editBotData.delay) {
        toast.warning("Preencha o tempo entre verificações");
        return;
      }

      if (!/^[0-9]+$/.test(editBotData.delay.toString())) {
        toast.warning("O tempo entre verificações deve conter apenas números");
        return;
      }

      if (!editBotData.password || editBotData.password.length < 8) {
        toast.warning("A senha precisa ter ao menos 8 caracteres");
        return;
      }

      if (editBotData.new_password) {
        if (editBotData.new_password.length < 8) {
          toast.warning("A nova senha precisa ter ao menos 8 caracteres");
          return;
        }

        if (editBotData.new_password != editBotData.new_password_confirm) {
          toast.warning("A nova senha precisa ser igual a confirmação de nova senha");
          return;
        }
      }

      setIsLoadingEdit(true);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/distribution-bot/edit`, { editBotData, authtoken: token });

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
    setChangePassword(false);
    setShowWallets(false);
  };

  const handlePasswordChange = async (e: any) => {
    const { name, value } = e.target;
    setEditBotData((prevData: any) => ({
      ...prevData,
      [name]: name === "type" ? value : value || value,
    }));
  };

  const pageExecutions = (uuid: string, name: string, wallets: number) => {
    push(`/dashboard/distribution-bots/executions?uuid=${uuid}&name=${name}&wallets=${wallets}`);
  };

  const handleHide = async (uuid: string) => {
    try {
      if (!confirm("Você tem certeza que deseja ocultar este bot?")) {
        return;
      }

      setIsLoadingEdit(true);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/distribution-bot/hide-unhide`, { uuid, authtoken: token });

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

  const handleAddWallet = () => {
    const newWallets = [
      ...editBotData.wallets,
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

    setEditBotData({
      ...editBotData,
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

    const newWallets = editBotData.wallets.filter((_, index) => index !== indexToRemove);
    const newPercentage = calcPercentage(newWallets.length);

    const updatedWallets = newWallets.map(wallet => ({
      ...wallet,
      percent: newPercentage
    }));

    setEditBotData({
      ...editBotData,
      wallets: updatedWallets
    });
  };

  const calcPercentage = (numWallets = editBotData.wallets.length + 1): number => {
    return numWallets > 0 ? Number((100 / numWallets).toFixed(2)) : 0;
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
              <h2>Bots de Distribuição</h2>
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
                <Th style={{ maxWidth: "140px", textAlign: "center" }}>Execução</Th>
                <Th style={{ maxWidth: "120px" }}>Token</Th>
                <Th style={{ maxWidth: "120px" }}>Carteiras</Th>
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
                    <Td>
                      {bot.name}
                      <br />
                      {bot.account_friendly_name}
                    </Td>
                    <Td style={{ maxWidth: "140px", textAlign: "center" }}>
                      <Toggle
                        id='biscuit-status'
                        icons={{
                          checked: <FaRobot />,
                          unchecked: null,
                        }}
                        defaultChecked={bot.active === 1}
                        onClick={() => handleChange(bot.uuid!, bot.active)}
                      />
                    </Td>
                    <Td style={{ maxWidth: "120px" }}>{bot.token_symbol}</Td>
                    <Td style={{ maxWidth: "120px" }}>{bot.wallets.length}</Td>
                    <Td style={{ maxWidth: "120px" }}>
                      {bot.executions}
                    </Td>
                    <Td style={{ maxWidth: "120px" }}>
                      {bot.transactions}
                    </Td>
                    <Td style={{ maxWidth: "80px" }}>
                      <FaChartBar
                        size={15}
                        onClick={() => pageExecutions(bot.uuid, bot.name, bot.wallets.length)}
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
                        onClick={() => handleHide(bot.uuid!)}
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
                      onChange={handleEditChange}
                      value={editBotData.name}
                    />
                  </span>
                  <span>
                    <label>Chave privada</label>
                    <input
                      type="password"
                      name="account_private_key"
                      onChange={handleEditChange}
                      placeholder="Fill to change value"
                    />
                  </span>
                  <span>
                    <label>Nome amigavel da chave privada (Opcional)</label>
                    <input
                      type="text"
                      name="account_friendly_name"
                      onChange={handleEditChange}
                      placeholder="You can add a account friendly name"
                      value={editBotData?.account_friendly_name}
                    />
                  </span>
                  <span>
                    <label>Selecione o token</label>
                    <select
                      name="token_symbol"
                      value={editBotData.token_symbol}
                      onChange={handleEditChange}
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
                    <label>Tempo entre verificações de saldo (Minutos)</label>
                    <input
                      type="number"
                      name="delay"
                      value={editBotData.delay}
                      onChange={handleEditChange}
                    />
                  </span>
                  <span>
                    <label>Senha atual</label>
                    <input
                      type="password"
                      name="password"
                      onChange={handleEditChange}
                      placeholder="Password"
                    />
                  </span>

                  <span className="configAdvanced">
                    <h1>Alterar senha atual</h1>
                    <button type="button" onClick={() => setChangePassword(!changePassword)}>
                      {changePassword ? <FaArrowUp size={16} /> : <FaArrowDown size={16} />}
                    </button>
                  </span>

                  {changePassword && (
                    <>
                      <span>
                        <label>Nova senha</label>
                        <input
                          type="password"
                          name="new_password"
                          onChange={handleEditChange}
                          placeholder="New password"
                        />
                      </span>
                      <span>
                        <label>Confirmar nova senha</label>
                        <input
                          type="password"
                          name="new_password_confirm"
                          onChange={handleEditChange}
                          placeholder="Confirm new password"
                        />
                      </span>
                    </>
                  )}

                  <span className="configAdvanced">
                    <h1>Exibir carteiras</h1>
                    <button type="button" onClick={() => setShowWallets(!showWallets)}>
                      {showWallets ? <FaArrowUp size={16} /> : <FaArrowDown size={16} />}
                    </button>
                  </span>

                  {showWallets && (
                    <>
                      <div style={{ padding: "10px" }}>
                        <h2 style={{ display: "flex", alignItems: "center" }}>
                          Carteiras
                          <button className="btn-success" type="button" style={{ marginLeft: "10px" }} onClick={handleAddWallet}>
                            Adicionar Carteira
                          </button>
                        </h2>
                        {editBotData?.wallets?.map((wallet, index) => (
                          <div key={index} className="card" style={{ margin: "10px" }}>
                            <h4>{`Carteira ${index + 1}`}</h4>
                            <span>
                              <label>Nome amigavel da carteira</label>
                              <input
                                type="text"
                                name={`name`}
                                value={wallet.name}
                                onInput={(e) => handleEditChange(e, index + 1)}
                              />
                            </span>
                            <span>
                              <label>Endereço</label>
                              <input
                                type="text"
                                name={`wallet_address`}
                                value={wallet.wallet_address}
                                onInput={(e) => handleEditChange(e, index + 1)}
                              />
                            </span>
                            <span>
                              <label>Porcentagem</label>
                              <input
                                type="text"
                                name={`percent`}
                                value={wallet.percent}
                                onInput={(e) => handleEditChange(e, index + 1)}
                              />
                            </span>
                            <button className="btn-danger" type="button" onClick={() => handleRemoveWallet(index)}>Remover Carteira</button>
                          </div>
                        ))}
                      </div>
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

          {showPasswordModal && (
            <ModalPassword>
              <ul>
                <Form onSubmit={handleSave}>
                  <span>
                    <label>Informe sua senha</label>
                    <input
                      type="password"
                      name="password"
                      onChange={handlePasswordChange}
                      placeholder="Senha"
                    />
                  </span>
                  <BlocoBtn>
                    <Link href="#">
                      <button type="button" onClick={() => setShowPasswordModal(false)}>Fechar</button>
                    </Link>
                    <button type="button" onClick={runBot}>Confirmar</button>
                  </BlocoBtn>
                </Form>
              </ul>
            </ModalPassword>
          )}
        </>
      )}
    </>
  );
}
