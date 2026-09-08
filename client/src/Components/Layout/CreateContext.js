import { createContext, useContext } from "react";

export const CreateContext = createContext({
  openCreatePost: () => {},
  openCreateReel: () => {},
  openSearch: () => {},
  isSearchOpen: false,
  setIsSearchOpen: () => {},
});

export const useCreateActions = () => useContext(CreateContext);
