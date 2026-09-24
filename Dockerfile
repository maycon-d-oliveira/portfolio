FROM node:22-alpine

WORKDIR /app

# Instala o Angular CLI globalmente se necessário
RUN npm install -g @angular/cli

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200

# Executa o servidor de desenvolvimento escutando em todas as interfaces com polling ativado
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]