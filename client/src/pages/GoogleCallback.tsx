import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES, STORAGE_KEYS } from "@/constants";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processAuth = () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");
      const errorParam = searchParams.get("error");

      console.log("GoogleCallback - Processing auth:", {
        accessToken: accessToken ? "present" : "missing",
        refreshToken: refreshToken ? "present" : "missing",
        error: errorParam,
        allParams: Object.fromEntries(searchParams.entries()),
      });

      if (errorParam) {
        setError(decodeURIComponent(errorParam));
        const timer = setTimeout(() => {
          void navigate(ROUTES.LOGIN);
        }, 3000);
        return () => {
          clearTimeout(timer);
        };
      }

      if (accessToken && refreshToken) {
        console.log("GoogleCallback - Saving tokens to localStorage");
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

        // Mark as authenticated
        const authStore = useAuthStore.getState();
        authStore.checkAuth();

        console.log("GoogleCallback - Navigating to home");
        void navigate(ROUTES.HOME);
      } else {
        console.error("GoogleCallback - Missing tokens");
        setError("Invalid authentication response");
        const timer = setTimeout(() => {
          void navigate(ROUTES.LOGIN);
        }, 3000);
        return () => {
          clearTimeout(timer);
        };
      }
    };

    processAuth();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='max-w-md rounded-lg bg-white p-8 shadow'>
          <div className='mb-4 text-center'>
            <svg className='mx-auto h-12 w-12 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>
          <h2 className='mb-2 text-center text-xl font-bold text-gray-900'>Authentication Failed</h2>
          <p className='text-center text-gray-600'>{error}</p>
          <p className='mt-4 text-center text-sm text-gray-500'>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50'>
      <div className='max-w-md rounded-lg bg-white p-8 shadow'>
        <div className='mb-4 text-center'>
          <svg className='mx-auto h-12 w-12 animate-spin text-indigo-600' fill='none' viewBox='0 0 24 24'>
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
        </div>
        <h2 className='mb-2 text-center text-xl font-bold text-gray-900'>Processing Authentication</h2>
        <p className='text-center text-gray-600'>Please wait while we complete your login...</p>
      </div>
    </div>
  );
}
