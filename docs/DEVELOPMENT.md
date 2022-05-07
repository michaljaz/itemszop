
# Poradnik dla dewelopera

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/michaljaz/itemszop)
[![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/michaljaz/itemszop)
[![Deploy with heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/michaljaz/itemszop)


## Konfiguracja budowania

```bash
# Instalowanie bibliotek
$ npm install

############ KONFIGURACJA DEWELOPERA ############
# używając nuxta
$ npm run dev

# używając netlify
$ netlify dev

############ KONFIGURACJA PRODUKCYJNA ############
# Budowanie aplikacji
$ npm run build

# Hostowanie na porcie 8080
$ npm start

```
Aby uzyskać szczegółowe wyjaśnienie, jak to działa, sprawdź [dokumentację](https://nuxtjs.org).

## Własne hostowanie

> **_Ważne:_**  Pamiętaj, że nie potrzebujesz stawiać własnego sklepu. Możesz po prostu skorzystać z modelu SaaS.

1. Skonfiguruj własną bazę danych firebase
[(link do dokumentacji)](https://github.com/michaljaz/itemszop/wiki/Utworzenie-i-konfiguracja-sklepu-z-w%C5%82asn%C4%85-baz%C4%85-Firebase).

2. Wygeneruj zmienną środowiskową wywołując plik ```misc/scripts/env_generator.js``` z podmienionymi wartościami z punktu 1.

##### Opcja 1 - użycie serwisów takich jak Cloudflare, Vercel, Netlify, Heroku lub Glitch

3. Zrób forka głównego repozytorium.

4. Połącz swoje repozytorium z panelem na danym serwisie.

5. Podczas konfiguracji, zapisz wartość punktu 2 w zmiennej środowiskowej projektu `FIREBASE_CONFIG`.

6. Gotowe!

##### Opcja 2 - hostowanie na własnym vps'ie lub innej maszynie.

3. Sklonuj repozytorium

4. Zapisz zmienną środowiskową `FIREBASE_CONFIG` w pliku `.env` w roocie projektu.

5. Wpisz kolejno komendy `npm install`, `npm run build`

6. Aby włączyć serwer wywołaj komendę `npm start` (najlepiej w tle używając np. screen)

7. Gotowe!

##### Jak to działa?
- Nowo powstały projekt działa tak samo jak strona główna Itemszopu, ale już łączy się do Twojej własnej bazy i ma swoich własnych użytkowników.

- Jeśli chcesz, żeby twój sklep był tylko hostowany w 'roocie' projektu, to wystarczy dodać zmienną środowiskową ```SINGLE_SHOP``` o wartości id sklepu.

- Istnieje również możliwość zablokowania możliwości tworzenia sklepów wszystkim użytkownikom, oprócz jednego. Wówczas trzeba zapisać zmienną środowiskową ```OWNER_ID``` o wartości id użytkownika (wziętym z bazy firebase).

## Limity na darmowych hostingach

### statyczna strona + serverlessowe funkcje

| Limit wysyłanych requestów | Cloudflare | Vercel | Netlify |
| --- | --- | --- | --- |
| Serverlessowe funkcje | 100k / dzień | 100k / dzień | 125k / miesiąc |
| Statyczna strona | bez limitu | bez limitu | bez limitu |

### serwer node.js

|| Heroku | Glitch |
| --- | --- | --- |
| Maksymalny czas działania | 550h / miesiąc | 1000h / miesiąc |
