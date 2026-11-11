# StatObs Élèves – Observation entre élèves en EPS (Applis EPS Élèves)

Version élève de StatObs : 100 % locale, 100 % hors ligne, thème jaune. Aucune base élèves n'est nécessaire.

## Fonctionnement

1. L'**observateur** saisit son nom, prénom et classe (mémorisés sur l'appareil), puis ceux de l'**élève observé**.
2. Il choisit l'activité (observables types proposés si l'activité est reconnue) et lance l'observation.
3. Touche courte : +1 · appui long : −1.
4. En fin de séance : radar, synthèse et **bilan du coach** (profil, points forts, priorité de travail avec critères et exercice, vigilance, objectifs chiffrés).
5. **Enregistrer le fichier (.xlsx)** produit `StatObs_NOM_Prenom_CLASSE_AAAA-MM-JJ.xlsx`, au nom de l'élève observé, au format type Mes Apps EPS :
   feuille **statobs** (une ligne, mêmes colonnes que la version prof) et feuille cachée **_meta**, sans feuille « Élèves » (format « fichier d'un élève » du guide Mes Apps EPS).
   Le professeur l'importe avec le bouton **Importer une sauvegarde StatObs** de StatObs prof.
   Sur iPhone / iPad, la feuille de partage s'ouvre (Fichiers, AirDrop, ENT…).
6. **Inverser les rôles** relance une observation avec les rôles échangés (mêmes observables).

Le fichier ne contient pas la date de naissance : le rapprochement avec la base enseignant se fait sur Nom, Prénom et Classe (d'où l'écriture NOM en majuscules / Prénom comme sur Pronote).

## Déploiement

Déposer tous les fichiers à la racine du dépôt (ou du dossier) Applis EPS Élèves, **avec le dossier `icons/`** (copier celui de StatObs enseignant : `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`) et `.nojekyll`.
Mise à jour : augmenter `const VERSION` dans `sw.js`.
