# REA no projeto MuseTera — guia de ativação

**Fonte original:** https://github.com/morluto/rea
**Snapshot oficial utilizado:** `949966712e68d8857a50a165ecddf04c2d7e6d3b`
**Pacote publicado de referência:** `rea-agents` (na inspeção, versão 6.7.0).
**Licença:** MIT (veja `third_party/rea/LICENSE`).

## O que foi instalado no repositório
A skill oficial `.agents/skills/reverse-engineer-anything/SKILL.md` e todos os seis documentos em `references/` foram copiados sem alterações. Não há scripts executados nem mudanças nas telas ou banco de dados do MuseTera.

## Ativar REA MCP no Codex (no seu computador/ambiente de agente)
1. Instale Node.js **22.19+**, **24.11+** ou **26+** e npm.
2. No terminal onde o Codex está instalado, rode `node -v` e `npm -v`.
3. Execute a instalação oficial `npx rea-agents@6.7.0 setup --client codex`.
4. Revise as alterações propostas e confirme no próprio instalador. A instalação registra o servidor MCP e a skill pessoal; outras aplicações não são modificadas sem aprovação.
5. Reinicie o Codex, execute `npx rea-agents@6.7.0 doctor --client codex --json`, e confira se o MCP responde.
6. Para verificar comandos disponíveis: `npx rea-agents@6.7.0 --help`.

**Importante:** ter arquivos de skill no GitHub **não** adiciona ferramentas MCP à sessão atual do ChatGPT nem instala o CLI no computador. É necessária a execução dos passos acima no ambiente do agente. O setup interativo pode solicitar permissões e instalar ferramentas nativas opcionais apenas com sua autorização. Consulte https://github.com/morluto/rea/blob/949966712e68d8857a50a165ecddf04c2d7e6d3b/docs/installation.md.

## Próxima fase — Plano Terapêutico Individual (PI)
- Mantenha o PI atual intacto enquanto analisa o projeto de referência.
- Crie uma branch de integração independente (ex.: `feature/pi-novo`).
- Se o projeto-alvo tiver código-fonte acessível, prefira inspecioná-lo com GitHub e ferramentas de desenvolvimento normais. A skill REA é para análise de aplicativos, páginas ou binários cujos comportamentos **não** são explicados por código disponível.
- Documente o que é comprovado pela análise e o que será nova implementação, respeitando a licença e os direitos do projeto de origem.
- Adapte ao Supabase, permissões por profissional, pacientes, PDF/Word e estilo verde MuseTera.
- Faça build e testes em preview, e só integre na `main` após aprovação.

## Atualização
Para atualizar, repita a importação a partir de uma nova revisão **inspecionada** do projeto oficial REA e rode o setup/doctor correspondente no ambiente do agente.
