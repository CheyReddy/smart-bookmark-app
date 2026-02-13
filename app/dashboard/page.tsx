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

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const normalizeUrl = (url: string): string => {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const addBookmark = async () => {
    if (!title || !url) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const finalUrl = normalizeUrl(url);

    const { data, error } = await supabase
      .from("bookmarks")
      .insert({
        title,
        url: finalUrl,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error(error.message);
      return;
    }

    window.dispatchEvent(
      new CustomEvent("bookmark-added", { detail: data })
    );

    setTitle("");
    setUrl("");
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-1xl font-bold">
          Smart Bookmark
        </h1>

        <button
          onClick={logout}
          className="text-sm sm:text-base text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>

      {/* 🔹 Form */}
      <div className="flex justify-center">
        <div className="w-full max-w-md space-y-4">
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
            className="w-full bg-green-800 text-white py-2 rounded text-lg"
          >
            Add Bookmark
          </button>

          {/* 🔹 Bookmark list */}
          <BookmarkList />
        </div>
      </div>
    </div>
  );
}
