# PT-2021-Battleships

## Obecnie zawiera szkielet aplikacji do rozwoju.

### Zawartość

Obecnie:
- Połączenie z docelową bazą danych MongoDB
- Po dostęp do bazy zgłaszać się do mnie (bez URI oraz whitelisty IP nie wejdziecie)
- Brak połączenia między klientem a serwerem
- Serwer uruchamiany na porcie 9000
- Klient uruchamiany na porcie 3000
- Ustawiony setup pod React (client) i Express (server)
- Obsługa bazy danych przez `mongoose`

Work in Progress:
- Połączenie pomiędzy klientem a serwerem (CORS)
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
