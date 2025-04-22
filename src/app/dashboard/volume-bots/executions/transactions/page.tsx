/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Navbar from "@/components/navbar/navbar";
import {
  DivBot,
  DivTransactions
} from "./styles";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Pagination from "react-bootstrap/Pagination";
import Accordion from "react-bootstrap/Accordion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useGlobalContext } from "@/components/store/authContext";
import Loader from "@/components/loader/loader";

export default function Transactions() {
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [reponseTransactions, setResponseTransactions] = useState<any>(false);
  const [pagination, setPagination] = useState(1);
  const searchParams = useSearchParams();
  const executionId = searchParams.get("id") ? searchParams.get("id") : 0;
  const idParams = searchParams.get("uuid") ? searchParams.get("uuid") : null;
  const botName = searchParams.get("name") ? searchParams.get("name") : null;
  const ghostWallets = searchParams.get("ghost_wallets") ? searchParams.get("ghost_wallets") : 0;
  const [activeAirdrop, setActiveAirdrop] = useState(-1);
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState("");
  const [isLoadingTokenList, setIsLoadingTokenList] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { token } = useGlobalContext();

  let items = [];

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/volume-bot/list/executions/transactions`,
          {
            authtoken: token,
            execution_id: executionId,
            uuid: idParams,
            page: pagination,
            symbol: selectedTokenSymbol,
            end_date: endDate,
            start_date: startDate
          }
        );

        setResponseTransactions(response.data);
        const airdropStatus = Number(response?.data?.data?.details?.active_airdrop);
        setActiveAirdrop(airdropStatus);
        setIsLoading(false);

        if (response.data.success) {
          return response;
        } else {
          if (response.data.message) {
            toast.error(response.data.message);
          } else {
            toast.error(response.data);
          }
        }

        return [];
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

    if (token) {
      if (isLoading && idParams && isLoadingTransactions) {
        setIsLoadingTransactions(false);
        getTransactions();
      }

      if (isLoading && isLoadingTokenList) {
        setIsLoadingTokenList(false);
        loadTokenlist();
      }
    }
  }, [isLoading, isLoadingTokenList, tokenList, selectedTokenSymbol, idParams, executionId, botName, pagination, token]);

  for (let number = 1; number <= 1; number++) {
    items.push(
      <Pagination>
        {isLoading == true ? "" : (
          <>
            {pagination !== 1 && (
              <>
                <Pagination.First onClick={() => handleChangePage(1)} />
                <Pagination.Prev onClick={() => handleChangePage(Math.max(1, pagination - 1))} />
              </>
            )}
            <Pagination.Item
              key={pagination}
              active={true}
              onClick={() => handleChangePage(pagination)}
            >
              {pagination}
            </Pagination.Item>
            {reponseTransactions && reponseTransactions?.data?.transactions?.length == 10 && (
              <>
                <Pagination.Next onClick={() => handleChangePage(pagination + 1)} />
                {/*
            <Pagination.Last onClick={() => handleChangePage(total_pages)} />
           */}
              </>
            )}
          </>
        )
        }
      </Pagination>
    );
  }

  const handleChangePage = (page: any) => {
    setIsLoading(true);
    setIsLoadingTransactions(true);
    setPagination(page);
  };

  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      Link PolygonScan
    </Tooltip>
  );

  const handleConfirm = async () => {
    setIsLoading(true);
    setIsLoadingTransactions(true);
  };

  const handleStartDateChange = (event: any) => {
    setStartDate(event.target.value);
    setIsLoading(true);
    setIsLoadingTransactions(true);
  };

  const handleEndDateChange = (event: any) => {
    setEndDate(event.target.value);
    setIsLoading(true);
    setIsLoadingTransactions(true);
  };

  return (
    <>
      <Navbar />
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <div className="header-container">
            <div className="header-title">
              <h2>Transações</h2>
              <h5>Bot: {botName ? botName : ''}</h5>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ marginRight: "15px" }} className="header-options">
                <p>Data inicial</p>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
              </div>

              <div style={{ marginRight: "15px" }} className="header-options">
                <p>Data final</p>
                <input type="date" value={endDate} onChange={handleEndDateChange} />
              </div>

              <div className="header-options">
                <p>Selecione o token desejado</p>
                <div className="select-wrapper">
                  <select value={selectedTokenSymbol} onChange={(e) => {
                    setSelectedTokenSymbol(e.target.value);
                    handleConfirm();
                  }}>
                    <option value="">Todos</option>
                    <option value="MATIC">MATIC</option>
                    <option value="WMATIC">WMATIC</option>
                    {tokenList ? tokenList.map((token: any) => (
                      <option key={token.id} value={token.symbol}>
                        {token.name}
                      </option>
                    ))
                      : ""}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "25px" }}>
            <DivBot>
              <span style={{ backgroundColor: "#007bff", color: "whitesmoke" }}>
                <h3>Saída de Matic</h3>
                <p>
                  {reponseTransactions ? (
                    reponseTransactions.data?.details?.matic_output ? (
                      reponseTransactions.data.details.matic_output
                    ) : (
                      0
                    )
                  ) : (
                    "Loading..."
                  )}
                </p>
              </span>
              <span style={{ backgroundColor: "#007bff", color: "whitesmoke" }}>
                <h3>Saída de Tokens</h3>
                <p>
                  {reponseTransactions ? (
                    reponseTransactions.data?.details?.selected_token_output ? (
                      reponseTransactions.data.details.selected_token_output
                    ) : (
                      0
                    )
                  ) : (
                    "Loading..."
                  )}
                </p>
              </span>
              <span style={{ backgroundColor: "#1E2021", color: "whitesmoke" }}>
                <h3>Ghost Wallets Criadas</h3>
                <p>
                  {reponseTransactions ? (
                    reponseTransactions.data?.details?.ghost_wallets ? (
                      <span>{reponseTransactions.data.details.ghost_wallets} / {ghostWallets}</span>
                    ) : (
                      0
                    )
                  ) : (
                    "Loading..."
                  )}
                </p>
              </span>

              <span style={{ backgroundColor: "#28a745", color: "whitesmoke" }}>
                <h3>Entrada de Matic</h3>
                <p>
                  {reponseTransactions ? (
                    reponseTransactions.data?.details?.matic_input ? (
                      reponseTransactions.data.details.matic_input
                    ) : (
                      0
                    )
                  ) : (
                    "Loading..."
                  )}
                </p>
              </span>
              <span style={{ backgroundColor: "#28a745", color: "whitesmoke" }}>
                <h3>Entrada de Tokens</h3>
                <p>
                  {reponseTransactions ? (
                    reponseTransactions.data?.details?.selected_token_input ? (
                      reponseTransactions.data.details.selected_token_input
                    ) : (
                      0
                    )
                  ) : (
                    "Loading..."
                  )}
                </p>
              </span>
              <span style={{ backgroundColor: "#1E2021", color: "whitesmoke" }}>
                <h3>Porcentagem de Sucesso</h3>
                <p>
                  {reponseTransactions ? (
                    reponseTransactions.data?.details?.success_rate ? (
                      `${reponseTransactions.data.details.success_rate}`
                    ) : (
                      "100%"
                    )
                  ) : (
                    "Loading..."
                  )}
                </p>
              </span>

              <span style={{ backgroundColor: "#FF5733", color: "whitesmoke" }}>
                <h3>Matic Pendente</h3>
                <p>
                  {reponseTransactions ? (
                    reponseTransactions.data?.details?.matic_pending ? (
                      reponseTransactions.data.details.matic_pending
                    ) : (
                      0
                    )
                  ) : (
                    "Loading..."
                  )}
                </p>
              </span>
              <span style={{ backgroundColor: "#FF5733", color: "whitesmoke" }}>
                <h3>Token Pendente</h3>
                <p>
                  {reponseTransactions ? (
                    reponseTransactions.data?.details?.selected_token_pending ? (
                      reponseTransactions.data.details.selected_token_pending
                    ) : (
                      0
                    )
                  ) : (
                    "Loading..."
                  )}
                </p>
              </span>
              <span style={{ backgroundColor: "transparent", boxShadow: "none" }}>
              </span>
            </DivBot>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3 style={{ marginBottom: "15px" }}>Lista de Transações</h3>

            {reponseTransactions && reponseTransactions.data && reponseTransactions.data.transactions ? (
              reponseTransactions.data?.transactions.map((transaction: any) => (
                <Accordion
                  defaultActiveKey={[transaction]}
                  key={transaction.id}
                  style={{ width: "100%", marginBottom: "10px" }}
                >
                  <Accordion.Item eventKey="0">
                    <Accordion.Header
                      style={{
                        backgroundColor: `${transaction.status == 0 ? "#dc3545" : "#d8e9eb"}`,
                        borderRadius: "7px",
                      }}
                      className={transaction.status === 0 ? "text-white table-container" : "text-dark table-container"}
                    >
                      <p><b>Transaction ID: {transaction.id}</b></p>
                      {transaction.hash ? (
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltip}
                        >
                          <div className={transaction.status === 0 ? "text-white" : "text-dark"}>
                            <span>Hash: </span>
                            <Link href={`https://polygonscan.com/tx/${transaction.hash}`} target="_blank">{transaction.hash}</Link>
                          </div>
                        </OverlayTrigger>
                      ) : (
                        ""
                      )}
                      <p>Tipo: {transaction.type}</p>
                      <p>Criada em {transaction.created_at}</p>
                    </Accordion.Header>
                    <Accordion.Body className="table-container">
                      <DivTransactions key={transaction.id}>
                        <h5>Resultado: {transaction.message}</h5>

                        <div style={{ marginTop: "10px" }}>
                          <p><b>Token: {transaction.symbol_selected_token}</b></p>
                          <p><b>Tipo: {transaction.type}</b></p>
                        </div>

                        <div style={{ marginTop: "10px" }}>
                          <p>Token Inicial: {transaction.start_selected_token}</p>
                          <p>Token Final: {transaction.end_selected_token}</p>
                          <p>Diferença: {transaction.end_selected_token - transaction.start_selected_token}</p>
                        </div>

                        <div style={{ marginTop: "10px" }}>
                          <p>Matic Inicial: {transaction.start_matic}</p>
                          <p>Matic Final: {transaction.end_matic}</p>
                          <p>Diferença: {transaction.end_matic - transaction.start_matic}</p>
                        </div>

                        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                          <p>
                            Chave Privada da Ghost Wallet: {transaction.new_wallet_private_key}
                          </p>
                          <p>
                            Remetente: {transaction.from_address}
                          </p>
                          <p>
                            Destinatário: {transaction.to_address}
                          </p>
                        </div>

                        <p>Criada em: {transaction.created_at}</p>
                        <p>Atualizada: {transaction.updated_at}</p>
                      </DivTransactions>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>

          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <Pagination size="lg">{items}</Pagination>
          </div>
        </>
      )
      }
    </ >
  )
}
