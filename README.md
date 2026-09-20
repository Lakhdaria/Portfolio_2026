# Portfolio — Sofiane

Site portfolio en Next.js (App Router, TypeScript, CSS Modules).
Direction artistique : papier blanc, strates de crème, filets fins, accent laiton.

## Démarrer

```bash
npm install
npm run dev
```

Le site tourne sur http://localhost:3000

## Build de production

```bash
npm run build
npm run start
```

## Structure

```
app/
  layout.tsx          Polices (next/font), métadonnées SEO, Open Graph
  page.tsx            Assemblage des sections
  globals.css         Jetons de design + primitives partagées (.wrap, .label, .sectionHead)
components/
  TopBar              Barre fixe, navigation ancrée
  Hero                Accroche + fiche signalétique
  ProjectIndex        Index des travaux dépliable (composant client)
  Approach            Trois convictions
  Skills              Quatre colonnes de compétences
  Timeline            Formation & terrain
  Contact             Section de clôture
  SiteFooter          Pied de page
content/
  site.ts             Identité, navigation, compétences, parcours
  projects.ts         Les projets de l'index
```

## Modifier le contenu

Tout le texte est dans `content/`. Aucun contenu n'est écrit en dur dans les
composants : ajouter un projet = ajouter un objet dans `content/projects.ts`.

## Design tokens

Toutes les couleurs et le rythme typographique sont déclarés dans `:root`
(`app/globals.css`). Changer la DA se fait depuis ce seul bloc.

| Jeton | Valeur | Usage |
| --- | --- | --- |
| `--paper` | `#fdfcfa` | Fond principal |
| `--cream` | `#f6f1e8` | Sections alternées |
| `--cream-deep` | `#ede4d4` | Pied de page, dégradé de clôture |
| `--rule` / `--rule-soft` | `#dfd6c4` / `#ede7db` | Filets |
| `--ink` / `--ink-soft` / `--muted` | `#17140f` / `#4f4739` / `#8c8375` | Encres |
| `--brass` | `#9a7647` | Accent, à utiliser au compte-gouttes |

Polices : **Fraunces** (display, variable — axes `opsz`, `SOFT`, `WONK`) et
**Jost** (corps), chargées et auto-hébergées via `next/font/google`.

## Déploiement

Le projet se déploie tel quel sur Vercel : importer le dépôt, aucune variable
d'environnement requise.

Avant mise en ligne, remplacer `metadataBase` dans `app/layout.tsx` par le
domaine réel.
