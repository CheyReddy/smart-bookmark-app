"use client";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/dashboard`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 px-4">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-lg text-black sm:text-xl font-semibold">
            Signup / Signin to
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-800 mt-2">
            Smart Bookmark
          </h2>
        </div>

        <button
          onClick={login}
          className="w-full flex items-center cursor-pointer justify-center gap-3 bg-black text-white py-3 rounded-full hover:bg-gray-800 transition"
        >
          Sign in with Google
        </button>

      </div>
    </div>
  );
}
