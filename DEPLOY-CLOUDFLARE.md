# Cloudflare Pages – én gangs oppsett

Repoet er pushet til GitHub. For å få siden på Cloudflare Pages:

1. Gå til **https://dash.cloudflare.com** → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Velg **GitHub** og repoet **fredriksn/konserterinorge**.
3. **Build output directory:** skriv `/` (rot).
4. **Build command:** la stå tom. Klikk **Save and Deploy**.

Etter deploy: du får URL som `konserterinorge.pages.dev`. Senere: ved hver `git push` deployer Cloudflare automatisk.
