# Prompt para Claude Cowork — checar formulários existentes no banco

Copie e cole no Cowork com o navegador logado no Supabase.

---

No projeto `citraform-prod` → **SQL Editor**, rode:

```sql
select id, slug, title, published, created_at, updated_at from forms order by created_at desc;
```

## Relatório final

Cole a tabela de resultado inteira (todas as colunas, todas as linhas) — preciso ver exatamente quais formulários existem, os slugs reais, e se `published` está `true` ou `false` em cada um.
