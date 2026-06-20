# NeuroTile Sequencer

Prototype haute fidélité pour SEG3525 - Devoir 3.

## Description

NeuroTile Sequencer est un jeu de mémoire basé sur des séquences de tuiles. Le joueur observe une séquence lumineuse, puis doit la reproduire dans le bon ordre.
Lien : https://neurotile.netlify.app/

## Modes

- **Easy** : 4 tuiles statiques.
- **Hard** : 4 tuiles qui tournent en cercle pendant la phase de réponse.

## Technologies

- HTML
- CSS
- JavaScript
- Vue 3 avec CDN

## Fichiers

- `index.html`
- `styles.css`
- `app.js`
- `README.md`

## Comment tester

Ouvrir simplement `index.html` dans un navigateur.

## Lien à ajouter au portfolio

```html
<a href="neuro-tile-sequencer-final/index.html">Jouer à NeuroTile Sequencer</a>
```

## Notes de conception

Le prototype utilise une navigation simple avec trois sections : Play, Learn et Design. Le jeu applique les principes de Gestalt comme la similarité, la proximité, la figure-fond et la continuité. Le mode difficile ajoute du mouvement circulaire pour augmenter l'attention visuelle et la charge cognitive.


## Mise à jour - animation de chargement

Lorsqu'un utilisateur change de page avec la navigation Play / Learn / Design, une animation de chargement apparaît. Elle montre un cerveau qui s'illumine avec des points neuronaux pour renforcer le thème cognitif du jeu.
