---
name: aksel-spacing
description: Responsiv layout med Aksel spacing-tokens og Box, VStack, HStack og HGrid
---

# Aksel Spacing Skill

Responsive layout-mønstre med Navs Aksel Design System spacing-tokens.

## Viktig regel

**Aldri bruk Tailwind padding/margin (`p-`, `m-`, `px-`, `py-`) med Aksel-komponenter.**

Bruk alltid Aksel spacing-tokens: `space-4`, `space-6`, `space-8`, osv.

## Page container-mønster

```typescript
import { Box, VStack } from '@navikt/ds-react';

export default function Page() {
  return (
    <main className="max-w-7xl mx-auto">
      <Box
        paddingBlock={{ xs: 'space-8', md: 'space-12' }}
        paddingInline={{ xs: 'space-4', md: 'space-10' }}
      >
        <VStack gap={{ xs: 'space-6', md: 'space-8' }}>
          {/* Sideinnhold */}
        </VStack>
      </Box>
    </main>
  );
}
```

## Card-mønster

```typescript
import { Box, VStack, Heading, BodyShort } from '@navikt/ds-react';

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box
      background="surface-default"
      padding={{ xs: 'space-6', md: 'space-8' }}
      borderRadius="large"
      borderWidth="1"
      borderColor="border-subtle"
    >
      <VStack gap="space-4">
        <Heading size="medium">{title}</Heading>
        <BodyShort>{children}</BodyShort>
      </VStack>
    </Box>
  );
}
```

## Form-layout

```typescript
import { VStack, HStack, TextField, Button } from '@navikt/ds-react';

export function UserForm() {
  return (
    <VStack gap="space-6">
      {/* Input-felt med konsistent vertikal spacing */}
      <VStack gap="space-4">
        <TextField label="Fornavn" />
        <TextField label="Etternavn" />
        <TextField label="E-post" type="email" />
      </VStack>

      {/* Button row med horisontal spacing */}
      <HStack gap="space-4" justify="end">
        <Button variant="secondary">Avbryt</Button>
        <Button variant="primary">Send inn</Button>
      </HStack>
    </VStack>
  );
}
```

## Dashboard-grid

```typescript
import { HGrid, Box, VStack, Heading } from '@navikt/ds-react';

export function Dashboard() {
  return (
    <VStack gap={{ xs: 'space-6', md: 'space-8' }}>
      <Heading size="xlarge">Dashboard</Heading>

      {/* Responsiv grid: 1 kolonne mobil, 2 nettbrett, 4 desktop */}
      <HGrid gap="space-4" columns={{ xs: 1, sm: 2, lg: 4 }}>
        <MetricCard title="Brukere" value="1 234" />
        <MetricCard title="Inntekt" value="5 678" />
        <MetricCard title="Bestillinger" value="910" />
        <MetricCard title="Vekst" value="+12 %" />
      </HGrid>

      {/* Innholdsområde */}
      <Box
        background="surface-subtle"
        padding={{ xs: 'space-6', md: 'space-8' }}
        borderRadius="large"
      >
        {/* Innhold */}
      </Box>
    </VStack>
  );
}
```

## Two-column layout

```typescript
import { HGrid, Box, VStack } from '@navikt/ds-react';

export function TwoColumnLayout() {
  return (
    <HGrid gap="space-6" columns={{ xs: 1, md: 2 }}>
      {/* Venstre kolonne */}
      <Box
        background="surface-default"
        padding={{ xs: 'space-6', md: 'space-8' }}
        borderRadius="large"
      >
        <VStack gap="space-4">
          {/* Venstre innhold */}
        </VStack>
      </Box>

      {/* Høyre kolonne */}
      <Box
        background="surface-subtle"
        padding={{ xs: 'space-6', md: 'space-8' }}
        borderRadius="large"
      >
        <VStack gap="space-4">
          {/* Høyre innhold */}
        </VStack>
      </Box>
    </HGrid>
  );
}
```

## Filter Section Pattern

```typescript
import { Box, VStack, HGrid, Select, TextField, Heading } from '@navikt/ds-react';

export function FilterSection() {
  return (
    <Box
      background="surface-subtle"
      padding={{ xs: 'space-4', md: 'space-6' }}
      borderRadius="large"
    >
      <VStack gap="space-4">
        <Heading size="small">Filters</Heading>

        {/* Responsive filter inputs */}
        <HGrid gap="space-4" columns={{ xs: 1, md: 3 }}>
          <Select label="Department">
            <option>All</option>
          </Select>

          <Select label="Status">
            <option>All</option>
          </Select>

          <TextField label="Search" />
        </HGrid>
      </VStack>
    </Box>
  );
}
```

## Spacing Tokens Reference

```typescript
"space-0"; // 0px
"space-1"; // 4px
"space-2"; // 8px
"space-3"; // 12px
"space-4"; // 16px  ← Form field gaps
"space-5"; // 20px
"space-6"; // 24px  ← Card padding (mobile)
"space-8"; // 32px  ← Card padding (desktop), section gaps
"space-10"; // 40px  ← Page padding (desktop)
"space-12"; // 48px  ← Page padding block (desktop)
```

## Responsive Breakpoints

```typescript
xs: "0px"; // Mobile (default)
sm: "480px"; // Large mobile
md: "768px"; // Tablet
lg: "1024px"; // Desktop
xl: "1280px"; // Large desktop
```

## Common Patterns

```typescript
// ✅ Page padding
paddingBlock={{ xs: 'space-8', md: 'space-12' }}
paddingInline={{ xs: 'space-4', md: 'space-10' }}

// ✅ Card padding
padding={{ xs: 'space-6', md: 'space-8' }}

// ✅ Section gaps
gap={{ xs: 'space-6', md: 'space-8' }}

// ✅ Form field gaps
gap="space-4"

// ✅ Button group gaps
gap="space-4"

// ❌ NEVER use Tailwind
className="p-4 m-2"  // WRONG!
className="px-6 py-4"  // WRONG!
```
