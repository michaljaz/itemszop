#!/bin/bash

git clone https://github.com/michaljaz/itemszop
cd itemszop
# w pliku .env zapisz wartość wygenerowaną przez plik env_generator.js
sudo docker build -t itemszop .
sudo docker run -it -p 8080:8080 itemszop
