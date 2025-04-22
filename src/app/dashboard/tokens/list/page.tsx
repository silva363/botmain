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
import { FaRegEdit, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import { useGlobalContext } from "@/components/store/authContext";
import Loader from "@/components/loader/loader";

export default function Home() {
  const [listToken, setListToken] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [showEditModal, setShowEditModal] = useState<any>(false);
  const [editTokenData, setEditTokenData] = useState<Token | any>({
    id: 0,
    name: "",
    symbol: "",
    address: "",
    decimals: 18,
    pool_name: "",
    pool_symbol: "",
    pool_address: "",
    pool_decimals: 18
  });
  const { token } = useGlobalContext();

  useEffect(() => {
    async function loadTokenList() {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/acceptedTokens/list`, { authtoken: token });
        setIsLoading(false);

        if (response.data.success) {
          setListToken(response.data.data);
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

    if (token) {
      if (isLoading) {
        loadTokenList();
      }
    }
  }, [
    listToken,
    isLoading,
    editTokenData,
    token
  ]);

  const handleSave = async (e: any) => {
    try {
      e.preventDefault();
      setIsLoadingEdit(true);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/acceptedTokens/edit`, { editTokenData, authtoken: token });

      setIsLoadingEdit(false);

      if (response.data.success) {
        toast.success(response.data.message);
        setIsLoading(true);
        handleCloseEditClick();
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

  const handleEditClick = (token: any) => {
    setEditTokenData(token);
    setShowEditModal(true);
  };

  const handleCloseEditClick = () => {
    setShowEditModal(false);
  };

  const handleEdit = async (e: any) => {
    const { name, value } = e.target;
    setEditTokenData((prevData: any) => ({
      ...prevData,
      [name]: name === "type" ? value : value || value,
    }));
  };

  const handleHide = async (id: number) => {
    try {
      if (!confirm("Você tem certeza que deseja ocultar este token?")) {
        return;
      }

      setIsLoadingEdit(true);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/api/acceptedTokens/change-active`, { id, authtoken: token });

      setIsLoadingEdit(false);

      if (response.data.success) {
        toast.success(response.data.message);
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
              <h2>Tokens Aceitos</h2>
            </div>
          </div>

          <div className="table-container">
            <Table>
              <THeader>
                <Th style={{ maxWidth: "140px" }}>
                  Nome
                </Th>
                <Th>
                  Endereço
                </Th>
                <Th style={{ maxWidth: "140px" }}>
                  Symbol
                </Th>

                <Th style={{ maxWidth: "140px" }}>
                  Nome da Pool
                </Th>
                <Th>
                  Endereço da Pool
                </Th>
                <Th style={{ maxWidth: "140px" }}>
                  Symbol da Pool
                </Th>
                <Th style={{ maxWidth: "120px" }}>Ações</Th>
              </THeader>
              <TBody>
                {listToken?.map((token) => (
                  <Tr key={token.id}>
                    <Td style={{ maxWidth: "140px" }}>
                      {token.name}
                    </Td>
                    <Td>
                      {token.address}
                    </Td>
                    <Td style={{ maxWidth: "140px" }}>
                      {token.symbol}
                    </Td>

                    <Td style={{ maxWidth: "140px" }}>
                      {token.pool_name}
                    </Td>
                    <Td>
                      {token.pool_address}
                    </Td>
                    <Td style={{ maxWidth: "140px" }}>
                      {token.pool_symbol}
                    </Td>

                    <Td style={{ maxWidth: "120px" }}>
                      <FaRegEdit
                        size={15}
                        onClick={() => handleEditClick(token)}
                        className="icon"
                        style={{ margin: "4px" }}
                      />
                      {
                        /*
                        <FaEyeSlash
                        size={15}
                        onClick={() => handleHide(token.id)}
                        className="icon"
                        style={{ margin: "4px" }}
                        />
                        */
                      }
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </div>

          <div className="container">
            <Link href="create" >
              <button className="floating-button">+</button>
            </Link>
          </div>

          {showEditModal && editTokenData && (
            <ModalEdit>
              <IoIosCloseCircleOutline
                size={35}
                onClick={() => setShowEditModal(false)}
              />
              <ul>
                <Form onSubmit={handleSave}>
                  <span>
                    <label>Nome do Token</label>
                    <input
                      type="text"
                      name="name"
                      onChange={handleEdit}
                      value={editTokenData.name}
                    />
                  </span>
                  <span>
                    <label>Endereço</label>
                    <input
                      type="text"
                      name="address"
                      onChange={handleEdit}
                      value={editTokenData.address}
                    />
                  </span>
                  <span>
                    <label>Symbol</label>
                    <input
                      type="text"
                      name="symbol"
                      onChange={handleEdit}
                      value={editTokenData?.symbol}
                    />
                  </span>
                  <span>
                    <label>Decimais</label>
                    <input
                      type="number"
                      name="decimals"
                      onChange={handleEdit}
                      value={editTokenData?.decimals}
                    />
                  </span>

                  <span>
                    <label>Nome da pool do Token</label>
                    <input
                      type="text"
                      name="pool_name"
                      onChange={handleEdit}
                      value={editTokenData.pool_name}
                    />
                  </span>
                  <span>
                    <label>Endereço da pool</label>
                    <input
                      type="text"
                      name="pool_address"
                      onChange={handleEdit}
                      value={editTokenData.pool_address}
                    />
                  </span>
                  <span>
                    <label>Symbol da pool</label>
                    <input
                      type="text"
                      name="pool_symbol"
                      onChange={handleEdit}
                      value={editTokenData?.pool_symbol}
                    />
                  </span>
                  <span>
                    <label>Decimais da pool</label>
                    <input
                      type="number"
                      name="pool_decimals"
                      onChange={handleEdit}
                      value={editTokenData?.pool_decimals}
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
