# PT-2021-Battleships

## Obecnie zawiera szkielet aplikacji do rozwoju.

### Zawartość

Obecnie:
- Połączenie z docelową bazą danych MongoDB
- Po dostęp do bazy zgłaszać się do mnie (bez URI oraz whitelisty IP nie wejdziecie)
- CORS działa - można wywołać połączenie z serwerem przez klienta - [URL do testowania](localhost:9000/testing)
- Serwer uruchamiany na porcie 9000
- Klient uruchamiany na porcie 3000
- Ustawiony setup pod React (client) i Express (server)
- Obsługa bazy danych przez `mongoose`

Work in Progress:
- Szkielet routingu
- Szkielet struktury bazy danych

### Uruchamianie

Do pierwszego uruchomieniem klienta:
- `cd client`
- `npm install`
- `npm start`

Do pierwszego uruchomienia serwera:
- `cd server`
- `npm install`
- `nodemon`
