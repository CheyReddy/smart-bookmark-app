"use client";

import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import BookmarkList from "@/components/BookmarkList";

export default function Dashboard(): JSX.Element {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/");
    };
    checkUser();
  }, [router]);

  const normalizeUrl = (url: string): string =>
    /^https?:\/\//i.test(url) ? url : `https://${url}`;

  const addBookmark = async () => {
    if (!title || !url) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .insert({
        title,
        url: normalizeUrl(url),
        user_id: user.id,
      })
      .select()
      .single();

    if (!error) {
      window.dispatchEvent(
        new CustomEvent("bookmark-added", { detail: data })
      );
      setTitle("");
      setUrl("");
    }
  };

  return (
    <div className="min-h-screen px-4 pt-7 bg-gray-50">
      <h1 className="text-center text-2xl text-black sm:text-3xl md:text-4xl font-bold mb-4">
        Smart Bookmark App
      </h1>

      <div className="max-w-xl mx-auto bg-black p-6 sm:p-8 rounded-xl shadow space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:ring-green-300"
        />

        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:ring-green-300"
        />

        <button
          onClick={addBookmark}
          className="w-full bg-green-700 cursor-pointer hover:bg-green-800 text-white text-lg py-2 rounded transition"
        >
          Add Bookmark
        </button>

        <BookmarkList />
      </div>
    </div>
  );
}
