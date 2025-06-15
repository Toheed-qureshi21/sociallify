import { clsx } from "clsx";
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getNotificationIcon = (type) => {
  switch (type) {
    case 'LIKE':
      return <HeartIcon className=" text-red-500" />;
    case "COMMENT":
      return <MessageCircleIcon className="size-6 text-blue-500" />;
    case "FOLLOW":
      return <UserPlusIcon className="size-6 text-green-500" />;
    default:
      return null;
  }
}
