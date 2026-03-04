import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ children, rightContent, menuItems = [] }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loginWithGoogle } = useAuth();
    const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

    return (
        <nav className="relative w-full z-50 bg-zinc-950/80 backdrop-blur-xl px-6 h-16 flex items-center border-b border-white/5">
            <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between relative">

                {/* Left Side: Logo & Main Navigation */}
                <div className="flex items-center gap-8 relative z-10">
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center font-bold text-black text-xl leading-none shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
                            s.
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">Strive</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-8">
                        <button
                            onClick={() => navigate('/explore')}
                            className="group flex items-center gap-1.5 text-[12px] font-black text-zinc-500 hover:text-white transition-all uppercase tracking-[0.2em]"
                        >
                            Explore
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-1.5 text-[12px] font-black text-zinc-500 hover:text-white transition-all uppercase tracking-[0.2em]"
                        >
                            Dashboard
                        </button>
                    </div>
                </div>

                {/* Center Content: Absolutely Centered for perfect symmetry */}
                {children && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden xl:block z-0 pointer-events-auto">
                        {children}
                    </div>
                )}

                {/* Right Side: Actions & Auth */}
                <div className="flex items-center gap-4 relative z-10">
                    {/* Page Specific Actions (e.g. Progress bar) */}
                    {rightContent && (
                        <div className="hidden md:flex items-center pr-6 border-r border-white/10 h-8">
                            {rightContent}
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => navigate('/profile')}
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
                            </div>
                        ) : (
                            <button
                                onClick={loginWithGoogle}
                                className="px-8 py-2 bg-white text-black text-[11px] font-black rounded-full hover:bg-zinc-200 transition-all shadow-lg active:scale-95 uppercase tracking-[0.2em] flex items-center gap-2"
                            >
                                Get Started
                            </button>
                        )}
                    </div>

                    {/* Hamburger Menu - Now Functional */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowHamburgerMenu(!showHamburgerMenu);
                            }}
                            className={`p-2 rounded-xl border transition-all duration-300 ml-2 border-l border-white/10 h-10 w-10 flex items-center justify-center
                                ${showHamburgerMenu ? 'bg-white text-black border-white' : 'text-zinc-500 hover:text-white border-transparent'}`}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                {showHamburgerMenu ? (
                                    <>
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </>
                                ) : (
                                    <>
                                        <line x1="4" y1="12" x2="20" y2="12"></line>
                                        <line x1="4" y1="6" x2="20" y2="6"></line>
                                        <line x1="4" y1="18" x2="20" y2="18"></line>
                                    </>
                                )}
                            </svg>
                        </button>

                        {showHamburgerMenu && (
                            <div className="absolute right-0 mt-3 w-56 bg-zinc-900 border border-white/10 rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 z-50">
                                <div className="p-3 border-b border-white/5 mb-1">
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">Global Navigation</p>
                                </div>
                                <div className="space-y-1">
                                    <button onClick={() => navigate('/')} className="w-full text-left px-4 py-3 text-xs font-bold text-zinc-400 hover:bg-white/5 hover:text-white rounded-xl transition-all uppercase tracking-widest">Home</button>
                                    <button onClick={() => navigate('/explore')} className="w-full text-left px-4 py-3 text-xs font-bold text-zinc-400 hover:bg-white/5 hover:text-white rounded-xl transition-all uppercase tracking-widest">Explore</button>
                                    <button onClick={() => navigate('/dashboard')} className="w-full text-left px-4 py-3 text-xs font-bold text-zinc-400 hover:bg-white/5 hover:text-white rounded-xl transition-all uppercase tracking-widest">Dashboard</button>
                                    <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-3 text-xs font-bold text-zinc-400 hover:bg-white/5 hover:text-white rounded-xl transition-all uppercase tracking-widest">Profile</button>
                                </div>

                                {/* Dynamic Menu Items for specific pages */}
                                {menuItems.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-white/5 space-y-1">
                                        <p className="px-4 py-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Page Actions</p>
                                        {menuItems.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    item.onClick();
                                                    setShowHamburgerMenu(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-widest
                                                    ${item.variant === 'primary' ? 'bg-white text-black hover:bg-zinc-200' : 'text-zinc-100 hover:bg-white/5'}`}
                                            >
                                                {item.icon && <span className="mr-3">{item.icon}</span>}
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
