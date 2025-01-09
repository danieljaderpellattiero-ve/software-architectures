# Backend service

> :grey_exclamation: Make sure you have [Docker](https://docs.docker.com/desktop/) (Desktop) installed on your machine.  
> :grey_exclamation: To inspect the database, you can use [MongoDB Compass](https://www.mongodb.com/try/download/compass).

## How to run it

### Start the MongoDB service

```bash
docker compose -f compose.yaml up -d # first time
docker compose start # subsequent times
```

> If you want to stop the service, you can use `docker compose stop`.  
> If you want to remove the service, you can use `docker compose down -v`. (:warning: **containers, networks and volumes will be removed** :warning:)

### Start the Express service

```bash
npm install # install the dependencies (first time)
npm run start # start the server
```

## Postman collection

:grey_exclamation: You can find the Postman collection in the [folder](./postman), and import it into your Postman application to test the endpoints.
