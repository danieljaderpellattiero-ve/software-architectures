# MongoDB

> :grey_exclamation: Make sure you have [Docker](https://docs.docker.com/desktop/) (Desktop) installed on your machine.  
> :grey_exclamation: To inspect the database, you can use [MongoDB Compass](https://www.mongodb.com/try/download/compass).

## Setting up the containers

```bash
docker compose -f compose.yaml up -d
```

## Stop and restart the containers

```bash
docker compose stop
docker compose start
```

## Clean up the containers

```bash
docker compose down -v
```

> :warning: This command will clean up: containers, networks and both anonymous and named volumes.
