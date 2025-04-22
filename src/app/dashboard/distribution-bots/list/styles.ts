import styled from "styled-components";

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
    background-color: #f0f0f0;
    cursor: pointer;
    transition: all 0.3s;
  }

  button:hover{
    opacity: 0.8;
  }

  button:nth-child(2){
    background-color: #28a745;
    color: #fff;
  }

`

export const InfoBots = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  /* width: 1160px;
  overflow: hidden; */

  h4{
    margin-bottom: 10px;
  }

`

export const InfoBotsDiv = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
  }

`

export const Table = styled.div`
  min-width: 650px;
  padding: 20px;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
`;

export const THeader = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 1px solid black;
`;

export const Th = styled.div`
  width: 100%;
  text-align: left;
  padding-bottom: 7px;
  font-size: 15px;
`;

export const TBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Tr = styled.ul`
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ccc;
`;

export const Td = styled.li`
  width: 100%;
  padding-top: 15px;
  font-size: 12px;
  padding-right: 10px;

  .icon{
    cursor: pointer;
  }
`;

export const ModalInfo = styled.div`
  position: absolute;
  top: 136px;
  max-width: 350px;
  width: 100%;

  background-color: #ccc;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 0px 5px #000;

  svg {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }

  ul {
    list-style: none;
    color: #000;
    font-size: 20px;
    font-weight: 500;

    li {
      margin: 10px 0;
    }
  }

`

export const ModalEdit = styled.div`
  position: absolute;
  height: 84%;
  overflow-y: auto;
  top: 50%;
  left: 50%; 
  max-width: 700px;
  width: 100%;
  background-color: #333;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 0px 5px #000;
  transform: translate(-50%, -50%);

  svg {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }

  ul {
    list-style: none;
    color: white;
    font-size: 20px;
    font-weight: 500;

    li {
      margin: 10px 0;
    }
  }

`

export const ModalPassword = styled.div`
  position: absolute;
  height:192px;
  overflow-y: auto;
  top: 50%;
  left: 50%; 
  max-width: 650px;
  width: 100%;
  background-color: #333;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 0px 5px #000;
  transform: translate(-50%, -50%);

  svg {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }

  ul {
    list-style: none;
    color: white;
    font-size: 20px;
    font-weight: 500;

    li {
      margin: 10px 0;
    }
  }

`

export const Form = styled.form`
  width: 100%;

  span {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 10px;

    label {
      font-size: 16px;
      font-weight: 500;
    }

    input {
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #ccc;
    }

    select {
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #ccc;
    }
  }

  h1 {
      font-size: 20px;
      font-weight: 500;
      margin-top: 10px;
      margin-bottom: 10px;
      text-align: center;
    }

    button {
      padding: 10px 20px;
      background-color: #000;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s;
    }

    button:hover {
      opacity: 0.8;
    }

    .configAdvanced {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      gap: 10px;

      > button {
        border: 1px solid transparent;
        padding: 10px;
        height: 30px;
        background-color: transparent !important;
        color: blue;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        svg {
          position: absolute;
          right: 3px;
          top: 6px;

          path {
            color: black;
          }
        }

        &:hover {
          border: 1px solid black;
        }
      }
    }
`;
