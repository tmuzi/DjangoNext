import wretch, { Wretch, WretchError } from "wretch";
import { AuthActions } from "@/app/auth/utils";
import { storeAccessToken, getTokens, removeTokens } from "@/app/auth/actions";

import { API_BASE_URL } from "./api";

// Extract necessary functions from the AuthActions utility.
const { handleJWTRefresh } = AuthActions();

/**
 * Creates an authenticated API client with automatic token refresh.
 * Since tokens are now stored in httpOnly cookies, we need to fetch them
 * via server actions.
 */
const createAuthenticatedApi = async () => {
  const { accessToken, refreshToken } = await getTokens();

  return wretch(API_BASE_URL)
    // Initialize authentication with the access token.
    .auth(`Bearer ${accessToken}`)
    // Catch 401 errors to refresh the token and retry the request.
    .catcher(401, async (error: WretchError, request: Wretch) => {
      try {
        // Get current refresh token from server action
        const { refreshToken: currentRefreshToken } = await getTokens();
        
        if (!currentRefreshToken) {
          // No refresh token available, redirect to login
          await removeTokens();
          window.location.replace("/auth/login");
          return;
        }

        // Attempt to refresh the JWT token.
        const { access } = (await handleJWTRefresh(currentRefreshToken).json()) as {
          access: string;
        };

        // Store the new access token via server action.
        await storeAccessToken(access);

        // Replay the original request with the new access token.
        return request
          .auth(`Bearer ${access}`)
          .fetch()
          .unauthorized(async () => {
            await removeTokens();
            window.location.replace("/auth/login");
          })
          .json();
      } catch (err) {
        await removeTokens();
        window.location.replace("/auth/login");
      }
    });
};

export const fetcher = async <T = unknown>(url: string): Promise<T> => {
  const api = await createAuthenticatedApi();
  return api.get(url).json() as Promise<T>;
};