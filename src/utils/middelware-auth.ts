import { NextRequest } from "next/server";

export async function middlewareAuth(req?: NextRequest) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const cookies = req?.cookies.toString() || "";

    const response = await fetch(`${API_URL}/api/users/request/current/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies,
      },
      credentials: "include",
    });


    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();


    if (data.success && data.data) {
      return data.data;
    }

    return null;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return null;
  }
}
