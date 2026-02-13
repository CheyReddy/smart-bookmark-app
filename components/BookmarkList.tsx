"use client";

import { JSX, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Bookmark {
  id: string;
  title: string;
  url: string;
}

export default function BookmarkList(): JSX.Element {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const fetchBookmarks = async (): Promise<void> => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("id, title, url")
      .order("created_at", { ascending: false });

    if (!error) {
      setBookmarks(data ?? []);
    }
  };

  const deleteBookmark = async (id: string): Promise<void> => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  useEffect(() => {
  const setupRealtime = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    fetchBookmarks();

    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        fetchBookmarks
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  setupRealtime();
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
