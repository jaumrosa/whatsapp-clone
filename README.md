<div align="center">

# 💬 WhatsApp Clone

Clone funcional do WhatsApp Web com autenticação Google, mensagens em tempo real, suporte a mídia e notificações — construído com JavaScript puro, Firebase e Firestore.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat&logo=javascript)
![Firebase](https://img.shields.io/badge/Firebase-12.x-FFCA28?style=flat&logo=firebase)
![Webpack](https://img.shields.io/badge/Webpack-5.x-8DD6F9?style=flat&logo=webpack)
![License](https://img.shields.io/badge/License-ISC-green?style=flat)

</div>

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#-pré-requisitos)
- [Configuração do Firebase](#-configuração-do-firebase)
- [Instalação](#-instalação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Rodando o Projeto](#-rodando-o-projeto)
- [Deploy do Cloud Function](#-deploy-do-cloud-function)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Usar](#-como-usar)
- [Arquitetura](#-arquitetura)

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 🔐 **Login com Google** | Autenticação via Firebase Auth com pop-up Google |
| 💬 **Mensagens de texto** | Envio e recebimento em tempo real via Firestore |
| 🖼️ **Envio de imagens** | Seleção da galeria ou captura pela câmera |
| 📷 **Câmera integrada** | Tira foto diretamente pelo navegador e envia |
| 📄 **Envio de documentos** | Suporte a PDF, Word, Excel, PowerPoint |
| 🎤 **Mensagens de áudio** | Gravação de voz direto no app |
| 😀 **Emojis** | Painel de emojis integrado |
| 👤 **Compartilhar contato** | Envia card de contato na conversa |
| 🔔 **Notificações push** | Notificação nativa do navegador ao receber mensagem |
| ✅ **Status de leitura** | Ícones de aguardando, enviado, recebido e lido |
| 🔍 **Busca de contatos** | Filtragem em tempo real na lista |
| 🕐 **Última mensagem** | Preview e horário na lista de conversas |
| ✏️ **Edição de perfil** | Alteração de nome e foto de perfil |

---

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) **v20 ou superior**
- [npm](https://www.npmjs.com/) (já vem com o Node.js)
- [Firebase CLI](https://firebase.google.com/docs/cli)

```bash
# Instalar o Firebase CLI globalmente
npm install -g firebase-tools

# Verificar a instalação
firebase --version
node --version
```

---

## 🔥 Configuração do Firebase

### 1. Criar o projeto no Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"**
3. Dê um nome ao projeto e conclua o assistente de criação

---

### 2. Ativar a Autenticação com Google

1. No console, vá em **Authentication → Sign-in method**
2. Clique em **Google** e ative
3. Salve

---

### 3. Configurar o Firestore

1. Vá em **Firestore Database → Criar banco de dados**
2. Escolha o modo **Produção** (ou Teste para desenvolvimento)
3. Selecione a região e confirme
4. Após criar, vá em **Regras** e configure:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Usuários: somente o próprio usuário lê/escreve
    match /users/{userId} {
      allow read, write: if request.auth != null;

      // Contatos do usuário
      match /contacts/{contactId} {
        allow read, write: if request.auth != null;
      }
    }

    // Chats: somente participantes acessam
    match /chats/{chatId} {
      allow read, write: if request.auth != null;

      // Mensagens do chat
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

---

### 4. Configurar o Storage

1. Vá em **Storage → Começar**
2. Aceite as regras padrão e selecione a região
3. Após criar, vá em **Regras** e configure:

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

### 5. Obter as credenciais do projeto

1. No console, clique em ⚙️ **Configurações do projeto → Geral**
2. Em **Seus apps**, clique em **`</>`** para adicionar um app Web
3. Registre o app e copie o objeto `firebaseConfig`:

```js
// Exemplo do formato das credenciais
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXX"
};
```

---

### 6. Ativar o Firebase Analytics *(opcional)*

Na criação do app web, você pode ativar o Google Analytics — necessário para o campo `measurementId`.

---

## 📦 Instalação

### Frontend

```bash
# Clone o repositório
git clone https://github.com/jaumrosa/whatsapp-clone.git
cd whatsapp-clone

# Instale as dependências do projeto principal
npm install
```

### Cloud Functions

```bash
# Entre na pasta de functions e instale as dependências
cd functions
npm install
cd ..
```

---

## 🔑 Variáveis de Ambiente

Crie um arquivo **`.env`** na raiz do projeto (mesmo nível de `index.html`) copiando o exemplo:

```bash
cp .env.example .env
```

Preencha com as credenciais obtidas no passo 5 da configuração do Firebase:

```env
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu-projeto
FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef123456
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

> ⚠️ **Nunca** commite o arquivo `.env` no Git. Ele já está no `.gitignore`.

---

## 🚀 Rodando o Projeto

### Login no Firebase CLI

```bash
# Faça login com sua conta Google
firebase login

# Vincule o projeto (só precisa fazer uma vez)
firebase use --add
```

### Iniciar o servidor de desenvolvimento

```bash
# Na raiz do projeto
npm start
```

Acesse no navegador: **[http://localhost:8080](http://localhost:8080)**

O Webpack Dev Server faz hot-reload automático ao salvar arquivos.

---

## ☁️ Deploy do Cloud Function

O Cloud Function `saveLastMessage` é responsável por atualizar a **última mensagem** e o **horário** na lista de contatos sempre que uma nova mensagem é enviada.

### Deploy

```bash
# Na raiz do projeto
firebase deploy --only functions
```

### Verificar logs em tempo real

```bash
firebase functions:log --only saveLastMessage
```

### ✅ Log de sucesso esperado

```
[CHAT ID]    abc123xyz
[MESSAGE ID] msgId456
[MESSAGE DATA] { content: 'oi', type: 'text', from: 'user@email.com' }
[FROM] user@email.com
[TO]   contato@email.com
[FINISH] 2026-05-28T...
```

> ⚠️ Se aparecer `[ERROR] Chat não encontrado`, consulte a seção de [troubleshooting](#-troubleshooting).

---

## 📁 Estrutura do Projeto

```
whatsapp-clone/
│
├── 📄 index.html                  # Página principal (HTML)
├── 📄 .env                        # Variáveis de ambiente (não commitar!)
├── 📄 .env.example                # Modelo das variáveis de ambiente
├── 📄 webpack.config.cjs          # Configuração do Webpack
├── 📄 firebase.json               # Configuração do Firebase CLI
│
├── 📁 src/
│   ├── 📄 app.js                  # Ponto de entrada da aplicação
│   │
│   ├── 📁 controller/
│   │   ├── 📄 WhatsappController.js   # Controlador principal (UI + eventos)
│   │   ├── 📄 CameraController.js     # Captura de fotos pela câmera
│   │   ├── 📄 MicrophoneController.js # Gravação de áudio
│   │   ├── 📄 DocumentPreviewController.js # Preview de documentos
│   │   └── 📄 ContactsController.js   # Modal de seleção de contatos
│   │
│   ├── 📁 model/
│   │   ├── 📄 Model.js            # Classe base com eventos e toJSON
│   │   ├── 📄 User.js             # Model do usuário (auth + contatos)
│   │   ├── 📄 Chat.js             # Model do chat (criação e busca)
│   │   └── 📄 Message.js          # Model da mensagem (envio + renderização)
│   │
│   └── 📁 utils/
│       ├── 📄 Firebase.js         # Inicialização do Firebase
│       ├── 📄 Format.js           # Formatação de datas e textos
│       ├── 📄 ClassEvent.js       # Sistema de eventos customizados
│       ├── 📄 Upload.js           # Upload de arquivos para o Storage
│       └── 📄 Base64.js           # Conversão Base64 para File
│
├── 📁 functions/
│   ├── 📄 index.js                # Cloud Function: saveLastMessage
│   └── 📄 package.json
│
├── 📁 css/
│   └── 📄 style.css               # Estilos globais
│
├── 📁 img/                        # Imagens e assets estáticos
└── 📁 audio/
    └── 📄 alert.mp3               # Som de notificação
```

---

## 📱 Como Usar

### 1. Login
- Abra o app em `http://localhost:8080`
- Clique no botão de login e autentique com sua conta Google
- Seu nome e foto serão carregados automaticamente

### 2. Adicionar um contato
- Clique no ícone de **novo contato** (ícone de lápis/chat) no topo esquerdo
- Digite o **e-mail Google** de quem deseja adicionar
- O contato precisa ter feito login no app ao menos uma vez
- Clique em **Adicionar**

### 3. Enviar mensagens
| Ação | Como fazer |
|---|---|
| **Texto** | Digite na caixa e pressione `Enter` ou clique em ✈️ |
| **Emoji** | Clique no ícone 😀 e selecione |
| **Imagem** | Clique em 📎 → Foto |
| **Câmera** | Clique em 📎 → Câmera, tire a foto e envie |
| **Documento** | Clique em 📎 → Documento |
| **Áudio** | Clique e segure 🎤, grave e solte para enviar |
| **Contato** | Clique em 📎 → Contato |

### 4. Notificações
- Na primeira mensagem recebida, o navegador solicitará permissão de notificação
- Clique no **banner amarelo** para conceder permissão
- Notificações aparecem quando o app está em segundo plano

### 5. Editar perfil
- Clique na sua foto no canto superior esquerdo
- Altere seu nome ou foto de perfil

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────┐
│                  NAVEGADOR                       │
│                                                  │
│   index.html → app.js → WhatsAppController       │
│                              │                   │
│         ┌────────────────────┼───────────────┐   │
│         ▼                    ▼               ▼   │
│    User Model          Chat Model      Message   │
│    (auth/contatos)     (criação)       Model     │
│         │                    │               │   │
└─────────┼────────────────────┼───────────────┼───┘
          │                    │               │
          ▼                    ▼               ▼
┌─────────────────────────────────────────────────┐
│               FIREBASE SERVICES                  │
│                                                  │
│  Auth (Google)   Firestore        Storage        │
│  ─────────────   ─────────────    ──────────     │
│  Login/Logout    users/           Imagens        │
│                  chats/           Áudios         │
│                  messages/        Documentos     │
└─────────────────────────────────────────────────┘
          │
          ▼ (onDocumentCreated trigger)
┌─────────────────────────────────────────────────┐
│            CLOUD FUNCTION (Node.js 20)           │
│                                                  │
│  saveLastMessage                                 │
│  ─────────────────────────────────────────────  │
│  Atualiza lastMessage + lastMessageTime em       │
│  users/{email}/contacts/{contactId}              │
│  para remetente E destinatário                   │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### ❌ `[ERROR] Chat não encontrado` nos logs do Cloud Function

O documento do chat é um **ghost document** (foi deletado manualmente no Firestore, mas as mensagens permaneceram). A versão atual do `functions/index.js` já tem o fallback que resolve isso automaticamente — basta fazer o deploy.

```bash
firebase deploy --only functions
```

### ❌ `lastMessage` e `lastMessageTime` não aparecem

Verifique se aplicou as três correções no código:

1. **`src/model/User.js`** → `addContact()` deve usar `{ merge: true }`
2. **`src/utils/Format.js`** → `timeStamptoTime()` deve suportar `Date` nativo
3. **`functions/index.js`** → deve ter o fallback para ghost documents

### ❌ Erro de CORS ou autenticação

- Confirme que o domínio `localhost` está autorizado em **Firebase Console → Authentication → Domínios autorizados**

### ❌ Webpack não encontra as variáveis de ambiente

- Verifique se o arquivo `.env` existe na raiz (mesmo nível de `index.html`)
- Reinicie o servidor: `npm start`

---

## 👤 Autor

**João Pedro Rosa**
- GitHub: [@jaumrosa](https://github.com/jaumrosa)
