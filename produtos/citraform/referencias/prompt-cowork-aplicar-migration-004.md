# Prompt para Claude Cowork — aplicar migration 004 (forms + form_responses) no Supabase

Copie e cole no Cowork com o navegador logado no dashboard do Supabase.

---

Abra o projeto **`citraform-prod`** no Supabase Dashboard → **SQL Editor** → New Query. Cole e rode o bloco abaixo inteiro (é uma migration só, pode rodar de uma vez).

```sql
create table if not exists forms (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references profiles(id) on delete cascade,
  slug        text not null unique,
  title       text not null default 'Sem título',
  published   boolean not null default false,
  data        jsonb not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists forms_owner_id_idx on forms(owner_id);

alter table forms enable row level security;

create policy "forms: select próprio ou publicado"
  on forms for select
  using (published = true or auth.uid() = owner_id);

create policy "forms: insert só o próprio dono"
  on forms for insert
  with check (auth.uid() = owner_id);

create policy "forms: update só o próprio dono"
  on forms for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "forms: delete só o próprio dono"
  on forms for delete
  using (auth.uid() = owner_id);

create or replace function forms_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists forms_updated_at on forms;

create trigger forms_updated_at
  before update on forms
  for each row execute function forms_set_updated_at();

create table if not exists form_responses (
  id            uuid primary key default gen_random_uuid(),
  form_id       uuid not null references forms(id) on delete cascade,
  answers       jsonb not null default '{}'::jsonb,
  score         int not null default 0,
  submitted_at  timestamptz not null default now(),
  meta          jsonb not null default '{}'::jsonb
);

create index if not exists form_responses_form_id_idx on form_responses(form_id);

alter table form_responses enable row level security;

create policy "form_responses: select só dono do form"
  on form_responses for select
  using (
    exists (
      select 1 from forms
      where forms.id = form_responses.form_id
        and forms.owner_id = auth.uid()
    )
  );

create policy "form_responses: insert público"
  on form_responses for insert
  with check (true);
```

## Relatório final

- Confirme que rodou sem erro
- Rode `select * from forms limit 5;` e `select * from form_responses limit 5;` pra confirmar que as tabelas existem (vazias, esperado)
- Qualquer erro ou aviso
