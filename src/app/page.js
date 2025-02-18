"use client";

import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, provider } from "../../firebase";
import Cookies from "js-cookie";
import { FcGoogle } from "react-icons/fc"; // Google icon

export default function Login() {
  const router = useRouter();

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      Cookies.set("userToken", token, { expires: 1 });
      router.push("/music");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="p-8 bg-white/10 backdrop-blur-md shadow-lg rounded-2xl text-center w-96 border border-white/20">
        <h1 className="text-4xl font-bold mb-4 text-white">Welcome Back</h1>
        <p className="text-gray-300 mb-6">Sign in to continue</p>
        <button
          onClick={loginWithGoogle}
          className="flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-200 w-full"
        >
          <FcGoogle className="text-2xl" /> Login with Google
        </button>
      </div>
    </div>
  );
}
