-- create 'avatar' bucket
INSERT INTO "storage"."buckets" (id, "name", public) VALUES ('avatar', 'avatar', true);

-- insert auth users (trigger automatically insert profiles)

WITH initial_users AS (
  INSERT INTO "auth"."users" (
    instance_id,
    id,
    aud,
    "role",
    email,
    encrypted_password,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    email_confirmed_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    extensions.gen_random_uuid(),
    'authenticated',
    'authenticated',
    'ringo@test.com',
    '$2a$10$6HLio/pfydJzthInY1.AO.CoUMdbtCiuMd.Lj7lfzrvikY9l88Rxm', -- equal to 'letmetwist' encrypted
    '{"provider":"email","providers":["email"]}',
    '{"initial_name":"Ringo","initial_handle":"ringo"}',
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ), (
    '00000000-0000-0000-0000-000000000000',
    extensions.gen_random_uuid(),
    'authenticated',
    'authenticated',
    'charly@test.com',
    '$2a$10$hmTpymoLuMX6ASVFD8OVKec9s6d95ftTlnXNc30wpWX23hzMugJ.a', -- equal to 'letmetwist' encrypted
    '{"provider":"email","providers":["email"]}',
    '{"initial_name":"Charly","initial_handle":"charly"}',
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  RETURNING *
)
INSERT INTO "auth"."identities" (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  id,
  id,
  CONCAT('{', '"sub": "', id ,'", "email": "', email, '"}')::jsonb,
  'email',
  created_at,
  created_at,
  updated_at
FROM initial_users;

-- insert twists

INSERT INTO "public"."twist" ("text", profile_id, created_at, updated_at)
SELECT
  'just setting up my twttr',
  id,
  '2023-09-20 12:31:33.709475+00'::timestamp,
  '2023-09-20 12:31:33.709475+00'::timestamp
FROM "public"."profile" WHERE handle = 'ringo'
UNION ALL
SELECT
  'Just joined Twister, and I have no idea what I''m doing. 🤷‍♂️ #Newbie',
  id,
  '2023-09-23 12:41:33.709475+00'::timestamp,
  '2023-09-23 12:41:33.709475+00'::timestamp
FROM "public"."profile" WHERE handle = 'ringo'
UNION ALL
SELECT
  'Day 1 on Twister: Trying to figure out if this is a dating app or a meme-sharing platform. 🤔 #Confused',
  id,
  '2023-09-24 12:49:33.709475+00'::timestamp,
  '2023-09-24 12:49:33.709475+00'::timestamp
FROM "public"."profile" WHERE handle = 'charly'
UNION ALL
SELECT
  'Life is too short to be anything but happy. 😄✨ #PositiveVibes #Happiness',
  id,
  '2023-09-26 12:53:33.709475+00'::timestamp,
  '2023-09-26 12:53:33.709475+00'::timestamp
FROM "public"."profile" WHERE handle = 'ringo'
UNION ALL
SELECT
  'If a tree falls in the forest and no one tweets about it, did it even happen? 🌲📱 #DeepThoughts',
  id,
  '2023-09-26 12:55:33.709475+00'::timestamp,
  '2023-09-26 12:55:33.709475+00'::timestamp
FROM "public"."profile" WHERE handle = 'charly'
UNION ALL
SELECT
  'Why did the dog sit in the shade? Because he didn''t want to be a hot dog! 🐶☀️ #DogJokes',
  id,
  NOW(),
  NOW()
FROM "public"."profile" WHERE handle = 'ringo'
UNION ALL
SELECT
  'They say ''do what you love,'' so I''m tweeting about dogs while binge-watching dog videos. 🐕❤️ #LivingTheDream',
  id,
  NOW(),
  NOW()
FROM "public"."profile" WHERE handle = 'charly';
