// First, add these colors to your tailwind.config.js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#101218',
        'dark-aside': '#17181f',
        'dark-border': '#21232a',
        'dark-hover': '#2a2b36',
        'dark-active': '#2a2b36', // Fixed the double # in your original
        'dark-input': '#1b1c22',
        'dark-code': '#1d1e26',
      },
    },
  },
  plugins: [],
}

// src/components/markdown/markdownComponents.js
import React from "react";

export const MarkDownComponents = {
  // Headings
  h1: ({ children }) => (
    <h1 className="transition-all sm:text-4xl text-3xl font-bold mb-6 mt-10 text-slate-900 dark:text-slate-100 leading-tight tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="transition-all sm:text-3xl text-2xl font-semibold mb-5 mt-8 text-slate-800 dark:text-slate-200">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="transition-all sm:text-2xl text-xl font-medium mb-4 mt-7 text-slate-700 dark:text-white">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="transition-all sm:text-xl text-lg font-medium mb-3 mt-6 text-slate-700 dark:text-white">
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className="transition-all sm:text-lg text-base font-medium mb-3 mt-5 text-slate-600 dark:text-slate-400">
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className="transition-all text-base font-semibold mb-2 mt-4 text-slate-500 dark:text-slate-500 uppercase tracking-wide">
      {children}
    </h6>
  ),
  // Paragraph
  p: ({ children }) => (
    <p className="transition-all mb-4 sm:leading-7 leading-6 text-slate-700 dark:text-white sm:text-base text-sm">{children}</p>
  ),

  // Lists
  ul: ({ children }) => <ul className="transition-all mb-4 pl-6 list-disc">{children}</ul>,
  ol: ({ children }) => <ol className="transition-all mb-4 pl-6 list-decimal">{children}</ol>,
  li: ({ children }) => (
    <li className="transition-all text-slate-700 dark:text-white sm:leading-7 leading-6 sm:text-base text-sm">{children}</li>
  ),

  // Code
  code: ({ inline, children }) => {
    const content = String(children).trim();

    // Detect if inline or block
    const isInline = inline || (!content.includes("\n") && content.length < 40);

    if (isInline) {
      return (
        <code className="transition-all px-1.5 py-0.5 bg-slate-100 dark:bg-dark-code text-slate-800 dark:text-white rounded text-sm">
          {children}
        </code>
      );
    }
    return (
      <div className="transition-all relative group mb-6">
        <pre className="transition-all max-w-none p-4 break-words whitespace-pre-wrap bg-slate-100 dark:bg-dark-code text-slate-800 dark:text-white rounded-lg text-sm overflow-x-auto">
          <code>{children}</code>
        </pre>
        <button
          onClick={(e) => {
            navigator.clipboard.writeText(content);
            e.target.textContent = "Copied!";
            setTimeout(() => (e.target.textContent = "Copy"), 2000);
          }}
          className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-slate-200 dark:bg-dark-hover hover:bg-slate-300 dark:hover:bg-dark-active text-slate-700 dark:text-white opacity-0 group-hover:opacity-100 transition"
        >
          Copy
        </button>
      </div>
    );
  },

  blockquote: ({ children }) => (
    <blockquote className="transition-all my-2 pl-4 border-l-2 border-slate-300 dark:border-dark-border text-slate-600 dark:text-slate-400 italic">
      {children}
    </blockquote>
  ),

  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-all text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300"
    >
      {children}
    </a>
  ),

  // Tables
  table: ({ children }) => (
    <div className="transition-all mb-6 overflow-x-auto">
      <table className="transition-all min-w-full border border-slate-200 dark:border-dark-border text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="transition-all bg-slate-100 dark:bg-dark-aside text-slate-700 dark:text-white font-semibold">
      {children}
    </thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="transition-all border-b border-slate-200 dark:border-dark-border">{children}</tr>,
  th: ({ children }) => (
    <th className="transition-all px-4 py-2 text-left">{children}</th>
  ),
  td: ({ children }) => (
    <td className="transition-all px-4 py-2 text-slate-700 dark:text-white">{children}</td>
  ),

  hr: () => <hr className="transition-all my-8 border-slate-200 dark:border-dark-border" />,

  strong: ({ children }) => <strong className="transition-all sm:text-base font-semibold">{children}</strong>,
  em: ({ children }) => <em className="transition-all italic">{children}</em>,
  del: ({ children }) => <del className="transition-all line-through">{children}</del>,

  img: ({ src, alt }) => (
    <img src={src} alt={alt} className="transition-all mb-6 rounded-lg max-w-full h-auto" />
  ),
};