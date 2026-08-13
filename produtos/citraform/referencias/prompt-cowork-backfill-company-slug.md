# Prompt para Claude Cowork — preencher company_slug do perfil MakeLemonAd

Copie e cole no Cowork com o navegador logado no dashboard do Supabase.

---

No projeto `citraform-prod` → **SQL Editor**, rode:

```sql
update profiles set company_slug = 'makelemonad' where id = '4df647d1-51b2-47f9-bf8a-338947b2fef1';
```

## Relatório final

- Confirme que rodou sem erro
- Rode `select id, email, company_slug from profiles;` e confirme que o valor ficou `makelemonad`
