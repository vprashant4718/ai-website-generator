import React, { useEffect, useRef } from 'react'

type Props = {
  generatedCode: string
}

export default function WebsiteDesign({ generatedCode }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!iframeRef.current || !generatedCode) return;
    
    // DEBOUNCE: Prevents flickering
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
        const doc = iframeRef.current?.contentDocument;
        if (!doc) return;

        // --- STEP 1: CLEANUP ---
        let finalHtml = generatedCode;

        // A. Remove Markdown wrappers
        finalHtml = finalHtml.replace(/```html/g, "").replace(/```/g, "");

        // B. THE FIX: Remove "TYPE >" or any chat text before the code
        // We look for the start of the HTML document.
        const docTypeIndex = finalHtml.indexOf("<!DOCTYPE html>");
        const htmlTagIndex = finalHtml.indexOf("<html");

        if (docTypeIndex !== -1) {
            // Found DOCTYPE, slice everything before it
            finalHtml = finalHtml.substring(docTypeIndex);
        } else if (htmlTagIndex !== -1) {
            // Found <html>, slice everything before it
            finalHtml = finalHtml.substring(htmlTagIndex);
        }

        // --- STEP 2: INJECT TAILWIND ---
        // Safety check: Ensure we aren't rendering empty string
        if (!finalHtml.trim()) return;

        if (!finalHtml.includes('<script src="https://cdn.tailwindcss.com"></script>')) {
             if (finalHtml.includes("</head>")) {
                 finalHtml = finalHtml.replace("</head>", `<script src="https://cdn.tailwindcss.com"></script></head>`);
             } else {
                 finalHtml = `<script src="https://cdn.tailwindcss.com"></script>` + finalHtml;
             }
        }

        // --- STEP 3: RENDER ---
        doc.open();
        doc.write(finalHtml);
        doc.close();
    }, 20);

    return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [generatedCode]);

  return (
    <iframe
      ref={iframeRef}
      title="AI Preview"
      className="w-full h-[600px] border rounded-xl bg-white shadow-sm"
      sandbox="allow-scripts allow-same-origin allow-forms"
    />
  );
}