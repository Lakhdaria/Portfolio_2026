# Portfolio — Sofiane

Next.js 16 (App Router, TypeScript, CSS Modules), Three.js, chess.js.
Trois langues, deux thèmes, deux régimes de lecture, une assistante qui parle,
et deux jeux.

## Démarrer

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run start
```

Aucune variable d'environnement. Se déploie tel quel sur Vercel.

## Structure

```
app/
  layout.tsx          Métadonnées + les deux scripts joués avant la peinture
  page.tsx            Assemblage, sous <PrefsProvider>
  globals.css         Jetons clairs et sombres, régime de lecture, primitives
components/
  PrefsProvider       Langue, thème, police, bavardise — partagés par tout le site
  SiteHeader          Îlot flottant, pastille glissante, langue, thème, menu
  BootIntro           Séquence d'ouverture (client)
  Radia               Le personnage, en SVG
  Companion           Radia sur le site : accueil, commentaires, questions
  NetworkField        Maillage 3D Three.js, accordé au thème
  Arena               Les deux jeux, onglets et niveaux
  ChessGame           Échiquier
  Connect4Game        Grille du Puissance 4
  Hero SkillCards WorkCards Contact SiteFooter Glyph Reveal
lib/
  prefs.ts            Lecture, écriture et application des réglages
  voice.ts            Voix et sons d'interface, synthétisés
  chess-ai.ts         Évaluation + negamax + quiescence
  connect4.ts         Negamax + table de transposition
content/
  i18n.ts             TOUT le texte, en français, anglais et allemand
```

Pour changer un mot du site, il n'y a qu'un fichier : `content/i18n.ts`.

## Les réglages du visiteur

Quatre préférences, enregistrées dans `localStorage`, appliquées en attributs
sur `<html>` — le CSS fait le reste, sans rerendu React.

| Réglage | Valeurs | Effet |
| --- | --- | --- |
| `lang` | `fr` `en` `de` | Tout le texte, plus l'attribut `lang` du document |
| `theme` | `light` `dark` | Bascule le jeu de jetons entier, maillage 3D compris |
| `font` | `default` `reading` | Passe en **Lexend**, desserre les lettres, aère les lignes |
| `autoSpeak` | oui / non | Radia commente les sections d'elle-même, ou se tait |

Radia les demande à la première visite ; le header et son panneau de réglages
permettent d'en changer ensuite.

**Le régime de lecture** charge Lexend — une police dessinée pour la vitesse de
lecture — remet l'interlettrage à zéro (le titrage du site est très resserré,
ce qui nuit à la lecture), ouvre l'interligne à 1,75 et espace les mots. La
police n'est téléchargée que si on l'active.

Deux scripts tournent avant la première peinture (`app/layout.tsx`) : l'un
restitue les réglages, l'autre décide du sort de l'intro. Sans eux, la page
clignoterait en clair avant de passer en sombre.

Le rendu serveur part du français : c'est le public principal et ce que liront
les moteurs de recherche. Un visiteur revenu en anglais ou en allemand voit
donc une image française le temps de l'hydratation.

## Radia, l'assistante

Le nom vient de **Radia Perlman**, qui a inventé le Spanning Tree Protocol :
l'algorithme qui supprime les boucles d'un réseau commuté. Inconnue du grand
public, fondatrice chez les réseaux — et le prénom dit ce que fait le
personnage : il rayonne.

### Ce qu'elle fait

- **Elle accueille.** À la première visite, quatre questions à choix : langue,
  thème, confort de lecture, et si elle doit commenter les sections.
- **Elle commente.** Si on l'y autorise, elle ouvre une bulle en arrivant sur
  une section, dit sa phrase, et **se retire seule au bout de sept secondes**.
  Fermée à la main, elle se tait trente secondes : une assistante qu'on
  congédie et qui revient aussitôt est insupportable.
- **Elle répond.** Cinq questions toutes faites — « Comment contacter Sofiane
  pour un projet ? » — avec la réponse puis un bouton qui emmène à la bonne
  section.
- **Elle se règle.** Roue dentée dans sa bulle : les quatre préférences, plus
  la sourdine.

Ses textes sont dans `content/i18n.ts`, champs `sections`, `faq`, `onboarding`.

### Les sons

`lib/voice.ts`, synthétisé à l'exécution — aucun fichier, aucun son sous
licence.

| Fonction | Ce que c'est |
| --- | --- |
| `say()` | Un bip par lettre, hauteur calculée sur le caractère, filtré en passe-bande |
| `advance()` | Validation : une quinte brillante qui monte, plus un souffle |
| `dismiss()` | Fermeture : le même accord, qui redescend |
| `chime()` / `key()` / `open()` | Allumage, frappe, ouverture de bulle |

Les navigateurs interdisent le son avant un geste : d'où le bouton d'allumage
de l'intro et `primeAudio()` au premier clic.

### Ses jetons de dessin

Déclarés sur `.radia` (`Radia.module.css`) : `--radia-ink`, `--radia-ink-lift`,
`--radia-glow`, `--radia-rim`. Changer `--radia-glow` la repeint entièrement.

## Le header

Îlot flottant qui se resserre au défilement, avec une pastille qui **glisse**
sous la section en cours et un filet de progression.

Il se replie quand on descend et **revient dès qu'on remonte** — le geste que
fait n'importe quel visiteur. Une poignée sous le bord le rappelle aussi, pour
qui s'arrête en plein milieu. En dessous de 900 px, menu plein écran à entrées
numérotées.

## Les jeux

Section « Jouer », deux onglets, trois niveaux. Les moteurs ne sont chargés
qu'à l'ouverture de leur onglet : inutile d'imposer chess.js à quelqu'un venu
lire un portfolio.

### Échecs — `lib/chess-ai.ts`

chess.js tient les règles ; le moteur ajoute l'évaluation et la recherche.

- Matériel + tables de position, avec une table de roi distincte en finale.
- Negamax à élagage alpha-bêta, approfondissement itératif, budget de temps :
  si le temps manque, on garde le meilleur coup de la dernière profondeur
  entièrement explorée.
- Tri des coups par MVV-LVA (victime précieuse, agresseur modeste d'abord) —
  l'élagage coupe beaucoup plus tôt.
- **Recherche de quiescence** : à profondeur épuisée, la recherche continue
  tant qu'il reste des prises. Sans elle, le moteur voit une prise au dernier
  demi-coup, se croit en gain, et se fait reprendre juste après.

Niveaux : profondeur 2 / 4 / 6, budget 220 / 700 / 1600 ms.

**Ce que ça vaut**, honnêtement : elle punit toute faute tactique d'un joueur
occasionnel et ne donne jamais une pièce. Ce n'est pas Stockfish — pas de livre
d'ouvertures, pas de tables de finales, pas de recherche sur plusieurs
secondes. Un joueur de club la battra.

### Puissance 4 — `lib/connect4.ts`

Le jeu est résolu depuis 1988. Pas besoin d'heuristique fine : il suffit de
chercher assez profond.

- Gain immédiat et blocage de menace traités avant toute recherche.
- Negamax alpha-bêta, coups triés du centre vers les bords, table de
  transposition, budget de temps.
- Profondeur 12 au niveau « sans pitié ».

**Ce que ça vaut** : à ce niveau elle ne perd pas si elle commence, et punit
toute erreur. Vous pouvez viser le nul.

Les deux moteurs tournent sur le fil principal, avec un budget court et un
indicateur « Radia réfléchit ». Si les temps sont allongés, les passer dans un
Web Worker devient nécessaire.

## La séquence d'ouverture

L'écran s'allume, Radia se présente, tape `souss.dev`, le site **charge dans la
fenêtre** — barre de progression, puis l'accroche, le titre et le bouton qui
montent l'un après l'autre — et la fenêtre avale l'écran en un zoom lent de
1,5 seconde.

- **Elle rejoue à chaque chargement de page.** Aucun verrou de session.
- « Passer » et « Couper le son » dès la première image, Échap à tout moment.
- Neutralisée si le système demande la réduction des animations, ou sans
  JavaScript.
- Le navigateur de la scène est générique : aucune marque d'éditeur tiers.

Réglages : `CHAR_MS`, `KEY_MS`, `LINE_PAUSE`, `LOAD_MS`, `ZOOM_MS` en haut de
`BootIntro.tsx`.

Pour retirer l'intro : supprimer `<BootIntro />` de `app/page.tsx` et le bloc
`introGate` de `app/layout.tsx`.

## Le maillage 3D

`components/NetworkField.tsx`. Des nœuds posés sur une sphère par la suite de
Fibonacci, reliés à leurs voisins proches — une topologie réseau, pas une forme
décorative. Le curseur allume les nœuds qu'il survole, le défilement fait
basculer l'ensemble.

Ses couleurs sont lues dans les jetons CSS et repeintes à la bascule de thème.
Il réduit sa densité sous 720 px, plafonne le `devicePixelRatio` à 2, coupe la
boucle de rendu hors écran, et se retire en silence sans WebGL.

## Design tokens

Deux jeux complets dans `app/globals.css`, sous `html[data-theme="light"]` et
`html[data-theme="dark"]`.

| Jeton | Clair | Sombre |
| --- | --- | --- |
| `--paper` | `#fcfbf9` | `#100e0c` |
| `--cream` / `--cream-deep` | `#f3eee4` / `#e9e1d2` | `#1a1714` / `#24201b` |
| `--night` | `#0e0c0a` | `#1e1a15` |
| `--text` / `--text-soft` / `--muted` | `#16130f` / `#5a5245` / `#938a7c` | `#f5f0e7` / `#b9af9d` / `#8a8172` |
| `--brass` / `--brass-lite` | `#a07a46` / `#cbae7e` | `#d2a566` / `#e6cb9c` |

L'échiquier fait exception : ses couleurs sont fixes, hors thème. En sombre,
des pièces noires sur des cases sombres ne se voient plus.

La typographie est la pile système, sauf en régime de lecture.

## Avant mise en ligne

Remplacer `metadataBase` dans `app/layout.tsx` par le domaine réel.
