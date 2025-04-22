import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface botinfoState {
  bot: botInfo;
}

export interface botInfo {
    botName: string;
    walletDestino: string;
    chavePrivada: string;
    nomeChavePrivada: string;
    estrategia: string;
    token: string;
    precoTarget: string;
    amountTarget: string;
    valorMinimo: string;
    valorMaximo: string;
    tempoMinimo: string;
    tempoMaximo: string;
    holders: string;
    airdropTime: string;
    taxaDerrapagem: string;
  }

const initialState: botinfoState = {
  bot: {
    botName: "",
    walletDestino: "",
    chavePrivada: "",
    nomeChavePrivada: "",
    estrategia: "",
    token: "",
    precoTarget: "",
    amountTarget: "",
    valorMinimo: "",
    valorMaximo: "",
    tempoMinimo: "",
    tempoMaximo: "",
    holders: "",
    airdropTime: "",
    taxaDerrapagem: "",
  }
};

export const botSlice = createSlice({
  name: "botInfo",
  initialState,
  reducers: {
    setBot: (state, action: PayloadAction<botInfo>) => {
      state.bot = action.payload;
    },
    
  },
});

export const { setBot } =  botSlice.actions;
export default botSlice.reducer;
