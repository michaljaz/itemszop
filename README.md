# itemszop

[![Discord](https://img.shields.io/badge/discord-%237289DA.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/invite/Nx28v3yAER)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/michaljaz/itemszop)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/michaljaz/itemszop)

**ItemSzop to sklep twojego serwera minecraftowego za darmo!** Działa dzięki złożeniu serverless'owych funkcji z hostowaniem statycznych plików co umożliwia [Vercel](https://vercel.com/) i [Netlify](https://www.netlify.com/). Nie wymaga żadnej instalacji - model SaaS. Serwis jest zrobiony we frameworku [Nuxt.js](https://nuxtjs.org/). Uwierzytelnianie użytkowników i zapisywanie konfiguracji sklepów odbywa się za pośrednictwem bazy danych [Firebase](https://firebase.google.com/). Dodatkowo użyty jest framework [Vuetify](https://vuetifyjs.com/) do ładnych stylów strony.

## Wersja produkcyjna

Tu znajduje się link do wersji produkcyjnej na vercelu : https://itemszop.tk

## Wspierani operatorzy płatności

- [x] microsms.pl - [api przelew](https://microsms.pl/documents/przelewy_online.pdf), [api sms](https://microsms.pl/kernel/Mails/files/dokumentacja_techniczna_mirosms.pdf)
- [x] lvlup.pro - [api](https://api.lvlup.pro/v4/redoc)
- [ ] hotpay.pl - [api](https://hotpay.pl/dokumentacja-api/)
- [ ] cashbill.pl - [api](https://www.cashbill.pl/pobierz/api/)
- [ ] paypal.com

## Konfiguracja dewelopera

```bash
# Instalowanie bibliotek
$ npm install

# serwowanie z hot reaload'em localhost:8080
$ npm run dev

```

Aby uzyskać szczegółowe wyjaśnienie, jak to działa, sprawdź [dokumentację](https://nuxtjs.org).

## Docker

Skrypt, który uruchamia dockera z wersją produkcyjną itemszopu: https://github.com/michaljaz/itemszop/blob/master/misc/skrypt_docker.sh

## Własne hostowanie (w razie pytań - dsc)

1. Skonfiguruj własną bazę danych firebase
[(link do dokumentacji)](https://github.com/michaljaz/itemszop/wiki/Utworzenie-i-konfiguracja-sklepu-z-w%C5%82asn%C4%85-baz%C4%85-Firebase).
2. Wygeneruj zmienną środowiskową wywołując plik ```misc/env_generator.js``` z podmienionymi wartościami z punktu 1.
3. [Sklonuj projekt na vercelu](https://vercel.com/new/clone?repository-url=https://github.com/michaljaz/itemszop) / [Sklonuj projekt na netlify](https://app.netlify.com/start/deploy?repository=https://github.com/michaljaz/itemszop).
4. Zapisz tą wartość punktu 2 w zmiennej środowiskowej projektu ```FIREBASE_CONFIG```.
5. Gotowe!

**Jak to działa?**

Nowo powstały projekt działa tak samo jak strona główna Itemszopu, ale już łączy się do Twojej własnej bazy i ma swoich własnych użytkowników.

Jeśli chcesz, żeby twój sklep był tylko hostowany w 'roocie' projektu, to wystarczy dodać zmienną środowiskową ```SINGLE_SHOP``` o wartości id sklepu.
