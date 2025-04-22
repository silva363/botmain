/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Navbar from "@/components/navbar/navbar";
import { useRouter } from 'next/navigation';
import {
  DivBot,
  TBody,
  THeader,
  Table,
  Td,
  Th,
  Tr
} from "./styles";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Pagination from "react-bootstrap/Pagination";
import { useSearchParams } from "next/navigation";
import { useGlobalContext } from "@/components/store/authContext";
import Loader from "@/components/loader/loader";

export default function Executions() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingExecutions, setIsLoadingExecutions] = useState(true);
  const [reponseExecutions, setResponseExecutions] = useState<any>(false);
  const [pagination, setPagination] = useState(1);
  const searchParams = useSearchParams();
  const idParams = searchParams.get("uuid") ? searchParams.get("uuid") : null;
  const botName = searchParams.get("name") ? searchParams.get("name") : null;
  const botWallets = searchParams.get("wallets") ? searchParams.get("wallets") : 0;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { token } = useGlobalContext();
  const { push } = useRouter();

  let items = [];

  useEffect(() => {
    const getExecutions = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/distribution-bot/list/executions`,
          {
            authtoken: token,
            uuid: idParams,
            page: pagination,
            end_date: endDate,
            start_date: startDate
          }
        );

        if (response.data.success) {
          setResponseExecutions([]);
          setTimeout(() => {
            setResponseExecutions(response.data);
            setIsLoading(false);
          }, 300);

        } else {
          setIsLoading(false);
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

    if (token) {
      if (isLoading && idParams && isLoadingExecutions) {
        setIsLoadingExecutions(false);
        getExecutions();
      }
    }
  }, [isLoading, idParams, pagination, token]);

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
            {reponseExecutions && reponseExecutions?.data?.executions?.length == 10 && (
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
    setIsLoadingExecutions(true);
    setPagination(page);
  };

  const handleStartDateChange = (event: any) => {
    setStartDate(event.target.value);
    setIsLoading(true);
    setIsLoadingExecutions(true);
  };

  const handleEndDateChange = (event: any) => {
    setEndDate(event.target.value);
    setIsLoading(true);
    setIsLoadingExecutions(true);
  };

  const handleReRun = async (id: number) => {
    try {
      if (!confirm("Você tem certeza que deseja re-executar?")) {
        return;
      }

      setIsLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/distribution-bot/reRun`,
        { uuid: idParams, execution_id: id, authtoken: token }
      );

      setIsLoading(false);

      if (response.data.success) {
        toast.success(response.data.message);

        setTimeout(() => {
          setIsLoading(true);
          setIsLoadingExecutions(true);
        }, 300);
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

  const pageTransactions = (id: number) => {
    push(`/dashboard/distribution-bots/executions/transactions?id=${id}&uuid=${idParams}&name=${botName}&wallets=${botWallets}`);
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
              <h2>Execuções</h2>
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
            </div>
          </div>

          <div style={{ marginTop: "25px" }}>
            <DivBot>
              <span style={{ backgroundColor: "#007bff", color: "whitesmoke" }}>
                <h3>Saída de Matic</h3>
                <p>
                  {reponseExecutions ? (
                    reponseExecutions.data?.details?.matic_output ? (
                      reponseExecutions.data.details.matic_output
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
                  {reponseExecutions ? (
                    reponseExecutions.data?.details?.selected_token_output ? (
                      reponseExecutions.data.details.selected_token_output
                    ) : (
                      0
                    )
                  ) : (
                    "Loading..."
                  )}
                </p>
              </span>
              <span style={{ backgroundColor: "#1E2021", color: "whitesmoke" }}>
                <h3>Carteiras para Distribuição</h3>
                <p>
                  {reponseExecutions ? (
                    botWallets ? (
                      botWallets
                    ) : (
                      0
                    )
                  ) : (
                    "Loading..."
                  )}
                </p>
              </span>
              <span style={{ backgroundColor: "#FF5733", color: "whitesmoke" }}>
                <h3>Matic com Falha</h3>
                <p>
                  {reponseExecutions ? (
                    reponseExecutions.data?.details?.matic_fails ? (
                      reponseExecutions.data.details.matic_fails
                    ) : (
                      0
                    )
                  ) : (
                    "Loading..."
                  )}
                </p>
              </span>
              <span style={{ backgroundColor: "#FF5733", color: "whitesmoke" }}>
                <h3>Token com Falha</h3>
                <p>
                  {reponseExecutions ? (
                    reponseExecutions.data?.details?.selected_token_fails ? (
                      reponseExecutions.data.details.selected_token_fails
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
                  {reponseExecutions ? (
                    reponseExecutions.data?.details?.success_rate ? (
                      `${reponseExecutions.data.details.success_rate}`
                    ) : (
                      "100%"
                    )
                  ) : (
                    "Loading..."
                  )}
                </p>
              </span>
              <span style={{
                backgroundColor: `transparent`, boxShadow: "none"
              }}>
              </span>
            </DivBot>
          </div>

          <div className="table-container">
            {reponseExecutions && reponseExecutions.data ? (
              <Table>
                <THeader>
                  <Th>Nº de Execução</Th>
                  <Th style={{ width: "200px" }}>Status</Th>
                  <Th style={{ width: "360px" }}>Criação</Th>
                  <Th style={{ width: "360px" }}>Atualização</Th>
                  <Th style={{ maxWidth: "140px", textAlign: "center" }}>Execução</Th>
                </THeader>
                <TBody>
                  {reponseExecutions.data?.executions?.map((execution: any) => (
                    <Tr key={execution.id}>
                      <Td onClick={() => pageTransactions(execution.id)} className="setHover">
                        <span style={{ marginLeft: "15px" }}> {execution.execution_time}</span>
                      </Td>
                      <Td style={{ width: "200px" }}>
                        {execution.active == 1
                          ? "Ativo" : (
                            execution.active == 0
                              ? "Concluído" : "Pausado"
                          )}
                      </Td>
                      <Td style={{ width: "360px" }}>{execution.created_at}</Td>
                      <Td style={{ width: "360px" }}>{execution.updated_at}</Td>
                      <Td style={{ maxWidth: "140px", textAlign: "center" }}>
                        <div style={{ minHeight: "40px", height: "100%", marginTop: "-10px", textTransform: "uppercase", letterSpacing: "1px", borderRadius: "6px", display: "flex" }}>
                          {execution.active == 0 ? (
                            ""
                          ) : (
                            execution.active == 1 ? (
                              <button
                                style={{ backgroundColor: "yellow", color: "black", width: "100%", height: "100%", border: "none", borderRadius: "6px", textTransform: "uppercase", letterSpacing: "2px", cursor: "wait" }}
                              >
                                <b>Executando</b>
                              </button>
                            ) : (
                              execution.seed_active == 1 ? (
                                <button
                                  style={{ backgroundColor: "orange", color: "black", width: "100%", height: "100%", border: "none", borderRadius: "6px", textTransform: "uppercase", letterSpacing: "2px", cursor: "wait" }}
                                >
                                  <b>Bot ocupado</b>
                                </button>
                              ) : (
                                <button
                                  style={{ backgroundColor: "black", color: "whitesmoke", width: "100%", height: "100%", border: "none", borderRadius: "6px", textTransform: "uppercase", letterSpacing: "2px" }}
                                  onClick={() => handleReRun(execution.id)}
                                >
                                  <b>Re-executar</b>
                                </button>
                              )
                            )
                          )}
                        </div>

                      </Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
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
