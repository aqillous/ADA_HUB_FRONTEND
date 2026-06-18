import API_BASE_URL from "../config";

let isRefreshing = false;
let refreshPromise = null;

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null; // don't logout yet

  try {
    const res = await fetch(`${API_BASE_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return null; // refresh failed, let caller handle logout

    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    return data.access_token;
  } catch (err) {
    console.error("Refresh error:", err);
    return null;
  }
}

export async function authFetch(url, options = {}) {
  let token = localStorage.getItem("token");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // Only try refresh if 401 (unauthenticated)
  if (res.status !== 401) return res;

  // Start refresh only once
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshAccessToken().finally(() => {
      isRefreshing = false;
    });
  }

  const newToken = await refreshPromise;

  if (!newToken) {
    logout(); // Refresh token invalid or expired
    return res;
  }

  // Retry original request with new access token
  res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${newToken}`,
    },
  });

  return res; // return whatever the backend returns (200, 403, etc.)
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
}
