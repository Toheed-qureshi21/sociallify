import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Trash2Icon } from "lucide-react";

export default function DeleteDialog(){
return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="destructive">
                <Trash2Icon/>
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
                <AlertDialogAction>
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    )
 }