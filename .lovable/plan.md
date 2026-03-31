

## Plan: Mobile-Optimized Evaluation Interface

### Problem
The evaluation table has 7 columns (parameter name + 6 scale levels) rendered as a horizontal table. On mobile (390px), this forces horizontal scrolling and makes radio buttons difficult to tap and read (as shown in screenshots).

### Solution
Create a **card-based mobile layout** that shows only on screens < 768px (`md` breakpoint), while keeping the existing table layout intact for desktop. Each parameter becomes a vertical card with the parameter name on top and scale options as tappable buttons below.

### Technical Changes

**File: `src/pages/evaluation/index.tsx`** (lines ~1980-2065)

1. Wrap the existing `<Table>` block in a `hidden md:block` container so it only shows on desktop
2. Add a new `md:hidden` block with a mobile-friendly card layout for each subdomain's parameters:

**Mobile card structure per parameter:**
```
┌─────────────────────────────┐
│ Parameter Name              │
│                             │
│ [Não Obs] [Emerg] [Incons]  │
│ [Moder]  [Consist] [Excep]  │
└─────────────────────────────┘
```

- Each parameter rendered as a card with the name as a header
- Scale options as a 3x2 grid of tappable pill buttons (large touch targets, ~44px height)
- Selected option highlighted with the existing color scheme (gray/red/orange/yellow/lime/green)
- Labels abbreviated for space: "Não Obs.", "Emerg.", "Incons.", "Moder.", "Consist.", "Excep."
- Uses the same `selections` state and `RadioGroup` logic — no state changes needed

3. Keep the existing table header row (`Parâmetros Avaliados` + scale columns) hidden on mobile
4. All existing desktop styles, colors, and behavior remain completely untouched

### What stays the same
- Desktop table layout (no changes)
- All state management (`selections`, `observations`)
- Color logic (`getScoreColor`, `getScoreBgColor`, `levelToScore`)
- Observation textarea below each subdomain

