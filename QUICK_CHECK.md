# ✅ Verificação Rápida - Seu Projeto Está Funcionando?

Use este checklist para verificar rapidamente se tudo está funcionando após as correções.

## ✅ Passo 1: Limpar Cache (1 minuto)

### Windows/Linux:
```bash
# Limpar cache em qualquer navegador
Ctrl+Shift+Delete
```

### Mac:
```bash
Cmd+Shift+Delete
```

Após abrir o painel de limpeza:
1. Selecione "Todos os tempos"
2. Marque "Cache"
3. Clique "Limpar Dados"

---

## ✅ Passo 2: Recarregar Página (1 minuto)

### Windows/Linux:
```bash
# Hard reload (ignora cache)
Ctrl+F5
```

### Mac:
```bash
Cmd+Shift+R
```

---

## ✅ Passo 3: Verificar Console (3 minutos)

1. **Abra o Console:**
   - Pressione **F12** (ou Cmd+Option+J no Mac)
   - Vá para a aba **Console**

2. **Procure por estas mensagens de SUCESSO:**

```
✅ Supabase conectado com sucesso!
✅ Service Worker registrado
✅ X registros carregados com sucesso
✅ Inscrito em atualizações em tempo real
```

Se ver todas essas mensagens = **✅ PERFEITO!**

---

## ⚠️ Se Ver Erros

### Erro: "Cannot use 'import.meta' outside a module"

**Status:** ✅ Corrigido! Se ainda ver, execute:

```bash
# Limpar cache do navegador (veja Passo 1)
# Recarregar com Ctrl+Shift+Delete
# Recarregar página com Ctrl+F5
```

---

### Erro: "Variáveis de ambiente não configuradas"

**Solução:** Preencha o `.env`

1. Abra o arquivo `.env` (está na raiz do projeto)
2. Preencha com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=sua_chave_aqui
```

3. Salve o arquivo
4. Recarregue a página no navegador (Ctrl+F5)

---

### Erro: "relation 'recebimentos' does not exist"

**Solução:** Criar tabela no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Vá em **SQL Editor**
3. Copie e cole o SQL de [README.md](./README.md#3-criar-a-tabela-no-supabase)
4. Clique em "Run"

---

## 🧪 Teste Manual - Criar um Registro

1. Clique no botão **"Novo Recebimento"**
2. Preencha o formulário com:
   - Fornecedor: `Teste`
   - Produto: `Produto Teste`
   - NF: `NF001`
   - Data: `14/05/2026`
   - Hora Início: `10:00`
   - Hora Fim: `11:00`
   - Quantidade: `5`
   - Valor: `1000`

3. Clique "Confirmar Recebimento"
4. Verifique se aparece na tabela

**Resultado esperado:** ✅ Registro aparece na tabela

---

## 🔍 Teste Manual - Funcionalidades

### [ ] Tabela Carrega
- Verificar se há registros na tabela
- **Status esperado:** ✅ Dados aparecem ou "Nenhum registro"

### [ ] Gráficos Renderizam
- Verificar se os gráficos aparecem no topo
- **Status esperado:** ✅ Gráficos visíveis

### [ ] Busca Funciona
- Digite um fornecedor no campo "NF, Fornecedor ou Produto..."
- **Status esperado:** ✅ Tabela filtra em tempo real

### [ ] Filtros por Data Funcionam
- Selecione uma data em "Data Início"
- **Status esperado:** ✅ Tabela filtra por data

### [ ] Dark Mode Funciona
- Clique no ícone de sol/lua (canto superior direito)
- **Status esperado:** ✅ Cores invertem

### [ ] Modal de Novo Recebimento Abre
- Clique em "Novo Recebimento"
- **Status esperado:** ✅ Modal aparece

### [ ] Sidebar Abre/Fecha
- Clique no ícone de menu (canto superior esquerdo)
- **Status esperado:** ✅ Menu desliza

---

## 📊 Checklist Final

```
[ ] Console sem erros vermelhos
[ ] Mensagens de sucesso aparecem
[ ] Tabela carrega dados (ou mostra "Nenhum registro")
[ ] Gráficos renderizam
[ ] Botões funcionam
[ ] Modais abrem/fecham
[ ] Filtros funcionam
[ ] Dark mode funciona
[ ] Exportar Excel funciona (se houver dados)
```

Se TODOS os itens acima estão marcados = ✅ **SISTEMA PRONTO!**

---

## 🚨 Se Nada Funciona

Execute estes comandos em ordem:

```bash
# 1. Verifique o arquivo .env existe
ls -la .env

# 2. Verifique o arquivo .env tem valores
cat .env

# 3. Limpe o cache do npm
npm cache clean --force

# 4. Reinstale dependências
npm install

# 5. Reinicie o servidor
npm run dev
```

Então:
1. Limpe cache do navegador (Ctrl+Shift+Delete)
2. Hard reload (Ctrl+F5)
3. Abra console (F12)
4. Procure por erros

---

## 📞 Informações Úteis

### Abrir Console
- **Windows/Linux:** F12
- **Mac:** Cmd+Option+J

### Hard Refresh (ignora cache)
- **Windows/Linux:** Ctrl+F5
- **Mac:** Cmd+Shift+R

### Limpar Cache
- **Windows/Linux:** Ctrl+Shift+Delete
- **Mac:** Cmd+Shift+Delete

---

**Tudo funcionando? Parabéns! 🎉**

Se ainda houver dúvidas, consulte:
- [README.md](./README.md) - Guia completo
- [CONFIGURATION.md](./CONFIGURATION.md) - Configuração de variáveis
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Erros comuns
- [DEBUG_REPORT.md](./DEBUG_REPORT.md) - Detalhes técnicos das correções
