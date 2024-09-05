import { formatUnits } from "viem";

export function formatNumber(
  value: bigint,
  decimals = 18,
  displayDecimals = 5
): string {
  const number = formatUnits(value, decimals);
  return parseFloat(number).toFixed(displayDecimals);
}

// // Example usage:
// const formatted = formatUnits(BigInt("1234567890123456789"), 18, 5); // "1.23456"
// console.log(formatted);

export function parseNumber(value: string, decimals = 18): bigint {
  const [integerPart, fractionalPart = ""] = value.split(".");
  const fractionalPartPadded = fractionalPart.padEnd(decimals, "0");

  const integerBigInt = BigInt(integerPart) * BigInt(10 ** decimals);
  const fractionalBigInt = BigInt(fractionalPartPadded.slice(0, decimals));

  return integerBigInt + fractionalBigInt;
}

// Example usage:
// const bigIntValue = parseUnits("1.000000000000000000"); // BigInt('1000000000000000000')
// console.log(bigIntValue);
