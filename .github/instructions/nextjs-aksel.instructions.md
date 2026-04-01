---
applyTo: "src/**/*.{tsx,ts}"
---

# Next.js med Aksel Design System

Standarder for Next.js-apper med Aksel: spacing-tokens, responsive props og komponentmønstre.

## Spacing-regler

**VIKTIG**: Bruk alltid Nav DS spacing-tokens, aldri Tailwind padding/margin.

### ✅ Riktig

```tsx
import { Box, VStack, HGrid } from "@navikt/ds-react";

// Page container
<main className="max-w-7xl mx-auto">
  <Box
    paddingBlock={{ xs: "space-16", md: "space-24" }}
    paddingInline={{ xs: "space-16", md: "space-40" }}
  >
    {children}
  </Box>
</main>

// Komponent med responsiv padding
<Box
  background="surface-subtle"
  padding={{ xs: "space-12", sm: "space-16", md: "space-24" }}
  borderRadius="large"
>
  <Heading size="large" level="2">Tittel</Heading>
  <BodyShort>Innhold</BodyShort>
</Box>

// Retningsbestemt padding
<Box
  paddingBlock="space-16"    // Topp og bunn
  paddingInline="space-24"   // Venstre og høyre
>
```

### ❌ Feil

```tsx
// Aldri bruk Tailwind padding/margin
<div className="p-4 md:p-6">  // ❌ Feil
<div className="mx-4 my-2">   // ❌ Feil
<Box padding="4">             // ❌ Feil — mangler space-prefiks
```

## Spacing-tokens

Tilgjengelige tokens (alltid med `space-`-prefiks):

- `space-4` (4px)
- `space-8` (8px)
- `space-12` (12px)
- `space-16` (16px)
- `space-20` (20px)
- `space-24` (24px)
- `space-32` (32px)
- `space-40` (40px)

## Responsiv design

Mobil først med breakpoints:

- `xs`: 0px (mobil)
- `sm`: 480px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

```tsx
<HGrid columns={{ xs: 1, md: 2, lg: 3 }} gap="4">
  {items.map(item => <Card key={item.id} {...item} />)}
</HGrid>

<Box
  padding={{ xs: "space-16", sm: "space-20", md: "space-24" }}
>
```

## Komponentmønstre

### Layout-komponenter

```tsx
import { Box, VStack, HStack, HGrid } from "@navikt/ds-react";

// Vertikal stack med mellomrom
<VStack gap="4">
  <Komponent1 />
  <Komponent2 />
  <Komponent3 />
</VStack>

// Horisontal stack
<HStack gap="4" align="center">
  <Icon />
  <Text />
</HStack>

// Responsiv grid
<HGrid columns={{ xs: 1, md: 2, lg: 3 }} gap="4">
  {/* Grid-elementer */}
</HGrid>
```

### Typografi

```tsx
import { Heading, BodyShort, Label } from "@navikt/ds-react";

<Heading size="large|medium|small" level="1-6">
  Tittel
</Heading>

<BodyShort size="large|medium|small">
  Vanlig tekstinnhold
</BodyShort>

<BodyShort weight="semibold">
  Halvfet tekst
</BodyShort>

<Label size="large|medium|small">
  Skjemaetikett
</Label>
```

### Bakgrunnsfarger

```tsx
<Box background="surface-default">     {/* Hvit */}
<Box background="surface-subtle">      {/* Lys grå */}
<Box background="surface-action-subtle">  {/* Lys blå */}
<Box background="surface-success-subtle"> {/* Lys grønn */}
<Box background="surface-warning-subtle"> {/* Lys oransje */}
<Box background="surface-danger-subtle">  {/* Lys rød */}
```

## Tallformatering

Bruk alltid norsk locale for tallformatering:

```typescript
const formatNumber = new Intl.NumberFormat("nb-NO").format;

// ✅ Correct
const formatted = formatNumber(151354); // "151 354"

// ❌ Wrong
const formatted = num.toLocaleString(); // Uses browser locale
```

## API Routes (App Router)

```typescript
import { NextResponse } from "next/server";

// GET endpoint with error handling
export async function GET() {
  const { data, error } = await fetchData();

  if (error) {
    console.error("Failed to fetch data", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST endpoint
export async function POST(request: Request) {
  const body = await request.json();

  // Validation
  if (!body.requiredField) {
    return NextResponse.json({ error: "requiredField is missing" }, { status: 400 });
  }

  const result = await processData(body);
  return NextResponse.json(result, { status: 201 });
}
```

## Authentication

```typescript
import { getUser } from "@/lib/auth";

// Redirect if not authenticated
const user = await getUser();

// Return null if not authenticated
const user = await getUser(false);
if (!user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

## Testing

```typescript
import { formatNumber } from "./format";

describe("formatNumber", () => {
  it("should format numbers with Norwegian locale", () => {
    expect(formatNumber(151354)).toBe("151 354");
  });

  it("should handle decimal numbers", () => {
    expect(formatNumber(1234.56)).toBe("1 234,56");
  });
});
```

## Server Components (Next.js 16)

```tsx
// Server Component (default in App Router)
export default async function Page() {
  const data = await fetchData(); // Can use async/await

  return (
    <Box padding="space-24">
      <Heading size="large" level="1">
        {data.title}
      </Heading>
      <BodyShort>{data.description}</BodyShort>
    </Box>
  );
}
```

## Client Components

```tsx
"use client";

import { useState } from "react";
import { Button } from "@navikt/ds-react";

export function InteractiveComponent() {
  const [count, setCount] = useState(0);

  return <Button onClick={() => setCount(count + 1)}>Count: {count}</Button>;
}
```

## Loading and Error States

```tsx
// src/app/oversikt/loading.tsx — shown during server component loading
import { Loader, Box } from "@navikt/ds-react";

export default function Loading() {
  return (
    <Box padding="space-24" className="flex justify-center">
      <Loader size="xlarge" title="Laster data..." />
    </Box>
  );
}

// src/app/oversikt/error.tsx — shown on uncaught errors
"use client";

import { Alert, Button, VStack } from "@navikt/ds-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <VStack gap="4">
      <Alert variant="error">
        Noe gikk galt. Prøv igjen senere.
      </Alert>
      <Button variant="secondary" onClick={reset}>Prøv igjen</Button>
    </VStack>
  );
}
```

## Streaming with Suspense

```tsx
import { Suspense } from "react";
import { Skeleton } from "@navikt/ds-react";

export default function Page() {
  return (
    <VStack gap="8">
      <Heading size="large" level="1">Oversikt</Heading>
      <Suspense fallback={<Skeleton variant="rounded" height={200} />}>
        <SlowDataComponent />
      </Suspense>
    </VStack>
  );
}

// This component can load independently
async function SlowDataComponent() {
  const data = await fetchSlowData(); // streams in when ready
  return <DataTable data={data} />;
}
```

## Server Actions

```tsx
// src/app/vedtak/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";

export async function createVedtak(formData: FormData) {
  const user = await getUser();

  const tittel = formData.get("tittel") as string;
  if (!tittel) {
    return { error: "Tittel er påkrevd" };
  }

  await saveToDatabase({ tittel, opprettetAv: user.name });
  revalidatePath("/vedtak");
  return { success: true };
}
```

```tsx
// src/app/vedtak/page.tsx
"use client";

import { useActionState } from "react";
import { createVedtak } from "./actions";

export default function VedtakForm() {
  const [state, action, isPending] = useActionState(createVedtak, null);

  return (
    <form action={action}>
      <TextField name="tittel" label="Tittel" error={state?.error} />
      <Button type="submit" loading={isPending}>Opprett</Button>
    </form>
  );
}
```

## Boundaries

### ✅ Always

- Use Aksel Design System components
- Use spacing tokens with `space-` prefix
- Mobile-first responsive design
- Norwegian number formatting
- Explicit error handling in API routes

### ⚠️ Ask First

- Adding custom Tailwind utilities
- Deviating from Aksel patterns
- Changing authentication flow
- Modifying data aggregation logic

### 🚫 Never

- Use Tailwind padding/margin utilities (`p-*`, `m-*`)
- Use numeric spacing without `space-` prefix
- Ignore accessibility requirements
- Skip responsive props
- Add code comments unless explicitly requested
