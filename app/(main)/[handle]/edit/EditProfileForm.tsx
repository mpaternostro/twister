"use client";
import Image from "next/image";
import { type ChangeEventHandler, useState } from "react";

import { Icon } from "#components/ui/icon";
import { Input } from "#components/ui/input";
import { Label } from "#components/ui/label";
import { Textarea } from "#components/ui/textarea";

import { updateProfile } from "./actions";

interface Props {
  profile: {
    id: string;
    avatar_url: string | null;
    bio: string | null;
    handle: string;
    name: string;
  };
}

export default function EditProfileForm({ profile }: Props) {
  const [tempImage, setTempImage] = useState<string | null>(null);

  const handleAvatarChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files?.length === 1) {
      setTempImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <form
      className="flex w-full flex-col justify-center gap-2 text-foreground"
      action={updateProfile}
    >
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="avatar">Avatar</Label>
        <div className="relative">
          {tempImage || profile.avatar_url ? (
            <Image
              src={tempImage ?? `avatar/${profile.avatar_url}`}
              alt={`${profile.name} profile photo`}
              width={144}
              height={144}
              className="mx-auto aspect-square h-36 w-36 rounded-full object-cover opacity-75"
              priority
            />
          ) : (
            <div className="mx-auto w-fit rounded-full border bg-zinc-200">
              <Icon name="person" className="h-36 w-36 p-6 text-zinc-600" />
            </div>
          )}
          <div className="absolute left-[calc(50%-20px)] top-[calc(50%-20px)] h-10 w-10 rounded-xl transition-all hover:bg-zinc-500 hover:bg-opacity-40">
            <Icon
              className="absolute left-[calc(50%-10px)] top-[calc(50%-10px)] h-5 w-5 text-white"
              name="pencil-1"
            />
            <input
              type="file"
              id="avatar"
              name="avatar"
              className="absolute left-[calc(50%-20px)] top-[calc(50%-20px)] h-10 w-10 opacity-0"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          id="name"
          name="name"
          placeholder="John Doe"
          defaultValue={profile.name}
          required
        />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="handle">Handle</Label>
        <Input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          id="handle"
          aria-describedby="handle-description"
          name="handle"
          placeholder="johndoe"
          defaultValue={profile.handle}
          required
        />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          id="bio"
          name="bio"
          placeholder="Where are you from? What do you do?"
          rows={4}
          defaultValue={profile.bio ?? undefined}
        />
      </div>

      <button className="mb-2 rounded border bg-blue-700 px-4 py-2 text-white">
        Update
      </button>
    </form>
  );
}
