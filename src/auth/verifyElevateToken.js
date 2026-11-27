import { apiClient } from "../api/client"
import { API_ENDPOINTS } from "../constants/urls"

// Verifies the wrapper token server-side.
// Throws on 401 or any profile error. Returns userProfile from { userId, userProfile }.
export async function verifyElevateToken(token) {
  const response = await apiClient.get(API_ENDPOINTS.GET_PROFILE_DETAILS_V2, {
    headers: { "x-auth-token": token },
  })
  return response.data?.userProfile
}