# 📦 Agendamento de Recebimento - SaaS Logística

Sistema web para gerenciar agendamentos de recebimento de materiais com integração ao Supabase.

## 🚀 Começando

### 1. **Instalação de Dependências**

```bash
npm install
```

### 2. **Configurar Variáveis de Ambiente**

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Preencha os valores do Supabase no arquivo `.env`:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=sua_chave_anon_do_supabase
```

**Como obter as credenciais:**
- Acesse [supabase.com](https://supabase.com)
- Faça login em sua conta
- Selecione seu projeto
- Vá em **Settings** → **API**
- Copie:
  - **Project URL** → `VITE_SUPABASE_URL`
  - **Anon Key** → `VITE_SUPABASE_KEY` (under "Project API keys")

### 3. **Criar a Tabela no Supabase**

No console do Supabase, crie a tabela `recebimentos` com a seguinte estrutura:

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

-- Habilitar Row Level Security (RLS)
ALTER TABLE recebimentos ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública (ajuste conforme necessário)
CREATE POLICY "Allow public read" ON recebimentos 
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON recebimentos 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON recebimentos 
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete" ON recebimentos 
  FOR DELETE USING (true);
```

### 4. **Iniciar o Servidor de Desenvolvimento**

```bash
npm run dev
```

O navegador abrirá automaticamente em `http://localhost:3000`

## 🔧 Troubleshooting

### ❌ "Variáveis de ambiente Supabase não configuradas"

**Solução:**
1. Verifique se o arquivo `.env` existe na raiz do projeto
2. Verifique se as chaves estão preenchidas corretamente
3. Reinicie o servidor `npm run dev`
4. Abra o Console do navegador (F12) para ver mais detalhes

### ❌ "Erro ao carregar dados: 42P01 - relation 'recebimentos' does not exist"

**Solução:**
- A tabela `recebimentos` não existe no banco de dados
- Execute o SQL acima para criar a tabela

### ❌ "Erro: Não autorizado"

**Solução:**
1. Verifique as políticas de segurança (RLS) da tabela
2. Certifique-se de que as políticas permitem acesso público ou ajuste conforme necessário
3. Verifique a chave Anon corretamente no `.env`

### ❌ "Conexão recusada" ou "Falha na conexão"

**Solução:**
1. Verifique sua conexão de internet
2. Verifique se a URL do Supabase está correta (sem espaços em branco)
3. Verifique se o projeto Supabase está online em [supabase.com](https://supabase.com)

## 📊 Funcionalidades

✅ Criar novo recebimento  
✅ Editar recebimentos existentes  
✅ Deletar recebimentos  
✅ Visualizar agenda de horários  
✅ Filtrar por data e status  
✅ Buscar por fornecedor, NF ou produto  
✅ Gráficos de status e fornecedor  
✅ Exportar para Excel  
✅ Modo escuro  
✅ Sincronização em tempo real com Supabase  

## 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Framework CSS:** Tailwind CSS
- **Bundler:** Vite
- **Banco de Dados:** Supabase (PostgreSQL)
- **Gráficos:** Chart.js
- **Export:** XLSX

## 📝 Estrutura do Projeto

```
.
├── index.html              # Página principal
├── vite.config.js          # Configuração Vite
├── package.json            # Dependências
├── .env                    # Variáveis de ambiente (não commit)
├── .env.example            # Template de variáveis
├── .gitignore              # Arquivos ignorados no Git
├── public/
│   └── manifest.json       # PWA Manifest
└── src/
    ├── css/
    │   └── style.css       # Estilos customizados
    ├── js/
    │   └── script.js       # Lógica principal
    └── assets/             # Imagens e recursos
```

## 🤝 Suporte

Para problemas, verifique:
1. Console do navegador (F12 → Aba Console)
2. O arquivo `.env` está preenchido corretamente
3. A tabela `recebimentos` existe no Supabase
4. As políticas de segurança estão configuradas

---

**Desenvolvido com ❤️ para logística eficiente**
