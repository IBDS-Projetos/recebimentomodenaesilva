# 🔐 Configuração de Variáveis de Ambiente

## O que é .env?

O arquivo `.env` armazena **variáveis sensíveis** como credenciais de banco de dados, chaves de API e configurações específicas do ambiente. Este arquivo **nunca deve ser commitado** no Git para proteger informações sensíveis.

## ✅ Como configurar

### Passo 1: Criar o arquivo .env

```bash
# Linux/Mac
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example -Destination .env
```

### Passo 2: Obter credenciais do Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login em sua conta
3. Selecione o projeto desejado
4. Clique em **Settings** (engrenagem no menu lateral)
5. Vá para **API** (na aba de configurações)
6. Copie os valores:

```
Project URL       → VITE_SUPABASE_URL
Anon Key          → VITE_SUPABASE_KEY
```

### Passo 3: Preencher o .env

Abra o arquivo `.env` e preencha:

```env
VITE_SUPABASE_URL=https://sua-url-aqui.supabase.co
VITE_SUPABASE_KEY=sua-chave-anon-aqui
```

### Passo 4: Verificar se funciona

- Abra o Console do navegador (F12)
- Recarregue a página
- Procure por "✅ Supabase conectado com sucesso!"

Se ver uma mensagem de erro, verifique:
- ❌ Se a URL está correta (sem espaços em branco)
- ❌ Se a chave está correta (sem caracteres faltando)
- ❌ Se o arquivo `.env` está na **raiz do projeto**

## 🔒 Segurança

### O que é seguro?

✅ Armazenar no `.env` (arquivo local)  
✅ Variáveis com prefixo `VITE_` são seguras no frontend  
✅ Usar chave **Anon** (não a chave de serviço)  

### O que NÃO é seguro?

❌ Commitar `.env` no Git  
❌ Colocar chaves hardcoded no código  
❌ Usar chave de **Serviço** no frontend  
❌ Compartilhar credenciais por email/chat  

## 📋 Checklist de segurança

- [ ] Arquivo `.env` está em `.gitignore`?
- [ ] Usando chave **Anon Key** (não a service key)?
- [ ] Não commitei `.env` no repositório?
- [ ] Mensagem de sucesso aparece no console?
- [ ] Dados carregam corretamente?

## 🆘 Problemas comuns

### Erro: "Variáveis de ambiente Supabase não configuradas"

```
Verifique:
1. O arquivo .env existe?
2. Está preenchido com valores reais (não "sua_url_aqui")?
3. Reiniciou o servidor npm run dev?
```

### Erro: "CORS error" ou "Failed to fetch"

```
Solução:
1. Verifique a URL do Supabase está correta
2. Confirme que o projeto Supabase está online
3. Limpe cache: Ctrl+Shift+R (ou Cmd+Shift+R no Mac)
```

### Erro: "Unauthorized"

```
Solução:
1. Verifique se está usando a chave Anon (não Service Role)
2. Confirme as políticas RLS da tabela recebimentos
3. Verifique permissões no Supabase
```

## 📚 Referência completa de variáveis

| Variável | Tipo | Origem | Descrição |
|----------|------|--------|-----------|
| `VITE_SUPABASE_URL` | String | Supabase Settings > API | URL base do seu projeto Supabase |
| `VITE_SUPABASE_KEY` | String | Supabase Settings > API | Chave Anon para autenticação |

## 💡 Dica de Produção

Quando fazer deploy em produção (Vercel, Netlify, etc):

1. Adicione as variáveis no painel da plataforma:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`

2. A plataforma carregará automaticamente do `.env` em desenvolvimento e das variáveis de ambiente em produção

---

**Mantendo suas credenciais seguras! 🔒**
