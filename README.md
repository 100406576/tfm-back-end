# tfm-back-end

[![Node Express - Tests](https://github.com/100406576/tfm-back-end/actions/workflows/node-test-sonar.yml/badge.svg)](https://github.com/100406576/tfm-back-end/actions/workflows/node-test-sonar.yml) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=100406576%3Atfm-back-end&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=100406576%3Atfm-back-end)

Este es un proyecto de backend para el TFM desarrollado con Node.js y Express.js.

## Requisitos

- Node.js
- npm

## Instalación

Primero, clona el repositorio:

```bash
git clone https://github.com/100406576/tfm-back-end.git
cd tfm-back-end
```

Luego, instala las dependencias:

```bash
npm install
```

## Configuración

Las variables de entorno son esenciales para la configuración del proyecto. Aquí te explicamos para qué sirve cada una:

- `PORT`: El puerto en el que se ejecutará el servidor. Por defecto es `3000`.
- `DB_HOST`El host de la base de datos. Por defecto es `"localhost"`.
- `DB_DATABASE`: El nombre de la base de datos. Por defecto es `"tfm_db"`.
- `DB_USERNAME`: El nombre de usuario para la base de datos. Por defecto es `"root"`.
- `DB_PASSWORD`:  La contraseña para la base de datos. Por defecto es `"1234"`.
- `DB_DIALECT`: El dialecto de la base de datos. Por defecto es `"mysql"`.
- `DB_PORT`: El puerto de la base de datos. Por defecto es `3306`.
- `JWT_SECRET`: Es la clave secreta que se utiliza para firmar y verificar los tokens JWT.

Estas variables deben ser definidas en los archivos `.env` y `.env.test` para los entornos de desarrollo y pruebas respectivamente.

## Scripts

- `npm run dev`: Inicia el servidor en modo desarrollo con nodemon.
- `npm start`: Inicia el servidor en modo producción.
- `npm test`: Ejecuta las pruebas con Jest.
- `npm run test:coverage`: Ejecuta las pruebas y genera un informe de cobertura.
- `npm run test:unit`: Ejecuta solo las pruebas unitarias.
- `npm run test:integration`: Ejecuta solo las pruebas de integración.