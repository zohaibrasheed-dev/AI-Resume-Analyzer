import React, { useEffect } from 'react'
import { Navigate, useNavigate, useSearchParams } from "react-router";

const Auth = () => {

  const navigate = useNavigate();
  const [urlSearchParams] = useSearchParams();

  const loginModule = () => {
    
    if((window as any).puter) { // Only Run code when Puter is Ready
      const puter = (window as any).puter;
      
      puter.auth.signIn() // If user get loddedIn
      .then(() => { // Then
        const redirectTo = urlSearchParams.get('next') || '/';
        navigate(redirectTo);
      })
      .catch((error:any) => { // If login failed
        console.log("Login Failed!", error);
      })

    }

  }

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="welcomeArea rounded-3xl border-2 border-solid border-indigo-300 w-2xl overflow-hidden">
        <div className="welcome-inner p-14 bg-amber-200 rounded-xl">
          <div className="welcome-header text-center">
            <h1>Welcome</h1>
            <p className="text-xl mt-4">Log In to Continue Your Job Journey</p>
          </div>
          <div className="welcome-footer flex justify-center mt-12">
            <button className="auth-button" onClick={loginModule}>Login</button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Auth