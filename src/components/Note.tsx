"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import AddEditNoteDialog from "./AddEditNoteDialog";
import axios from "axios";

// Interface based on the provided schema
interface NoteModel {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface NoteProps {
  note: NoteModel;
}

export default function Note({ note }: NoteProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  
  // Check if the note was updated
  const wasUpdated = new Date(note.updated_at) > new Date(note.created_at);
  
  // Format the date
  const createdUpdatedAtTimestamp = new Date(
    wasUpdated ? note.updated_at : note.created_at
  ).toDateString();

  const handleGetSummary = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the edit dialog
    
    if (summary) {
      
      setShowSummary(!showSummary);
      return;
    }
    
    setIsLoadingSummary(true);
    setSummaryError(null);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Not authenticated");
      }
      
      
      const checkResponse = await axios.post(
        `https://ai-note-app-3.onrender.com/api/ai/get-summary`,
        { noteId: note.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (checkResponse.data && checkResponse.data.summary) {
        // Existing summary found
        setSummary(checkResponse.data.summary);
        setShowSummary(true);
        return;
      }
      
      // Generate a new summary
      const response = await axios.post(
        "https://ai-note-app-3.onrender.com/api/ai/create-summary",
        { noteId: note.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response);
      
      if (response.data && response.data.summary) {
        setSummary(response.data.summary);
        setShowSummary(true);
      } else {
        throw new Error("Failed to generate summary");
      }
    } catch (error) {
      console.error("Error getting summary:", error);
      setSummaryError("Failed to generate summary. Please try again.");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  return (
    <>
      <Card className="transition-shadow hover:shadow-lg">
        <div onClick={() => setShowEditDialog(true)} className="cursor-pointer">
          <CardHeader>
            <CardTitle>{note.title}</CardTitle>
            <CardDescription>
              {createdUpdatedAtTimestamp}
              {wasUpdated && " (updated)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{note.content}</p>
          </CardContent>
        </div>
        
        {/* AI Summary Section */}
        <CardFooter className="flex flex-col items-start pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGetSummary}
            disabled={isLoadingSummary}
            className="flex items-center gap-2"
          >
            {isLoadingSummary ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Summary...
              </>
            ) : summary ? (
              <>
                {showSummary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showSummary ? "Hide AI Summary" : "Show AI Summary"}
              </>
            ) : (
              "Get AI Summary"
            )}
          </Button>
          
          {summaryError && (
            <p className="text-sm text-red-500 mt-2">{summaryError}</p>
          )}
          
          {showSummary && summary && (
            <div className="mt-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-md w-full">
              <h4 className="text-sm font-medium mb-1">AI Summary:</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{summary}</p>
            </div>
          )}
        </CardFooter>
      </Card>

      <AddEditNoteDialog
        open={showEditDialog}
        setOpenAction={setShowEditDialog}
        noteToEdit={note}
      />
    </>
  );
}