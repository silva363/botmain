import { Alchemy, Network } from "alchemy-sdk";

function getMinifiedAddress(address: string | null): string {
  if (address) {
    return (
      address.slice(0, 5) +
      "...." +
      address.slice(address.length - 4, address.length)
    );
  } else {
    return "none";
  }
}

function convertStringToNumber(value: string) {
  let cleanedValue = value.replace(/[^0-9.-]/g, "");
  cleanedValue = cleanedValue.replace(/,(?=[^,]*$)/, ".");
  const numberValue = parseFloat(cleanedValue);

  return numberValue;
}

async function getGasFeePrices(): Promise<{ gasPrice: bigint, lastBaseFeePerGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint }> {
  try {
    const sdkSettings = {
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
      network: Network.MATIC_MAINNET,
    };

    const alchemy = new Alchemy(sdkSettings);
    const getFeeData = await alchemy.core.getFeeData();

    if (!getFeeData || !getFeeData.gasPrice || !getFeeData.lastBaseFeePerGas || !getFeeData.maxFeePerGas || !getFeeData.maxPriorityFeePerGas) {
      throw 'Error to get gas fee price';
    }

    const data = {
      gasPrice: BigInt(getFeeData.gasPrice.mul(115).div(100).toString()),
      lastBaseFeePerGas: BigInt(getFeeData.lastBaseFeePerGas.toString()),
      maxFeePerGas: BigInt(getFeeData.maxFeePerGas.toString()),
      maxPriorityFeePerGas: BigInt(getFeeData.maxPriorityFeePerGas.toString())
    };

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    } else {
      throw error;
    }
  }
}

export { getMinifiedAddress, convertStringToNumber, getGasFeePrices };