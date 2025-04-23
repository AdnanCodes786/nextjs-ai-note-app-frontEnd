"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import AddEditNoteDialog from "@/components/AddEditNoteDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import logoWhite from "@/assets/logo-white.png";
import logoBlack from "@/assets/logo-black.png";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function NavBar() {

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUserInitial(userData?.name?.charAt(0) || userData?.email?.charAt(0) || "U");
      setUserName(userData?.name || "");
      setUserEmail(userData?.email || "");
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      setUserInitial("U");
    }
  }, []);
  const { theme } = useTheme();
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const [userInitial, setUserInitial] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  // Get user from localStorage (if available)
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

      
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <>
      <div className="p-4 shadow">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-1">
            <Image
              className="block dark:hidden"
              src={logoBlack}
              width={40}
              height={40}
              alt="AIBrain Logo"
            />
            <Image
              className="hidden dark:block"
              src={logoWhite}
              width={40}
              height={40}
              alt="AIBrain Logo"
            />
            <span className="hidden font-bold sm:block">AIBrain</span>
          </Link>
          <div className="flex items-center gap-2">
            {/* Custom User Button instead of Clerk UserButton */}
            <div className="group relative">
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-medium text-indigo-700 focus:outline-none dark:bg-indigo-900 dark:text-indigo-300"
                onClick={() => {}}
              >
                {userInitial}
              </button>
              <div className="invisible absolute right-0 z-50 mt-2 w-48 rounded-md bg-white py-2 opacity-0 shadow-lg transition-all duration-300 group-hover:visible group-hover:opacity-100 dark:bg-gray-800">
                <div className="border-b border-gray-200 px-4 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-200">
                {userName || userEmail || "User"}
                </div>
                <button
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </div>
            </div>
            <ThemeToggleButton />
            <Button
              className="sm:hidden"
              onClick={() => setShowAddEditNoteDialog(true)}
            >
              {/* <Plus size={20} /> */}
            </Button>
            <Button
              className="hidden sm:flex"
              onClick={() => setShowAddEditNoteDialog(true)}
            >
              {/* <Plus size={20} className="mr-2" /> */}
              Add Note
            </Button>
          </div>
        </div>
      </div>
      <AddEditNoteDialog
        open={showAddEditNoteDialog}
        setOpenAction={setShowAddEditNoteDialog}
      />
    </>
  );
}
