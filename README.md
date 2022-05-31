# Groupomania-OpenClassrooms
Projet 7 formation OpenClassrooms développeur web 
## Installation
Avant toute chose, cloner ce repo. Il contient le code de l'api dans le dossier 'server' et le code React dans le dossier 'client’, les données seront stockées en local dans MySQL.
## Server
Dans le dossier 'server' lancer la commande:
```bash
npm install
```
pour installer les dépendances.
Les données de connexion à la base de données sont contenus dans le fichiers d'environnement   "config.json" qui sera placé dans le dossier /server/config/config.json
On lance ensuite la commande : 
```bash
npm start
```
Il faudra aussi créer un dossier images, qui sera placé ici : server/images
## Client
Le frontend est une application Reactjs créée avec l'utilitaire create-react-app. 
L'installation des dépendance se fait avec la commande :
```bash
npm install 
npm install yarn
```
On lance ensuite l'application avec la commande pour
```bash
yarn start
```
## Utilisation
L'application est une ébauche de réseau social interne pour l'entreprise fictive Groupomania.
Les utilisateurs peuvent créer un profil. Les seules données personnelles conservées sont un nom et une adresse mail à des fins d'authentification.
Les utilisateurs peuvent ensuite poster des messages ou des documents sur la page d'accueil et commenter ce que les autres ont posté. Ils peuvent aussi modifier le titre ou le contenu d'un post textuel ou d'un commentaire dont ils sont le propriétaire , les photos ne peuvent pas être modifiée pour l'instant.

Un compte administrateur pouvant supprimer n'importe quel post ou commentaire existe: il appartient a la personne contrôlant le nom d’utilisateur "communiqué à l'entreprise" Ceci est codé en dur dans l'api est entre en fonction au moment de la création d'un compte ce nom d’utilisateur.
Variables d'environnement

Le site utilise des variables d'environnement regroupées dans le fichier .env  qui devra être localisé dans le dossier /server.
ACCESS_TOKEN et REFRESH_TOKEN-SECRET permettent  à jsonwebtoken de créer des tokens d'authentification.
