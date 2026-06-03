## Objetivo
Substituir os dados mockados pelos dados reais da API `https://palpites-backend-production.up.railway.app`, mantendo **todo o layout atual intacto**.

## O que vou criar

### 1. `src/config/api.ts`
Constantes centralizadas:
- `BASE_URL = "https://palpites-backend-production.up.railway.app"`
- `PREMIUM_TOKEN = "Pp$9xK#mR2@vLqZ7!nWd"`
- Helpers `apiUrl(path)` e `authHeaders()`

> Observação de segurança: o token "premium" ficará embutido no bundle do frontend (qualquer usuário consegue extrair). Está OK pra MVP, mas o ideal futuro é mover essa chamada pra um server function que injeta o header server-side. Sigo com o pedido como solicitado.

### 2. `src/lib/api/copa.ts`
Funções tipadas que consomem o backend:
- `fetchJogos()` → `GET /api/v1/copa/jogos`
- `fetchJogo(slug)` → `GET /api/v1/copa/jogos/{slug}`
- `fetchRecomendacao(slug)` → `GET /api/v1/copa/jogos/{slug}/recomendacao` com `Authorization: Bearer ...`
- Tipos `ApiJogo`, `ApiJogoDetalhe`, `ApiRecomendacao` espelhando o payload real.
- Adaptador `toMatch(apiJogo, detalhe?, recomendacao?)` que converte para o tipo `Match` existente (mantém o layout funcionando sem refatorar componentes).

## O que vou alterar

### 3. `src/routes/index.tsx` (home)
- Trocar `import { matches }` por `useQuery(['jogos'], fetchJogos)`.
- Adaptar resposta com `toMatch()` e renderizar nos `<MatchCard />` existentes.
- Adicionar estado de loading (skeleton simples mantendo o grid) e erro.
- Filtros de liga: como a API só devolve jogos da Copa, vou **esconder a barra de filtros** (ou deixar só "Todos"). Avisa se preferir manter mockado.
- `match.id` passa a ser o `slug` (para casar com a rota `/partida/$id`).

### 4. `src/routes/partida.$id.tsx`
- Remover `loader` que lê mock.
- Usar `useQuery(['jogo', slug], () => fetchJogo(slug))` no componente.
- Usar `useQuery(['recomendacao', slug], () => fetchRecomendacao(slug))` para popular `topMarkets` / `allMarkets`.
- Enquanto a recomendação carrega/falha, mostrar placeholder "Análise da IA sendo gerada…" no bloco de mercados (sem quebrar o resto da página).
- Cabeçalho, estatísticas (rating, stats_casa/fora, forma, h2h) ficam alimentados pelos campos reais da API; o resto do layout permanece igual.

### 5. Páginas auxiliares (`zebras`, `odds-baixas`, `bingos`)
- Continuam usando o mock por enquanto (não foram pedidas). Posso conectar depois se quiser.

## Detalhes técnicos
- Uso `useQuery` (TanStack Query já configurado no projeto) com `staleTime` razoável.
- Os componentes `MatchCard`, `ConfidenceBadge`, etc., **não mudam**.
- A interface `Match` em `mock-data.ts` permanece — o adaptador preenche campos que a API não tem (ex.: `referee`, `keyPlayers`, `refereeStats`) com defaults neutros pra não quebrar a UI.

## Ponto de atenção descoberto na exploração
O endpoint `/recomendacao` retornou **`500 Internal Server Error`** no `brazil-morocco` durante meu teste. Vou implementar o fetch corretamente, mas o bloco "Análise por mercado" vai mostrar estado de erro até o backend responder. Quer que eu siga assim?

## Confirma que posso aplicar?