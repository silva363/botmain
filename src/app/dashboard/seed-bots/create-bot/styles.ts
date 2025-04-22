import styled from "styled-components";

export const Separator = styled.div`
  min-width: 100%;
  height: 1px;
  background-color: #000;
  margin: 10px 0;
`;

export const BlocoBtn = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 10px;
  gap: 10px;

  button{
    padding: 10px 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #000;
    cursor: pointer;
    transition: all 0.3s;
    color: whitesmoke
  }

  button:hover{
    opacity: 0.8;
  }

  button:nth-child(2){
    background-color: #28a745;
    color: whitesmoke;
  }

`