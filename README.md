# itemszop

[![Discord](https://img.shields.io/badge/chat-on%20discord-brightgreen.svg)](https://discord.com/invite/Nx28v3yAER)

**ItemSzop to sklep twojego serwera minecraftowego za darmo!** Działa dzięki złożeniu serverless'owych funkcji z hostowaniem statycznych plików co umożliwia [Vercel](https://vercel.com/). Nie wymaga żadnej instalacji - model SaaS. Serwis jest zrobiony we frameworku [Nuxt.js](https://nuxtjs.org/). Uwierzytelnianie użytkowników i zapisywanie konfiguracji sklepów odbywa się za pośrednictwem bazy danych [Firebase](https://firebase.google.com/). Dodatkowo użyty jest framework [Vuetify](https://vuetifyjs.com/) do ładnych stylów strony.

## Wspierani operatorzy płatności

- [x] microsms.pl - [api przelew](https://microsms.pl/documents/przelewy_online.pdf), [api sms](https://microsms.pl/kernel/Mails/files/dokumentacja_techniczna_mirosms.pdf)
- [x] lvlup.pro - [api](https://api.lvlup.pro/v4/redoc)
- [ ] hotpay.pl - [api](https://hotpay.pl/dokumentacja-api/)
- [ ] cashbill.pl - [api](https://www.cashbill.pl/pobierz/api/)
- [ ] paypal.com

## Wersja produkcyjna

Tu znajduje się link do wersji produkcyjnej : https://itemszop.tk

## Konfiguracja dewelopera

```bash
# Instalowanie bibliotek
$ npm install

# serwowanie z hot reaload'em localhost:8080
$ npm run dev

```

Aby uzyskać szczegółowe wyjaśnienie, jak to działa, sprawdź [dokumentację](https://nuxtjs.org).

## Własne hostowanie
1. Sklonuj projekt na vercelu [(link)](https://vercel.com/new/clone?repository-url=https://github.com/michaljaz/itemszop).
2. Skonfiguruj własną bazę danych firebase
[(link do dokumentacji)](https://github.com/michaljaz/itemszop/wiki/Konfiguracja-sklepu-z-w%C5%82asn%C4%85-baz%C4%85-firebase).
3. Wygeneruj zmienną środowiskową wywołując plik ```misc/env_generator.js``` z podmienionymi wartościami z punktu 2.
4. Zapisz tą wartość punktu 3 w zmiennej środowiskowej ```FIREBASE_CONFIG```, oraz w zmiennej ```BASE_URL``` adres url vercelowego projektu (W zmiennych środowiskowych projektu).
5. Zredeployuj projekt na vercelu.

- Nowo powstały projekt działa tak samo jak strona główna Itemszopu, ale już łączy się do Twojej własnej bazy i ma swoich własnych użytkowników.

- Jeśli chcesz, żeby twój sklep był tylko hostowany w 'roocie' projektu, to wystarczy dodać zmienną srodowiskową ```SINGLE_SHOP``` o wartości id sklepu. (Wtedy nie działa panel, jeśli chcesz wrócić do panelu musisz skasować zmienną ```SINGLE_SHOP```.
