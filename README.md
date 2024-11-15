# Fiap - Avaliação

## - Instalação das dependências

- BACK-END
    
    Ao baixar o projeto, devemos abri-lo em uma IDE de sua preferência e através do terminal rodamos o comando:
    
    ```
    composer install
    ```
    

- FRONT-END
    
    Após baixar o projeto, abrimos em uma IDE de sua preferência e também através do terminal rodamos o comando:
    
    ```
    npm install
    ```
    
    Caso queira fazer através do terminal de sua máquina, basta navegar até a pasta pelos comandos “cd <pasta>/<…>/<pasta-do-projeto>”. Ambos os comandos e instalações funcionarão da mesma forma.
    

## - Configuração da Base de Dados

Na pasta do projeto que se encontra o Back-end, teremos o arquivo *.env.example.* Basta duplicá-lo e renomear para .env, abra o arquivo e vá até a seção que estão as variáveis de conexão com o banco e mude conforme a necessidade:

```
DB_CONNECTION=mysql
DB_HOST=<endereço do banco, localhost ou remoto>
DB_PORT=3306
DB_DATABASE=<nome da sua base>
DB_USERNAME=<seu usuário>
DB_PASSWORD=<sua senha>
```

```
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=localhost
SESSION_SAME_SITE=lax
```

Na seção acima temos as configurações que podem ocasionar em bloqueio de algumas requisições, caso tenha problemas e esteja acessando de um sistema remoto, basta trocar o SESSION_DOMAIN=.domain.com que pode ser que resolva.

Após as configurações do arquivo .env teremos que rodar um comando no terminal dentro dessa pasta do projeto:

```
php artisan jwt:secret
```

Com esse comando ele irá gerar uma variável JWT_SECRET no seu arquivo .env para que a autenticação seja feita. 

OBS.: Provavelmente o usuário pré definido no arquivo dump.sql não funcione pois foi gerado com outra chave, caso realmente não autentique, basta rodas esse comando no terminal trocando os dados pelos de sua escolha:

```
curl -X POST http://127.0.0.1:8000/api/user \ 
-H "Content-Type: application/json" \
-d '{
    "name": "Seu nome",   
    "email": "seuemail@example.com",
    "password": "123456",  
    "password_confirmation": "123456"   
}'
```

Lembrando que a senha tem que ter no mínimo 6 caracteres!!!

Com esses passos finalizamos as configurações básicas para iniciar o projeto.

## - Inicialização dos projetos

Sem muito segredo, abrimos o projeto do back-end em uma IDE e pelo terminal da própria IDE rodamos o comando:

```
php artisan serve
```

A aplicação irá servir no endereço [*http://127.0.0.1:8000](http://127.0.0.1:8000)* 

Assumindo que vc esteja fazendo a build na própria máquina.

Após essa etapa, podemos abrir no terminal da máquina a pasta do projeto de front-end e rodar o comando:

```
ng serve
```

Caso tenha o angular-cli instalado em sua máquina, senão podemos rodar o comando:

```
npm start
```

Com isso basta acessar o link que foi gerado no terminal para acessar o front, nesse caso [*http://localhost:4200](http://localhost:4200),* e navegar pelo sistema*.*

<aside>
🚨

Caso o back-end sirva em uma porta diferente da 8000, poderá tentar limpar qualquer serviço que esteja na porta e servir novamente, ou caso rode em outra porta, deverá procurar e fazer um replace de todas as ocorrências do [http://127.0.0.1:8000](http://127.0.0.1:8000) que encontre no front-end

</aside>

# Links