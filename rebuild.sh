docker-compose build && docker-compose push && docker stack deploy -c docker-compose.yml osf --resolve-image always --with-registry-auth
