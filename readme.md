
### USAGE WITH PROXY

pelase read this:

* [https://expressjs.com/en/guide/behind-proxies.html](https://expressjs.com/en/guide/behind-proxies.html)

#### API Server Requirements

* NodeJS ^16.x
* PostgreSQL 14.1
* PM2

#### Aditional Requiremnet

#### Tech Use

* Typescript
* ExpresJs
* Prisma
* Joi (Validation)

#### API Server Guide

1. Install packages
    * `npm install` development
    * `npm ci` production
2. Configure `.env` file
    * `cp .env.examples .env`
    * Fill out the config
3. Setup Database
    * `npx prisma migrate dev` make new migration files
    * `npx prisma migrate deploy` production
    * `npx prisma generate`
4. Build Source
    * `npm run build`
5. Run Script
    * `npm run dev` development
    * `npm run start` production

### Use behind proxy

Uncomment this code in `src/app.js`

```js
// app.set('trust proxy', 1);
```

number will be total count of proxy being used
