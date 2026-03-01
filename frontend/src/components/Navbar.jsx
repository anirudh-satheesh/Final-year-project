import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ children, rightContent }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loginWithGoogle, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <nav className="relative w-full z-50 bg-zinc-950/80 backdrop-blur-xl px-6 h-16 flex items-center">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">

                {/* Left Side: Logo & Main Navigation */}
                <div className="flex items-center gap-8">
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        {/* Logo: White square with black 's.' */}
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center font-bold text-black text-xl leading-none shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
                            s.
                        </div>

                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">Strive</span>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-8">
                        <button
                            onClick={() => navigate('/')}
                            className="group flex items-center gap-1.5 text-[12px] font-black text-zinc-500 hover:text-white transition-all uppercase tracking-[0.2em]"
                        >
                            Explore
                            <svg className="group-hover:translate-y-0.5 transition-transform text-zinc-600 group-hover:text-blue-500" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </button>
                        <button className="flex items-center gap-1.5 text-[12px] font-black text-zinc-500 hover:text-white transition-all uppercase tracking-[0.2em]">
                            My Journey
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-1.5 text-[12px] font-black text-zinc-500 hover:text-white transition-all uppercase tracking-[0.2em]"
                        >
                            Dashboard
                        </button>
                    </div>

                    {/* Custom Center/Left Children (e.g. for Roadmap subject name) */}
                    {children && <div className="hidden xl:block ml-4 border-l border-white/10 pl-8">{children}</div>}
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-6">
                    {rightContent ? rightContent : (
                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="w-10 h-10 rounded-full border border-white/10 overflow-hidden hover:border-blue-500/50 transition-all active:scale-95 flex items-center justify-center bg-zinc-900"
                                    >
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-xs font-bold text-blue-400">
                                                {user.displayName?.charAt(0) || user.email?.charAt(0)}
                                            </div>
                                        )}
                                    </button>

                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-3 w-48 bg-zinc-900 border border-white/10 rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                                            <div className="px-4 py-2 border-b border-white/5 mb-1">
                                                <p className="text-sm font-bold text-white truncate">{user.displayName}</p>
                                                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setShowUserMenu(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={loginWithGoogle}
                                    className="px-8 py-2 bg-white text-black text-[11px] font-black rounded-full hover:bg-zinc-200 transition-all shadow-lg active:scale-95 uppercase tracking-[0.2em] flex items-center gap-2"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Get Started
                                </button>
                            )}
                        </div>
                    )}

                    {/* Hamburger Menu Icon */}
                    <div className="text-zinc-600 hover:text-white transition-colors cursor-pointer ml-2 border-l border-white/10 pl-6 h-6 flex items-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="12" x2="20" y2="12"></line>
                            <line x1="4" y1="6" x2="20" y2="6"></line>
                            <line x1="4" y1="18" x2="20" y2="18"></line>
                        </svg>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
