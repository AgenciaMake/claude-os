# Prompt para Claude Cowork — aplicar migration 005 (form_integrations) no Supabase

Copie e cole no Cowork com o navegador logado no dashboard do Supabase.

---

Abra o projeto **`citraform-prod`** → **SQL Editor** → New Query. Cole e rode o bloco abaixo inteiro.

```sql
create table if not exists form_integrations (
  form_id                      uuid primary key references forms(id) on delete cascade,
  gtm_container_id             text,
  ga4_measurement_id           text,
  google_ads_conversion_id     text,
  google_ads_conversion_label  text,
  meta_pixel_id                text,
  meta_access_token            text,
  tiktok_pixel_id              text,
  linkedin_partner_id          text,
  webhook_url                  text,
  updated_at                   timestamptz not null default now()
);

alter table form_integrations enable row level security;

create policy "form_integrations: select só dono do form"
  on form_integrations for select
  using (
    exists (
      select 1 from forms
      where forms.id = form_integrations.form_id
        and forms.owner_id = auth.uid()
    )
  );

create policy "form_integrations: insert só dono do form"
  on form_integrations for insert
  with check (
    exists (
      select 1 from forms
      where forms.id = form_integrations.form_id
        and forms.owner_id = auth.uid()
    )
  );

create policy "form_integrations: update só dono do form"
  on form_integrations for update
  using (
    exists (
      select 1 from forms
      where forms.id = form_integrations.form_id
        and forms.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from forms
      where forms.id = form_integrations.form_id
        and forms.owner_id = auth.uid()
    )
  );

create policy "form_integrations: delete só dono do form"
  on form_integrations for delete
  using (
    exists (
      select 1 from forms
      where forms.id = form_integrations.form_id
        and forms.owner_id = auth.uid()
    )
  );

create or replace function form_integrations_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists form_integrations_updated_at on form_integrations;

create trigger form_integrations_updated_at
  before update on form_integrations
  for each row execute function form_integrations_set_updated_at();
```

## Relatório final

- Confirme que rodou sem erro
- Rode `select * from form_integrations limit 5;` pra confirmar que a tabela existe (vazia, esperado)
- Qualquer erro ou aviso
