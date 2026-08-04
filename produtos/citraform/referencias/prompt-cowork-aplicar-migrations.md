# Prompt para Claude Cowork — aplicar migrations no Supabase (citraform-prod)

Copie e cole no Cowork com o navegador logado no dashboard do Supabase.

---

Abra o projeto **`citraform-prod`** no Supabase Dashboard → **SQL Editor** → New Query. Rode os 3 blocos abaixo **na ordem, um de cada vez** (execute o primeiro, confirme sucesso, depois o segundo, e assim por diante — não cole os três juntos).

## Query 1

```sql
create table if not exists profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  email            text,
  full_name        text,
  company_name     text,
  phone            text,
  plan             text not null default 'free',
  promo_code_used  text,
  created_at       timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles: acesso somente ao próprio usuário"
  on profiles for all
  using  (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
```

## Query 2

```sql
create table if not exists promo_codes (
  code        text primary key,
  plan        text not null default 'free',
  max_uses    int,
  used_count  int not null default 0,
  expires_at  timestamptz,
  created_at  timestamptz not null default now()
);

alter table promo_codes enable row level security;

create policy "promo_codes: somente service_role"
  on promo_codes for all
  using (false);
```

## Query 3

```sql
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();
```

(Isso desfaz o trigger criado na Query 1 — sim, é intencional rodar as duas em sequência. A tabela `profiles` continua existindo, só o trigger automático de criação é removido, porque o app cria a linha manualmente no código depois da verificação do código de login.)

## Relatório final

- Confirme que as 3 queries rodaram sem erro
- Rode um `select * from profiles limit 5;` e um `select * from promo_codes limit 5;` só pra confirmar que as tabelas existem e estão vazias (esperado, ainda não tem usuário nenhum)
- Qualquer erro ou aviso que apareceu
