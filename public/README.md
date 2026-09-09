# Static Assets

Place static files here for direct URL serving in Next.js:

- `public/images/` — Product images, banners, hero graphics
- `public/icons/` — Favicons, custom SVG icons, payment badges
- `public/logos/` — Telos Cart brand logos (SVG / PNG)

### Usage Example:
```tsx
import Image from "next/image";

<Image src="/logos/logo.svg" alt="Telos Cart" width={140} height={40} />
```
Files in `public/` are served at root (`/logos/logo.svg`, `/icons/...`, etc.).
