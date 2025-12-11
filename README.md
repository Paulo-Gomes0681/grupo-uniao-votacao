🗳️ Sistema de Votação – Grupo União (2026)

Aplicação web desenvolvida para organizar a votação anual do Grupo União, permitindo cadastrar atletas, controlar votos, contabilizar resultados e exibir o ranking final de forma totalmente automatizada.

Este sistema foi criado para ser usado no evento oficial do Grupo União, garantindo segurança, transparência e praticidade no processo eleitoral interno.

🚀 Tecnologias Utilizadas

React.js

Vite (ambiente de desenvolvimento rápido)

TailwindCSS (estilização responsiva)

Lucide Icons (ícones modernos)

Vercel (deploy automático)

📱 Funcionalidades Principais
✔️ Cadastro de Participantes

Adicione quantos participantes quiser.

Ordem alfabética automática.

Exclusão individual antes do início da votação.

✔️ Regra Especial: Jorginho

Quando o nome JORGINHO é adicionado, ele recebe status:

Diretor

Pode votar

Não pode receber votos

✔️ Sistema de Votação

Cada participante pode votar uma única vez.

Cada eleitor deve escolher exatamente 5 candidatos.

Ninguém pode votar em si mesmo.

Diretores (como Jorginho) não aparecem para serem votados.

Interface limpa e responsiva para facilitar em celulares.

✔️ Controle de Segurança

Botão Encerrar Votação protegido por senha: 062881

Evita encerramento acidental por qualquer pessoa.

✔️ Resultados Automáticos

Mostra o Presidente eleito (mais votado).

Exibe os Top 5 mais votados.

Classificação completa de todos os participantes.

Botão para iniciar nova votação do zero.

🌐 Responsividade Completa

O sistema foi projetado para funcionar perfeitamente em:

Celulares

Tablets

Laptops

TVs grandes

Comportamento adaptado automaticamente em todas as telas.

🛠️ Como Rodar o Projeto Localmente
1. Clone o repositório:
git clone https://github.com/Paulo-Gomes0681/grupo-uniao-votacao.git
cd grupo-uniao-votacao

2. Instale as dependências:
npm install

3. Rode o servidor de desenvolvimento:
npm run dev


Acesse no navegador:
👉 http://localhost:5173

🚀 Deploy

Este projeto está hospedado com deploy automático via Vercel.

Cada alteração enviada para a branch main dispara um novo build.

📸 Capturas de Tela (opcional)

Você pode adicionar aqui prints das telas:

Tela inicial

Tela de escolha do votante

Tela de votação

Tela de resultados

Se quiser, eu também preparo as imagens bonitinhas para adicionar no README.

📦 Estrutura do Projeto
/
├── public/
│   └── logo do Grupo União
├── src/
│   ├── App.jsx   ← código principal da aplicação
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md

👨‍💻 Autor

Projeto desenvolvido por Paulo Gomes, Grupo União – Jardim Atlântico.

⭐ Contribuições

Melhorias e sugestões são bem-vindas.
Para contribuir, basta abrir uma issue ou fazer um pull request.

🔒 Licença

Uso interno exclusivo do Grupo União.