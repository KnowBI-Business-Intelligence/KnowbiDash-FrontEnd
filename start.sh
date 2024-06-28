export $(grep -v '^#' .env | xargs)

#docker compose down

#docker compose up --build --force-recreate --remove-orphans

sudo docker compose down

sudo docker compose up -d --build --force-recreate --remove-orphans