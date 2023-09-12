create table "public"."profile" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "handle" text unique not null,
    "name" text not null,
    "bio" text
);

alter table "public"."profile" enable row level security;

create table "public"."twist" (
    "id" uuid not null default gen_random_uuid(),
    "text" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "profile_id" uuid not null
);

alter table "public"."twist" enable row level security;

CREATE UNIQUE INDEX profile_pkey ON public.profile USING btree (id);

CREATE UNIQUE INDEX twist_pkey ON public.twist USING btree (id);

alter table "public"."profile" add constraint "profile_pkey" PRIMARY KEY using index "profile_pkey";

alter table "public"."profile" add constraint "profile_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profile" validate constraint "profile_id_fkey";

alter table "public"."twist" add constraint "twist_pkey" PRIMARY KEY using index "twist_pkey";

alter table "public"."twist" add constraint "twist_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES "profile"(id) not valid;

alter table "public"."twist" validate constraint "twist_profile_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profile (id, "name", handle)
  values (new.id, new.raw_user_meta_data ->> 'initial_name', new.raw_user_meta_data ->> 'initial_handle');
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_profile_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_twist_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

create policy "Enable read access for all users"
on "public"."profile"
as permissive
for select
to public
using (true);

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

CREATE TRIGGER on_profile_updated BEFORE UPDATE ON public.profile FOR EACH ROW EXECUTE FUNCTION handle_profile_update();

CREATE TRIGGER on_twist_updated BEFORE UPDATE ON public.twist FOR EACH ROW EXECUTE FUNCTION handle_twist_update();
