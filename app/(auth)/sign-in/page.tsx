'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import Image from 'next/image';
import { ROUTES } from '@/constants/routes';
import { Logo } from '@/components/ui/Logo';

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn('google', {
        callbackUrl: ROUTES.HOME,
        redirect: false,
      });
    } catch (error) {
      toast.error('Sign-in Failed', {
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred during sign-in.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Logo className="size-20" />
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to{' '}
            <span className="inline-block text-3xl font-bold text-lime-600">
              Twin
            </span>
            <span className="inline-block text-3xl font-bold text-stone-500">
              AI
            </span>
          </h2>
          <div></div>
          <p className="mt-2 text-gray-600">
            Sign in to access your therapist dashboard
          </p>
        </div>
      </div>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Therapist Access</span>
        </div>
      </div>

      <div className="space-y-6">
        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="flex w-full items-center justify-center space-x-3 rounded-md border border-gray-300 px-4 py-3 text-gray-700 transition-colors duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
        >
          <Image
            src="/icons/google.svg"
            alt="Google Logo"
            width={20}
            height={20}
            className="mr-2.5 object-contain"
          />
          <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
        </button>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        <p>
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
