create policy "Allow insert to Authenticated users"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'avatar'::text));



