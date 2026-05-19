export const onlyDigits = (v: string) => (v || "").replace(/\D/g, "");

export function maskCPF(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskCNPJ(v: string) {
  const d = onlyDigits(v).slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function isValidCPF(cpf: string): boolean {
  const c = onlyDigits(cpf);
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  let s = 0;
  for (let i = 0; i < 9; i++) s += parseInt(c[i]) * (10 - i);
  let d1 = 11 - (s % 11);
  if (d1 >= 10) d1 = 0;
  if (d1 !== parseInt(c[9])) return false;
  s = 0;
  for (let i = 0; i < 10; i++) s += parseInt(c[i]) * (11 - i);
  let d2 = 11 - (s % 11);
  if (d2 >= 10) d2 = 0;
  return d2 === parseInt(c[10]);
}

export function isValidCNPJ(cnpj: string): boolean {
  const c = onlyDigits(cnpj);
  if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false;
  const calc = (base: string, weights: number[]) => {
    const sum = weights.reduce((a, w, i) => a + parseInt(base[i]) * w, 0);
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const d1 = calc(c.slice(0, 12), w1);
  if (d1 !== parseInt(c[12])) return false;
  const d2 = calc(c.slice(0, 13), w2);
  return d2 === parseInt(c[13]);
}

export interface BrasilApiCnpj {
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
  ddd_telefone_1?: string;
  email?: string;
}

export async function fetchCNPJ(cnpj: string): Promise<BrasilApiCnpj> {
  const c = onlyDigits(cnpj);
  if (!isValidCNPJ(c)) throw new Error("CNPJ inválido");
  const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${c}`);
  if (!res.ok) throw new Error("CNPJ não encontrado na Receita Federal");
  return res.json();
}
