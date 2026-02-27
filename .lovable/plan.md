

## Plano: Remover "Sprunki Musical" do Menu Lateral

### Alteração Única

**Arquivo:** `src/components/sidebar/constants.ts` (linha 44)

Remover a linha:
```typescript
{ icon: Music2, text: "🎵 Sprunki Musical", path: "/sprunki", gradient: "from-rose-500 to-pink-600", isNew: true },
```

O array `musicalGamesMenuItems` ficará com 3 itens:
- Jogos MuseTera
- TEA-Hero
- Sinos Musicais

Também será possível remover o import `Music2` (linha 15) já que não será mais utilizado.

