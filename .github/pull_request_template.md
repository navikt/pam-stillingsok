## Hva endres?
<!-- Kort beskrivelse  -->


## Sjekkliste
- [ ] Ingen bruk av `any` (bruk `unknown` + innsnevring der nødvendig)
- [ ] `type` brukt fremfor `interface`
- [ ] Streng typing (ingen implicit any / løse typer)
- [ ] **Leselige variabelnavn brukt** (unngå 1–2 bokstaver og kryptiske navn som `a`, `b`, `x`, `obj`, `acc`)
- [ ] **Komponentstil fulgt:** funksjonsdeklarasjon som standard; `const`-pilfunksjon kun ved `memo`, `forwardRef`, generiske komponenter eller behov for `displayName`
- [ ] Next.js-konvensjoner fulgt (App Router, `next/link`, `next/navigation`, server actions der naturlig)
- [ ] Tester (Vitest) lagt til/oppdatert (`*.test.ts(x)` ved siden av kildekoden)
- [ ] Tilgjengelighet (WCAG) vurdert der det er UI-endringer
- [ ] Jeg har lest/fulgt retningslinjene i [.github/copilot-instructions.md](./copilot-instructions.md)

## Notater for reviewer
<!-- Eventuelle avklaringer, oppfølging, TODO -->

---

💡 **Tips:**  
Bruk gjerne **Copilot Actions** → *"Generate a summary of the changes in this pull request"* for å få en detaljert, AI-generert oppsummering som supplement til din egen beskrivelse.