"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loading-button";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";

// Interface based on the provided schema
interface NoteModel {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface AddEditNoteDialogProps {
  open: boolean;
  setOpenAction: (open: boolean) => void;
  noteToEdit?: NoteModel;
}

export default function AddEditNoteDialog({
  open,
  setOpenAction,
  noteToEdit,
}: AddEditNoteDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [errors, setErrors] = useState({ title: "", content: "" });
  
  const router = useRouter();

  // Update form when noteToEdit changes
  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
    } else {
      setTitle("");
      setContent("");
    }
    // Clear any errors when dialog opens/closes
    setErrors({ title: "", content: "" });
  }, [noteToEdit, open]);

  function validateForm() {
    const newErrors = { title: "", content: "" };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw Error("Not authenticated");
      }
  
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
  
      if (noteToEdit) {
        // Update existing note using POST to update-note endpoint
        await axios.post(
          "https://ai-note-app-3.onrender.com/api/notes/update-note",
          { 
            id: noteToEdit.id,
            title, 
            content 
          },
          { headers }
        );
        router.refresh(); // This line is key


      } else {
        // Create new note
        await axios.post(
          "https://ai-note-app-3.onrender.com/api/notes/create-note",
          { title, content },
          { headers }
        );
        router.refresh(); // This line is key

        // Reset form
        setTitle("");
        setContent("");
      }
  
      router.refresh();
      setOpenAction(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteNote() {
    if (!noteToEdit) {
      return;
    }
    
    setDeleteInProgress(true);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw Error("Not authenticated");
      }
  
      // Using POST with the id in the request body for consistency with your API
      await axios.delete("https://ai-note-app-3.onrender.com/api/notes/delete-note", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { id: noteToEdit.id } // Send ID in the request body for DELETE
      });
      
      
      router.refresh();
      setOpenAction(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpenAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{noteToEdit ? "Edit Note" : "Add Note"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Note Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Note Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Note content"
              rows={5}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          <DialogFooter className="gap-1 sm:gap-0">
            {noteToEdit && (
              <LoadingButton
                type="button"
                variant="destructive"
                onClick={deleteNote}
                loading={deleteInProgress}
                disabled={isSubmitting}
              >
                Delete
              </LoadingButton>
            )}
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              disabled={deleteInProgress}
            >
              Submit
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}