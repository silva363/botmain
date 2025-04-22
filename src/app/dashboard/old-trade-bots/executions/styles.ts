import styled from "styled-components";

export const InfoBots = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  h2{
    margin-bottom: 10px;
  }

  .divFlex {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    /* border: 1px solid #000; */
    padding: 8px;
    /* border-radius: 5px; */
  }

`

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

export const DivBot = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 5px;  

  span {
    flex: 1 0 calc(32%);
    align-items: center;
    justify-content: space-between;
    border: none;
    padding: 8px;
    border-radius: 5px;
    -webkit-box-shadow: 9px 11px 14px -11px rgba(0,0,0,0.75);
    -moz-box-shadow: 9px 11px 14px -11px rgba(0,0,0,0.75);
    box-shadow: 9px 11px 14px -11px rgba(0,0,0,0.75);
  
    h3 {
      font-size: 16px;
    }

    p {
      font-size: 14px;
    }
  }
`;

export const DivTransactions = styled.div`
  display: flex;
  flex-direction: column;
  border: none;
  margin-bottom: 10px;
  padding: 8px;
`

export const Table = styled.div`
  min-width: 630px;
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