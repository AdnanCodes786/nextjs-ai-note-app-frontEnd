"use client";

import { useEffect, useState } from "react";
import Note from "@/components/Note";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);
  const router = useRouter();

  // Function to refresh notes that can be passed to child components
  const refreshNotes = () => {
    setRefreshCounter(prev => prev + 1);
  };

  useEffect(() => {
    async function fetchNotes() {
      try {
        const token = localStorage.getItem("token");
            
        if (!token) {
          router.push("/signin");
          return;
        }

        const response = await fetch("https://ai-note-app-2.onrender.com/api/notes/get-all-notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/signin");
            return;
          }
          throw new Error("Failed to fetch notes");
        }

        const data = await response.json();
        setNotes(data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [router, refreshCounter]); // Add refreshCounter as a dependency

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 p-4">
      {notes.map((note, index) => (
        <Note 
          key={index} 
          note={note} 
          
        />
      ))}
      {notes.length === 0 && (
        <div className="col-span-full text-center p-10 text-gray-500">
          You dont have any notes yet.
        </div>
      )}
    </div>
  );
}