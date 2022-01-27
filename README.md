# itemszop

[![Discord](https://img.shields.io/badge/chat-on%20discord-brightgreen.svg)](https://discord.com/invite/Nx28v3yAER)

**ItemSzop to sklep twojego serwera minecraftowego za darmo!** Działa dzięki złożeniu serverless'owych funkcji z hostowaniem statycznych plików co umożliwia [Vercel](https://vercel.com/). Nie wymaga żadnej instalacji - model SaaS. Serwis jest zrobiony we frameworku [Nuxt.js](https://nuxtjs.org/). Uwierzytelnianie użytkowników i zapisywanie konfiguracji sklepów odbywa się za pośrednictwem bazy danych [Firebase](https://firebase.google.com/). Dodatkowo użyty jest framework [Vuetify](https://vuetifyjs.com/) do ładnych stylów strony.

## Wersja produkcyjna

Tu znajduje się link do wersji produkcyjnej : https://itemszop.tk

## Konfiguracja budowania

```bash
# Instalowanie bibliotek
$ npm install

# serwowanie z hot reaload'em localhost:8080
$ npm run dev

# budowanie i uruchamianie serwera
$ npm run build
$ npm run start

# generowanie statycznego projektu
$ npm run generate
```

Aby uzyskać szczegółowe wyjaśnienie, jak to działa, sprawdź [dokumentację](https://nuxtjs.org).

## Własne hostowanie (niedługo będzie działać)

- Sklonuj projekt i utwórz nowe repozytorium klikając ten [LINK](https://vercel.com/new/clone?repository-url=https://github.com/michaljaz/itemszop)
- Przygotuj własną bazę firebase [Dokumentacja](https://github.com/michaljaz/itemszop/wiki/Konfiguracja-w%C5%82asnej-bazy-firebase)




## Linki do dokumentacji płatności

- https://microsms.pl/documents/przelewy_online.pdf
- https://microsms.pl/kernel/Mails/files/dokumentacja_techniczna_mirosms.pdf
