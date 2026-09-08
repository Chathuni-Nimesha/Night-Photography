export const getAuthToken = () => {
  const token = localStorage.getItem("token");
  if (!token || token === "null" || token === "undefined") {
    return null;
  }
  return token;
};

export const isAuthenticated = () => Boolean(getAuthToken());

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const handleUnauthorized = (res) => {
  if (!res || res.status !== 401) {
    return false;
  }
  clearAuth();
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
  return true;
};
