alter table "public"."profile" add column "avatar_url" text;

create policy "Enable update for own profile only."
on "public"."profile"
as permissive
for update
to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));


create policy "Enable read access for all users"
on "public"."twist"
as permissive
for select
to public
using (true);



