'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (!mounted) {
    return (
      <div className="w-12 h-7 rounded-full bg-[var(--input-bg)] border border-[var(--border-strong)]" />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center w-14 h-8 rounded-full bg-[var(--input-bg)] border border-[var(--border-strong)] p-1 cursor-pointer transition-colors hover:border-[var(--alpha-blue)]"
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Icons on sides */}
      <Sun className="w-4 h-4 text-amber-500 ml-0.5" />
      <Moon className="w-4 h-4 text-indigo-400 ml-auto mr-0.5" />
      
      {/* Sliding knob */}
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-[var(--alpha-blue)] shadow-lg flex items-center justify-center"
        initial={false}
        animate={{
          x: theme === 'light' ? 0 : 24,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {theme === 'light' ? (
          <Sun className="w-3.5 h-3.5 text-white" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-white" />
        )}
      </motion.div>
    </motion.button>
  );
}

