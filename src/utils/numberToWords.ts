const UNIDADES = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
const DEZ_A_DEZENOVE = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
const DEZENAS = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
const CENTENAS = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

function ate999(n: number): string {
  if (n === 0) return "";
  if (n === 100) return "cem";
  const c = Math.floor(n / 100);
  const resto = n % 100;
  const parts: string[] = [];
  if (c) parts.push(CENTENAS[c]);
  if (resto > 0) {
    if (resto < 10) parts.push(UNIDADES[resto]);
    else if (resto < 20) parts.push(DEZ_A_DEZENOVE[resto - 10]);
    else {
      const d = Math.floor(resto / 10);
      const u = resto % 10;
      parts.push(u ? `${DEZENAS[d]} e ${UNIDADES[u]}` : DEZENAS[d]);
    }
  }
  return parts.join(" e ");
}

export function valorPorExtenso(valor: number): string {
  const inteiros = Math.floor(valor);
  const centavos = Math.round((valor - inteiros) * 100);
  const reaisStr = (() => {
    if (inteiros === 0) return "zero real";
    const milhoes = Math.floor(inteiros / 1_000_000);
    const milhares = Math.floor((inteiros % 1_000_000) / 1000);
    const unid = inteiros % 1000;
    const parts: string[] = [];
    if (milhoes) parts.push(`${milhoes === 1 ? "um milhão" : `${ate999(milhoes)} milhões`}`);
    if (milhares) parts.push(`${milhares === 1 ? "mil" : `${ate999(milhares)} mil`}`);
    if (unid) parts.push(ate999(unid));
    const txt = parts.join(" e ");
    return `${txt} ${inteiros === 1 ? "real" : "reais"}`;
  })();
  if (centavos === 0) return reaisStr;
  const centStr = `${ate999(centavos)} ${centavos === 1 ? "centavo" : "centavos"}`;
  return `${reaisStr} e ${centStr}`;
}
