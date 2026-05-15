# ✅ Checklist de Diagnóstico - Banco de Dados

Use este guia para verificar e resolver problemas com o Supabase passo a passo.

## 🔍 Verificação Rápida (5 minutos)

### 1️⃣ Arquivo .env Existe?

```bash
# Linux/Mac - verificar se arquivo existe
ls -la .env

# Windows - verificar
dir .env
```

**✅ OK:** Arquivo aparece na lista  
**❌ PROBLEMA:** Arquivo não encontrado → Execute: `cp .env.example .env`

---

### 2️⃣ Variáveis estão preenchidas?

Abra o arquivo `.env` e verifique:

```env
VITE_SUPABASE_URL=https://tibpduakv...supabase.co    ← Deve começar com "https://"
VITE_SUPABASE_KEY=eyJhbGci...QYWnS3...             ← Deve ter aproximadamente 200+ caracteres
```

**✅ OK:** Ambas as linhas têm valores reais  
**❌ PROBLEMA:** Uma ou ambas estão com "sua_url_aqui" ou vazias → Refira-se a [CONFIGURATION.md](./CONFIGURATION.md)

---

### 3️⃣ Console do navegador mostra sucesso?

1. Abra o navegador
2. Pressione **F12** (ou Cmd+Option+J no Mac)
3. Vá para a aba **Console**
4. Procure por:

```
✅ Supabase conectado com sucesso!
✅ 10 registros carregados com sucesso
```

**✅ OK:** Mensagens de sucesso aparecem  
**❌ PROBLEMA:** Erros aparecem → Veja a seção "Erros Comuns" abaixo

---

## 🐛 Resolvendo Erros Comuns

### Erro 1: "Variáveis de ambiente Supabase não configuradas"

```
❌ ERRO: Variáveis de ambiente Supabase não configuradas!
📝 Verifique o arquivo .env:
   - VITE_SUPABASE_URL: ✗ Faltando
   - VITE_SUPABASE_KEY: ✗ Faltando
```

**Causa:** Arquivo `.env` não existe ou está vazio

**Solução:**
1. Copie `.env.example` para `.env`: `cp .env.example .env`
2. Abra `.env` e preencha com suas credenciais reais
3. Salve o arquivo
4. Recarregue a página no navegador (Ctrl+R ou Cmd+R)

---

### Erro 2: "relation 'recebimentos' does not exist"

```
❌ Erro ao carregar dados: 42P01 - relation 'recebimentos' does not exist
```

**Causa:** A tabela não foi criada no Supabase

**Solução:**
1. Acesse [supabase.com](https://supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Cole e execute este código:

```sql
CREATE TABLE recebimentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fornecedor TEXT NOT NULL,
  prod TEXT NOT NULL,
  nfO TEXT NOT NULL,
  dataSolicitacao DATE,
  dataPrevisao DATE NOT NULL,
  horarioPrevisto TEXT NOT NULL,
  horarioFim TEXT,
  qtd NUMERIC,
  vUnit TEXT,
  status TEXT DEFAULT 'Agendado',
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE recebimentos ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso
CREATE POLICY "Allow public read" ON recebimentos 
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON recebimentos 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON recebimentos 
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete" ON recebimentos 
  FOR DELETE USING (true);
```

5. Recarregue a página

---

### Erro 3: "Failed to fetch" / "CORS Error"

```
❌ Erro ao carregar dados: Failed to fetch
```

**Causa:** 
- URL do Supabase está incorreta
- Internet desconectada
- Projeto Supabase está offline

**Solução:**
1. Verifique a URL no `.env` - deve ser exatamente igual a `Project URL` em Supabase Settings > API
2. Verifique internet: abra [google.com](https://google.com) em outra aba
3. Verifique se o projeto está online em [supabase.com](https://supabase.com)
4. Limpe o cache: Ctrl+Shift+R (Windows/Linux) ou Cmd+Shift+R (Mac)

---

### Erro 4: "Unauthorized" / "401"

```
❌ Erro ao carregar dados: Unauthorized
```

**Causa:** Credenciais incorretas ou permissões insuficientes

**Solução:**
1. Verifique se está usando **Anon Key** (não a chave de serviço)
2. Confirme que a chave não tem caracteres extras ou espaços
3. Verifique as políticas RLS:
   - Vá em **Authentication** > **Policies** no Supabase
   - Confirme que as 4 políticas estão criadas (SELECT, INSERT, UPDATE, DELETE)

---

### Erro 5: "Erro ao salvar" quando tenta criar novo registro

```
❌ Erro ao salvar:
Erro ao processar solicitação. Verifique o console.
```

**Causa:** Problema com permissões ou dados inválidos

**Solução:**
1. Abra o console (F12) e procure pelo erro detalhado
2. Verifique se todos os campos obrigatórios estão preenchidos:
   - Fornecedor
   - Produto
   - NF
   - Data Previsão
   - Hora Prevista
3. Se persistir, verifique as políticas RLS (veja Erro 4)

---

## 🧪 Teste Manual (Avançado)

Se os erros persistem, faça um teste direto:

### No Supabase Console:

1. Acesse [supabase.com](https://supabase.com)
2. Vá em **SQL Editor**
3. Execute:

```sql
-- Teste se a tabela existe
SELECT COUNT(*) FROM recebimentos;

-- Se existir, tente inserir um teste
INSERT INTO recebimentos (fornecedor, prod, nfO, dataPrevisao, horarioPrevisto, status)
VALUES ('Teste', 'Produto Teste', 'NF001', '2026-05-15', '10:00', 'Agendado');
```

**✅ Se não der erro:** O banco está funcionando - o problema está no frontend  
**❌ Se der erro:** O problema está no banco - recrie a tabela

---

## 📞 Precisa de Ajuda?

1. **Abra o Console (F12)** e copie os erros exatos
2. **Verifique o `.env`** está na raiz do projeto com valores reais
3. **Recarregue a página** depois de qualquer alteração no `.env`
4. **Limpe o cache** com Ctrl+Shift+R

---

**Boa sorte! 🚀**
