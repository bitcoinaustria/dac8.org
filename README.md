# dac8.org

Kampagnenwebsite der österreichischen Initiative gegen die anlasslose
Krypto-Datenerfassung durch DAC8 und das Krypto-Meldepflichtgesetz.

Wir sind Bitcoin Austria, nicht Bull Bitcoin. [Bull Bitcoin](https://www.bullbitcoin.com/fr/blog/bull-bitcoin-saisit-le-conseil-detat-pour-faire-annuler-dac8-la-surveillance-de-masse-des-crypto-actifs)
hat den Widerstand gegen DAC8 angestoßen und mit dac8.com die Grundlage für die
europäische Debatte gelegt. Wir bereiten dafür in Österreich einen eigenen
Individualantrag beim Verfassungsgerichtshof vor.

Der Individualantrag ist in Vorbereitung. Die Website bleibt vorerst deutsch;
eine englische Fassung folgt.

## Entwicklung

Voraussetzungen: Node.js 22.12 oder neuer und pnpm 11.20.

```sh
pnpm install
pnpm dev
pnpm build
pnpm format:check
```

Die zu Recherchezwecken gesicherte dac8.com-Website liegt unter `export/` und
bleibt gitignored. Sie ist keine öffentliche Quelle der neuen Website.

## Deployment

Die statische Astro-Website läuft auf Cloudflare Workers Static Assets.

```sh
pnpm build
pnpm exec wrangler deploy
```

Die Produktions- und Preview-URLs unter `workers.dev` sind aktiviert und
müssen hinter Cloudflare Access bleiben. Zugriff erhalten derzeit Adressen der
Domains `bitcoin-austria.at` und `coinfinity.co`. Die Access-Regeln werden im
Cloudflare-Dashboard verwaltet und liegen nicht im Repository.

## Kontakt

[kontakt@dac8.org](mailto:kontakt@dac8.org)
