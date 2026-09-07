# Prompt para Claude Cowork — aplicar migrations 008 (notas) e 009 (visitas) no Supabase

Copie e cole no Cowork com o navegador logado no dashboard do Supabase.

---

Abra o projeto **`citraform-prod`** → **SQL Editor** → New Query. Rode os dois blocos abaixo **na ordem, um de cada vez** (execute o primeiro, confirme sucesso, depois o segundo).

## Query 1 — form_response_notes

```sql
create table if not exists form_response_notes (
  id           uuid primary key default gen_random_uuid(),
  response_id  uuid not null references form_responses(id) on delete cascade,
  author_id    uuid not null references profiles(id),
  text         text not null,
  created_at   timestamptz not null default now()
);

create index if not exists form_response_notes_response_id_idx on form_response_notes(response_id);

alter table form_response_notes enable row level security;

create policy "form_response_notes: select só dono do form"
  on form_response_notes for select
  using (
    exists (
      select 1 from form_responses
      join forms on forms.id = form_responses.form_id
      where form_responses.id = form_response_notes.response_id
        and forms.owner_id = auth.uid()
    )
  );

create policy "form_response_notes: insert só dono do form"
  on form_response_notes for insert
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from form_responses
      join forms on forms.id = form_responses.form_id
      where form_responses.id = form_response_notes.response_id
        and forms.owner_id = auth.uid()
    )
  );

create policy "form_response_notes: delete só dono do form"
  on form_response_notes for delete
  using (
    exists (
      select 1 from form_responses
      join forms on forms.id = form_responses.form_id
      where form_responses.id = form_response_notes.response_id
        and forms.owner_id = auth.uid()
    )
  );
```

## Query 2 — form_visits

```sql
create table if not exists form_visits (
  id          uuid primary key default gen_random_uuid(),
  form_id     uuid not null references forms(id) on delete cascade,
  event       text not null check (event in ('opened', 'started')),
  session_id  uuid,
  created_at  timestamptz not null default now()
);

create index if not exists form_visits_form_id_idx on form_visits(form_id);
create index if not exists form_visits_form_id_event_idx on form_visits(form_id, event);

alter table form_visits enable row level security;

create policy "form_visits: insert público"
  on form_visits for insert
  with check (true);

create policy "form_visits: select só dono do form"
  on form_visits for select
  using (
    exists (
      select 1 from forms
      where forms.id = form_visits.form_id
        and forms.owner_id = auth.uid()
    )
  );
```

## Relatório final

- Confirme que as duas rodaram sem erro
- Rode `select * from form_response_notes limit 5;` e `select * from form_visits limit 5;` pra confirmar que existem (vazias, esperado)
- Qualquer erro ou aviso
