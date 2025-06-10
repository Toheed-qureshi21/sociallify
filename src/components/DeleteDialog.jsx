'use client'
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Loader2, Trash2Icon } from "lucide-react";
import { useUser } from "./UserContextProvider";

export default function DeleteDialog({onDelete}){
    const {isDeleting} = useUser();
return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="destructive" >
                {
                    isDeleting ? (
                        <Loader2 className="animate-spin"/>
                    ):(
                        <Trash2Icon/>
                    )
                }
            </Button>   
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you want to delete Post?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone. This will permanently delete your post.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>
                    Cancel 
                </AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} disabled={isDeleting} className="flex gap-0.5 items-center">
                    {
                        isDeleting ? (
                            <>
                            <span>Deleting</span>
                            <Loader2 className="animate-spin"/>
                            </>
                        ):(
                            "Delete"
                        )
                    }
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    )
 }