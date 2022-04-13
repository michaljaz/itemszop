# itemszop

[![Discord](https://img.shields.io/badge/discord-%237289DA.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/invite/Nx28v3yAER)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/michaljaz/itemszop)
[![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/michaljaz/itemszop)
[![Deploy with heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/michaljaz/itemszop)

**ItemSzop to sklep twojego serwera minecraftowego za darmo!** Działa dzięki złożeniu serverless'owych funkcji z hostowaniem statycznych plików. Nie wymaga żadnej instalacji - model SaaS. Serwis jest zrobiony we frameworku [Nuxt.js](https://nuxtjs.org/). Uwierzytelnianie użytkowników i zapisywanie konfiguracji sklepów odbywa się za pośrednictwem bazy danych [Firebase](https://firebase.google.com/). Dodatkowo użyty jest framework [Vuetify](https://vuetifyjs.com/) do ładnych stylów strony.

## Wersja produkcyjna

Tu znajduje się link do wersji produkcyjnej na cloudflare : https://itemszop.tk.

## Wspierani operatorzy płatności

- [x] microsms.pl - [api przelew](https://microsms.pl/documents/przelewy_online.pdf), [api sms](https://microsms.pl/kernel/Mails/files/dokumentacja_techniczna_mirosms.pdf)
- [X] paypal.com - [api p24](https://developer.paypal.com/docs/checkout/apm/przelewy24/)
- [x] lvlup.pro - [api](https://api.lvlup.pro/v4/redoc)
- [ ] hotpay.pl - [api](https://hotpay.pl/dokumentacja-api/)
- [ ] cashbill.pl - [api](https://www.cashbill.pl/pobierz/api/)


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

## Własne hostowanie - Cloudflare, Vercel, Netlify, Heroku

> **_Ważne:_**  Pamiętaj, że nie potrzebujesz stawiać własnego sklepu. Możesz po prostu skorzystać z modelu SaaS

1. Skonfiguruj własną bazę danych firebase
[(link do dokumentacji)](https://github.com/michaljaz/itemszop/wiki/Utworzenie-i-konfiguracja-sklepu-z-w%C5%82asn%C4%85-baz%C4%85-Firebase).
2. Wygeneruj zmienną środowiskową wywołując plik ```misc/scripts/env_generator.js``` z podmienionymi wartościami z punktu 1.
3. Zrób forka głównego repozytorium
4. Połącz swoje repozytorium z panelem na danym serwisie.
5. Podczas konfiguracji, zapisz wartość punktu 2 w zmiennej środowiskowej projektu ```FIREBASE_CONFIG```.
6. Gotowe!

- Nowo powstały projekt działa tak samo jak strona główna Itemszopu, ale już łączy się do Twojej własnej bazy i ma swoich własnych użytkowników.

- Jeśli chcesz, żeby twój sklep był tylko hostowany w 'roocie' projektu, to wystarczy dodać zmienną środowiskową ```SINGLE_SHOP``` o wartości id sklepu.

- Istnieje również możliwość zablokowania możliwości tworzenia sklepów wszystkim użytkownikom, oprócz jednego. Wówczas trzeba zapisać zmienną środowiskową ```OWNER_ID``` o wartości id użytkownika (wziętym z bazy firebase).

## Limity

ItemSzop działa jako statyczna strona. Dzięki temu hostowanie sklepu jest praktycznie dostępne za darmo na serwisach takich jak Cloudflare. Jednak wszystkie operacje nie mogą być wykonywane po stronie klienta. W tym momencie można skorzystać z serverlessowych funkcji, które umożliwią nam wykonywanie takich operacji jak np. księgowanie płatności, lub wywoływanie komend na serwerze mc.

| Serverlessowe funkcje | Cloudflare | Vercel | Netlify |
| --- | --- | --- | --- |
| Limit wysyłanych requestów | 100k / dzień | 100k / dzień | 125k / miesiąc |
