import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/constants";
import type { RegisterRequest, SendOTPRequest } from "@/types/auth";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "form">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phoneNumber: "",
    code: "",
  });

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    void (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const otpData: SendOTPRequest = {
          email: formData.email,
          type: "REGISTER",
        };
        await authService.sendOTP(otpData);
        setStep("form");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send OTP");
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    void (async () => {
      setIsLoading(true);
      setError(null);

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      try {
        await authService.register(formData);
        void navigate(ROUTES.LOGIN);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Registration failed");
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (step === "email") {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md space-y-8'>
          <div>
            <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>Create your account</h2>
            <p className='mt-2 text-center text-sm text-gray-600'>
              Already have an account?{" "}
              <Link to={ROUTES.LOGIN} className='font-medium text-indigo-600 hover:text-indigo-500'>
                Sign in
              </Link>
            </p>
          </div>

          <form className='mt-8 space-y-6' onSubmit={handleSendOTP}>
            {error && (
              <div className='rounded-md bg-red-50 p-4'>
                <p className='text-sm text-red-800'>{error}</p>
              </div>
            )}

            <div>
              <label htmlFor='email' className='sr-only'>
                Email address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={formData.email}
                onChange={handleChange}
                className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                placeholder='Email address'
              />
            </div>

            <div>
              <button
                type='submit'
                disabled={isLoading}
                className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50'
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
            Complete your registration
          </h2>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleRegister}>
          {error && (
            <div className='rounded-md bg-red-50 p-4'>
              <p className='text-sm text-red-800'>{error}</p>
            </div>
          )}

          <div className='space-y-4 rounded-md shadow-sm'>
            <div>
              <label htmlFor='code' className='sr-only'>
                OTP Code
              </label>
              <input
                id='code'
                name='code'
                type='text'
                required
                maxLength={6}
                value={formData.code}
                onChange={handleChange}
                className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                placeholder='6-digit OTP code'
              />
            </div>

            <div>
              <label htmlFor='name' className='sr-only'>
                Full Name
              </label>
              <input
                id='name'
                name='name'
                type='text'
                required
                value={formData.name}
                onChange={handleChange}
                className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                placeholder='Full name'
              />
            </div>

            <div>
              <label htmlFor='phoneNumber' className='sr-only'>
                Phone Number
              </label>
              <input
                id='phoneNumber'
                name='phoneNumber'
                type='tel'
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                placeholder='Phone number'
              />
            </div>

            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                required
                value={formData.password}
                onChange={handleChange}
                className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                placeholder='Password (min 8 characters)'
              />
            </div>

            <div>
              <label htmlFor='confirmPassword' className='sr-only'>
                Confirm Password
              </label>
              <input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                placeholder='Confirm password'
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50'
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
