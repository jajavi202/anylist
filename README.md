<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

# Dev

1. Clonar el repositorio.
2. Copiar el ```.env.template``` y renombrar a ```.env```.
3. Instalar dependencias.

```bash
npm i
```

4. Levantar la imagen.

```bash
docker-compose up -d
```

5. Levantar el backend de Nest

```bash
npm run start:dev
```

6. Abrir el playground de graphql.

```curl
localhost:3000/graphql
```
