"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Bookmark {
  id: string;
  title: string;
  url: string;
}

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const fetchBookmarks = async (uid: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("id, title, url")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    setBookmarks(data ?? []);
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  useEffect(() => {
    let channel: any;

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await fetchBookmarks(user.id);

      // 🔥 Optimistic listener
      const onAdd = (e: any) => {
        setBookmarks((prev) => [e.detail, ...prev]);
      };

      window.addEventListener("bookmark-added", onAdd);

      // 🔄 Realtime (backup sync)
      channel = supabase
        .channel("realtime-bookmarks")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${user.id}`,
          },
          () => fetchBookmarks(user.id)
        )
        .subscribe();

      return () => {
        window.removeEventListener("bookmark-added", onAdd);
        supabase.removeChannel(channel);
      };
    };

    init();
  }, []);

  return (
    <ul className="space-y-3 mt-6">
      {bookmarks.length === 0 && (
        <p className="text-gray-500">No bookmarks yet</p>
      )}

      {bookmarks.map((bookmark) => (
        <li
          key={bookmark.id}
          className="flex justify-between items-center border p-3 rounded"
        >
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {bookmark.title}
          </a>

          <button
            onClick={() => deleteBookmark(bookmark.id)}
            className="text-red-600"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
