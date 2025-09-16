import React from 'react';
import { Lock, HelpCircle } from 'lucide-react';
import { SignIn } from '@clerk/clerk-react';

const Login: React.FC = () => {
  return (
    <div 
      className="min-h-screen relative flex items-center justify-center"
      style={{
        backgroundImage: `url('/loginpage.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Login Component */}
      <div 
        className="relative bg-white bg-opacity-10 backdrop-blur-md rounded-none border border-white border-opacity-30 p-8 w-full max-w-md mx-4 shadow-2xl hover:bg-opacity-15 hover:backdrop-blur-lg transition-all duration-300"
        style={{ 
          zIndex: 1,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif"
        }}
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-white mb-2 tracking-wide">
            Disaster Management System
          </h1>
          <p className="text-white text-sm opacity-70 font-light tracking-wider">
            AUTHORITY LOGIN
          </p>
        </div>


        {/* Clerk SignIn Component */}
        <div className="mt-6">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm border border-white border-opacity-40 rounded-none px-8 py-4 text-white font-light text-sm tracking-wider transition-all duration-300 hover:shadow-lg',
                socialButtonsBlockButton: 'bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-none px-4 py-3 text-white font-light text-sm tracking-wider transition-all duration-300 hover:shadow-lg mb-4',
                card: 'shadow-none bg-transparent',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                formFieldInput: 'bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 rounded-none px-4 py-4 text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:border-white focus:border-opacity-50 focus:bg-opacity-15 transition-all duration-300 font-light tracking-wide',
                formFieldLabel: 'text-white text-sm font-light mb-3 tracking-wider',
                footerAction: 'hidden',
                identityPreviewText: 'text-white',
                formFieldHintText: 'text-white text-opacity-60',
                footerActionLink: 'text-white text-opacity-80 hover:text-white',
                socialButtonsBlockButtonText: 'text-white font-light tracking-wider',
                socialButtonsBlockButtonArrow: 'text-white',
                socialButtonsBlockButtonIcon: 'text-white'
              }
            }}
            redirectUrl="/"
          />
        </div>

        {/* Help/Support Section */}
        <div className="flex items-center justify-center mt-6">
          <button className="w-12 h-12 rounded-none border border-white border-opacity-40 bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center mr-3 hover:bg-opacity-20 transition-all duration-300">
            <HelpCircle className="w-5 h-5 text-white text-opacity-80" />
          </button>
          <span className="text-white text-sm font-light tracking-wider opacity-80">HELP/SUPPORT</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
