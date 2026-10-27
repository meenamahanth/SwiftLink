import React from 'react';
import { Link2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 sm:flex-row text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-violet-600 text-white">
              <Link2 className="w-3.5 h-3.5 rotate-45" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
              SwiftLink
            </span>
          </div>
          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} SwiftLink App. Built with production-ready Spring Boot & React. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
