import React, { useState, useContext, FormEvent } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import PageBanner from '../components/PageBanner';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    const result = await login(email, password);
    if (!result.success) {
      const finalError = `${result.error} If this is your first time, please ensure an admin user has been created in your Firebase project's "Authentication" section.`;
      setError(finalError);
    }
    setIsLoggingIn(false);
  };

  return (
    <div className="pt-20">
        <PageBanner 
            title="Admin Login"
            subtitle="Please enter your credentials to access the admin panel."
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-md mx-auto bg-[var(--color-light-bg)] p-8 rounded-[var(--ui-border-radius)] shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[var(--color-light-text)] mb-2">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                            placeholder="Enter your gmail"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[var(--color-light-text)] mb-2">Password</label>
                         <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-[var(--ui-border-radius)] py-3 px-4 text-[var(--color-light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                            placeholder="Enter your password"
                        />
                    </div>
                    
                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <div>
                        <button type="submit" disabled={isLoggingIn} className="w-full bg-[var(--color-primary)] text-white font-bold py-3 px-6 rounded-[var(--ui-button-radius)] hover:bg-[var(--color-primary-dark)] transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500">
                            {isLoggingIn ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default LoginPage;