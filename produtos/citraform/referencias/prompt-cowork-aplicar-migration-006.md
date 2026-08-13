# Prompt para Claude Cowork — aplicar migration 006 (openai_pixel_id) no Supabase

Copie e cole no Cowork com o navegador logado no dashboard do Supabase.

---

Abra o projeto **`citraform-prod`** → **SQL Editor** → New Query. Cole e rode:

```sql
alter table form_integrations
  add column if not exists openai_pixel_id text;
```

## Relatório final

- Confirme que rodou sem erro
- Rode `select column_name from information_schema.columns where table_name = 'form_integrations';` e confirme que `openai_pixel_id` aparece na lista
