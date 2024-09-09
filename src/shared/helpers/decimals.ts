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

export function divideBigInts(
  a: bigint,
  b: bigint,
  precision: number = 2
): string {
  const multiplier = BigInt(10 ** precision);
  const result = (a * multiplier) / b;

  // Convert the result to string and insert the decimal point
  const resultStr = result.toString();
  const decimalIndex = resultStr.length - precision;

  // Handle cases where the result might be shorter than expected
  const integerPart = resultStr.slice(0, decimalIndex) || "0";
  const decimalPart = resultStr.slice(decimalIndex).padStart(precision, "0");

  return `${integerPart}.${decimalPart}`;
}
