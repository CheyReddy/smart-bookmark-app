"use client";

import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import BookmarkList from "@/components/BookmarkList";

export default function Dashboard(): JSX.Element {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // 🔐 Protect dashboard
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
      }
    };

    checkUser();
  }, [router]);

  const addBookmark = async () => {
    if (!title.trim() || !url.trim()) {
      alert("Title and URL required");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    if (error) {
      console.error(error.message);
      return;
    }

    setTitle("");
    setUrl("");
  };

  return (
    <div className="p-8 space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />

      <input
        type="url"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />

      <button
        onClick={addBookmark}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Add
      </button>

      <BookmarkList />
    </div>
  );
}
