import {
  AiOutlineHome,
  AiFillHome,
  AiOutlineCompass,
  AiFillCompass,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlinePlusCircle,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { RiVideoFill, RiVideoLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { MdOutlineAutoStories } from "react-icons/md";

export const desktopNav = [
  { id: "home", label: "Home", to: "/", icon: AiOutlineHome, activeIcon: AiFillHome },
  { id: "explore", label: "Explore", to: "/explore", icon: AiOutlineCompass, activeIcon: AiFillCompass },
  { id: "craft", label: "Craft", to: "/learning_plan", icon: MdOutlineAutoStories, activeIcon: MdOutlineAutoStories },
  { id: "reels", label: "Reels", to: "/reels", icon: RiVideoLine, activeIcon: RiVideoFill },
  { id: "activity", label: "Activity", to: "/notifications", icon: AiOutlineHeart, activeIcon: AiFillHeart },
  { id: "create", label: "Create", action: "create-post", icon: AiOutlinePlusCircle, activeIcon: AiOutlinePlusCircle },
  { id: "profile", label: "Profile", to: "profile", icon: CgProfile, activeIcon: CgProfile },
  { id: "about", label: "About", to: "/about", icon: AiOutlineInfoCircle, activeIcon: AiOutlineInfoCircle },
];

export const mobileNav = [
  { id: "home", label: "Home", to: "/", icon: AiOutlineHome, activeIcon: AiFillHome },
  { id: "explore", label: "Explore", to: "/explore", icon: AiOutlineCompass, activeIcon: AiFillCompass },
  { id: "create", label: "Create", action: "create-post", icon: AiOutlinePlusCircle, activeIcon: AiOutlinePlusCircle },
  { id: "reels", label: "Reels", to: "/reels", icon: RiVideoLine, activeIcon: RiVideoFill },
  { id: "profile", label: "Profile", to: "profile", icon: CgProfile, activeIcon: CgProfile },
];

export const unreadActivityCount = (notification) => {
  const unread = notification?.unreadNotifications;
  if (Array.isArray(unread)) return unread.length;
  const all = notification?.notifications;
  if (!Array.isArray(all)) return 0;
  return all.filter((item) => item && item.isRead === false).length;
};

export const getActiveNavId = (pathname, username) => {
  if (pathname === "/" || pathname.startsWith("/p/")) return "home";
  if (pathname.startsWith("/explore")) return "explore";
  if (pathname.startsWith("/learning_plan") || pathname.startsWith("/learning-progress")) return "craft";
  if (pathname.startsWith("/reels")) return "reels";
  if (pathname.startsWith("/notifications")) return "activity";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/create-story")) return "create";
  if (username && pathname === `/${username}`) return "profile";
  return "";
};
