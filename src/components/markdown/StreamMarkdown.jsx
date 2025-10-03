// src/components/StreamingMarkdown.js
import React, { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked for streaming
const configureMarked = () => {
  const renderer = new marked.Renderer();
  
  // Custom renderer that matches your MarkDownComponents styling
  renderer.heading = (text, level) => {
    const styles = {
      1: 'text-3xl font-bold mb-2 mt-8 text-slate-900 border-b border-slate-200 pb-3 leading-tight',
      2: 'text-2xl font-semibold mb-4 mt-8 text-slate-800 leading-snug',
      3: 'text-xl font-medium mb-3 mt-6 text-slate-700 leading-snug',
      4: 'text-lg font-medium mb-2 mt-5 text-slate-700 leading-snug',
      5: 'text-base font-medium mb-2 mt-4 text-slate-600 leading-snug',
      6: 'text-sm font-medium mb-2 mt-3 text-slate-600 uppercase tracking-wider leading-snug'
    };
    return `<h${level} class="${styles[level] || styles[6]}">${text}</h${level}>`;
  };
  
  renderer.paragraph = (text) => {
    return `<p class="mb-4 leading-7 text-slate-700 text-[15px] font-light tracking-wide">${text}</p>`;
  };
  
  renderer.list = (body, ordered) => {
    const tag = ordered ? 'ol' : 'ul';
    const classes = ordered 
      ? 'mb-2 pl-0 space-y-2 list-none counter-reset-[item]'
      : 'mb-2 pl-0 space-y-2 list-none';
    return `<${tag} class="${classes}">${body}</${tag}>`;
  };
  
  renderer.listitem = (text, task, checked) => {
    if (task) {
      return `<li class="text-slate-700 leading-7 flex items-start gap-3 text-[15px] font-light">
        <input type="checkbox" ${checked ? 'checked' : ''} readonly class="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2">
        <span class="flex-1">${text}</span>
      </li>`;
    }
    
    // Check if this is part of an ordered list by looking at parent context
    const isOrdered = text.includes('counter-increment') || false; // This is a simple heuristic
    
    return `<li class="text-slate-700 leading-7 flex items-start gap-3 text-[15px] font-light ${
      isOrdered 
        ? 'counter-increment-[item] before:content-[counter(item)"."] before:font-semibold before:text-blue-600 before:w-6 before:shrink-0'
        : 'before:content-["•"] before:text-blue-600 before:font-bold before:text-lg before:w-6 before:shrink-0 before:flex before:justify-center'
    }">
      <span class="flex-1">${text}</span>
    </li>`;
  };
  
  renderer.codespan = (code) => {
    return `<code class="px-2 py-1 bg-slate-100 text-slate-800 rounded-md text-sm font-mono border border-slate-200 whitespace-nowrap">${code}</code>`;
  };
  
  renderer.code = (code, language) => {
    const languageLabel = language ? `
      <div class="bg-slate-800 text-slate-300 px-4 py-2 text-xs font-mono uppercase tracking-wider border-b border-slate-700 rounded-t-lg">
        ${language}
      </div>
    ` : '';
    
    return `<div class="mb-2 relative group">
      ${languageLabel}
      <div class="relative">
        <code class="block p-4 bg-slate-50 text-slate-800 font-mono text-sm overflow-x-auto border border-slate-200 leading-6 ${
          language ? 'rounded-b-lg rounded-t-none' : 'rounded-lg'
        }">${code}</code>
        <button class="absolute top-1.5 right-2 bg-slate-700 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-slate-600" onclick="navigator.clipboard.writeText(\`${code.replace(/`/g, '\\`')}\`)">
          Copy
        </button>
      </div>
    </div>`;
  };
  
  renderer.blockquote = (quote) => {
    return `<blockquote class="mb-2 pl-6 py-4 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-transparent rounded-r-lg italic text-slate-700 relative">
      <div class="absolute top-2 left-2 text-blue-400 text-3xl font-serif">"</div>
      <div class="pt-2">${quote}</div>
    </blockquote>`;
  };
  
  renderer.link = (href, title, text) => {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 underline-offset-2 transition-all duration-200 font-medium" ${title ? `title="${title}"` : ''}>
      ${text}<span class="inline-block ml-1 text-xs opacity-60">↗</span>
    </a>`;
  };
  
  renderer.hr = () => {
    return `<div class="my-8 flex items-center">
      <div class="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
      <div class="mx-4 text-slate-400 text-sm">• • •</div>
      <div class="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
    </div>`;
  };
  
  renderer.strong = (text) => {
    return `<strong class="font-semibold text-slate-900 bg-yellow-100 px-1 rounded">${text}</strong>`;
  };
  
  renderer.em = (text) => {
    return `<em class="italic text-slate-600 font-medium">${text}</em>`;
  };
  
  renderer.del = (text) => {
    return `<del class="line-through text-slate-500 opacity-75">${text}</del>`;
  };
  
  renderer.table = (header, body) => {
    return `<div class="mb-2 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">${header}</thead>
          <tbody class="bg-white divide-y divide-slate-200">${body}</tbody>
        </table>
      </div>
    </div>`;
  };
  
  renderer.tablerow = (content) => {
    return `<tr class="hover:bg-slate-50 transition-colors duration-150">${content}</tr>`;
  };
  
  renderer.tablecell = (content, flags) => {
    const tag = flags.header ? 'th' : 'td';
    const classes = flags.header 
      ? 'px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200'
      : 'px-6 py-4 text-sm text-slate-700 border-b border-slate-100 leading-6';
    return `<${tag} class="${classes}">${content}</${tag}>`;
  };
  
  renderer.image = (href, title, text) => {
    return `<div class="mb-2">
      <img src="${href}" alt="${text}" ${title ? `title="${title}"` : ''} class="max-w-full h-auto rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      ${text ? `<p class="text-center text-sm text-slate-500 mt-2 italic">${text}</p>` : ''}
    </div>`;
  };
  
  marked.setOptions({
    renderer,
    gfm: true,
    breaks: true,
    sanitize: false,
    smartypants: true
  });
};

// Initialize marked configuration
configureMarked();

const StreamingMarkdown = ({ content, className = "" }) => {
  const htmlContent = useMemo(() => {
    if (!content) return '';
    
    try {
      // Handle incomplete markdown gracefully
      const processedContent = content
        .replace(/```(\w+)?\s*$/, '```$1\n') // Add newline to incomplete code blocks
        .replace(/`[^`]*$/, (match) => match + '`'); // Close incomplete inline code
      
      const html = marked(processedContent);
      return DOMPurify.sanitize(html);
    } catch (error) {
      console.warn('Markdown parsing error:', error);
      // Fallback to plain text with basic styling
      return `<p class="mb-4 leading-7 text-slate-700 text-[15px] font-light tracking-wide">${content}</p>`;
    }
  }, [content]);
  
  return (
    <div 
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default StreamingMarkdown;