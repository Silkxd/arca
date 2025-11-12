## Objetivo

* Deixar a tela de COFRE com a mesma estrutura visual e comportamental da tela de NOTAS: sidebar à esquerda, cabeçalho com busca/ação, área principal com grid e estados de loading/empty, e modais.

## Diferenças Atuais

* NOTAS usa layout em duas colunas com sidebar, header de busca e grid (src/pages/Notes.tsx:246–314). COFRE tem cabeçalho próprio, filtros e grid sem sidebar e sem o header de busca padronizado (src/pages/Vault.tsx:69–167).

* NOTAS já possui componentes dedicados: `NoteSidebar` (src/components/notes/NoteSidebar.tsx), `SearchBar` (src/components/notes/SearchBar.tsx), `NoteGrid` (src/components/notes/NoteGrid.tsx). COFRE possui `VaultItemCard`/`VaultItemForm`, mas não tem sidebar nem grid com header unificado.

## Estratégia de Unificação

* Reaproveitar padrões de NOTAS para criar equivalentes em COFRE: `VaultSidebar`, `VaultGrid` e adotar o mesmo `SearchBar` (extraído para comum) com rótulo de ação “Adicionar Item”.

* Manter o estado/CRUD do COFRE via `useVaultStore` (src/store/vaultStore.ts) sem alterações de backend; a sidebar de COFRE listará categorias derivadas dos itens (`item.category`).

## Alterações Propostas

* Criar `src/components/vault/VaultSidebar.tsx` inspirado em `NoteSidebar`:

  * Itens: “Todos”, “Documentos”, “Textos” e lista dinâmica de categorias. Suporte a colapso (desktop) e abertura (mobile), seguindo classes utilitárias de NOTAS.

* Criar `src/components/vault/VaultGrid.tsx` inspirado em `NoteGrid`:

  * Header com nome do filtro/segmento e contagem de itens, grid usando `VaultItemCard`, estados de vazio (sem itens / busca sem resultados) e skeleton de loading.

* Extrair `src/components/notes/SearchBar.tsx` para `src/components/ui/SearchBar.tsx`:

  * Tornar o rótulo de ação parametrizável (`actionLabel`), placeholder ajustável e handler genérico (`onAction`). Atualizar NOTAS e COFRE para usar o componente comum.

* Refatorar `src/pages/Vault.tsx` para a mesma estrutura de `Notes.tsx`:

  * Container: `flex h-screen ...` com sidebar à esquerda e conteúdo à direita.

  * Header: `SearchBar` comum com `placeholder="Buscar itens..."` e ação “Adicionar Item” abrindo `VaultItemForm`.

  * Content: `VaultGrid` recebendo `filteredItems` e estados de loading/erro; manter `ConfirmationModal` para exclusão.

## Passos Técnicos

1. Criar `VaultSidebar.tsx` com props: `isCollapsed`, `onToggleCollapse`, `selectedSegment`, `onSelectSegment`, `isMobileOpen`, `onMobileToggle`; derivar `categories` de `useVaultStore().items`.
2. Criar `VaultGrid.tsx` com props: `items`, `onDeleteItem`, `searchTerm`, `selectedSegment`, `isLoading`; usar `VaultItemCard` (src/components/vault/VaultItemCard.tsx:59–167).
3. Extrair `SearchBar` para `src/components/ui/SearchBar.tsx` mantendo API e adicionando `actionLabel`/`onAction`.
4. Atualizar `src/pages/Notes.tsx` para importar `SearchBar` do caminho comum (src/pages/Notes.tsx:264–273).
5. Refatorar `src/pages/Vault.tsx` para layout em duas colunas; mover filtros atuais para a sidebar e o restante para o novo header.

## Validações

* Verificar navegação e layout com `Layout` (src/components/layout/Layout.tsx:10–22) em rotas `/vault` e `/notes` (src/App.tsx).

* Testar estados: loading (src/pages/Vault.tsx:60–66), vazio (sem itens), busca sem resultados e modais de formulário/confirmacão.

* Garantir responsividade: colapso da sidebar no desktop e overlay no mobile replicando `NoteSidebar` (src/components/notes/NoteSidebar.tsx:29–40, 44–69).

## Resultado Esperado

* Tela de COFRE visualmente e estruturalmente igual à de NOTAS, mantendo recursos específicos do cofre (documentos/textos, categorias, download/visualização) e UX consistente.

