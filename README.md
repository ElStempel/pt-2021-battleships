# PT-2021-Battleships

## Działający backend oraz szkielet frontend do rozwoju. Następnie wykonany zostanie moduł gry.

### Zawartość

Obecnie:
- Połączenie z docelową bazą danych MongoDB
- Po dostęp do bazy zgłaszać się do mnie (bez URI oraz whitelisty IP nie wejdziecie)
- CORS działa - można wywołać połączenie z serwerem przez klienta - localhost:9000/testing
- Serwer uruchamiany na porcie 9000
- Klient uruchamiany na porcie 3000
- Ustawiony setup pod React (client) i Express (server)
- Obsługa bazy danych przez `mongoose`
- Routing gotowy
- Przejście na HTTPS gotowe
- Komunikacja z bazą danych działa

Work in Progress:
- Frontend ekrany
- Łączenie z backend

To do:
- Moduł gry
- socket

### Uruchamianie

Przy uruchamianiu klienta:
- `cd client`
- `npm install`
- `npm start`

Przy uruchamianiu serwera:
- `cd server`
- `npm install`
- `nodemon` (jeśli nie zadziała to `npm install nodemon -g` i powtórzyć krok)
