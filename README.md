# front_end_coffee_Shop

![Café du Conservatoire — suggestions police et couleurs](README/cafe-conservatoir.png)

## Lil infos

Working on it 

## Lancer le projet

Node.js + TypeScript, avec [Vite](https://vite.dev).

```bash
npm install
npm run dev       # serveur local sur http://localhost:5173
npm run build     # vérifie les types et génère dist/
npm run preview   # sert le build de production
```

## Polices

| Rôle | Police | Fichier |
| --- | --- | --- |
| Titre | Old Standard TT Bold | `font/OldStandardTT-Bold.ttf` |
| Sous-titre | SUSE Mono Medium Italic | `font/SUSEMono-MediumItalic.ttf` |
| Corps | Intel One Mono Medium | `font/IntelOneMono-Medium.ttf` |

```css
@font-face {
  font-family: "Old Standard TT";
  src: url("font/OldStandardTT-Bold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: "SUSE Mono";
  src: url("font/SUSEMono-MediumItalic.ttf") format("truetype");
  font-weight: 500;
  font-style: italic;
}

@font-face {
  font-family: "Intel One Mono";
  src: url("font/IntelOneMono-Medium.ttf") format("truetype");
  font-weight: 500;
  font-style: normal;
}
```

