# Prompt para Claude Cowork — aplicar migration 007 (company_slug) + backfill + publicar teste

Copie e cole no Cowork com o navegador logado no dashboard do Supabase.

---

## Passo 1 — Aplicar a migration

No projeto `citraform-prod` → **SQL Editor**, rode (uma query, tudo junto):

```sql
alter table profiles add column if not exists company_slug text unique;

alter table forms drop constraint if exists forms_slug_key;
alter table forms add constraint forms_owner_slug_unique unique (owner_id, slug);
```

## Passo 2 — Conferir se algum perfil ficou sem company_slug

Rode:

```sql
select id, email, company_name, company_slug from profiles;
```

Cole o resultado aqui antes de continuar — não faça o Passo 3 sozinho, preciso ver os dados exatos primeiro (nome da empresa cadastrado) pra decidir o slug correto.

## Passo 3 — Publicar o formulário de teste (não depende dos passos acima)

```sql
update forms set published = true where slug = 'formulario-teste';
```

## Relatório final

- Confirme que o Passo 1 rodou sem erro
- Cole a tabela completa do Passo 2
- Confirme que o Passo 3 rodou sem erro
