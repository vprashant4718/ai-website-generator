import React, { useEffect, useRef } from "react";

type Props = { generatedCode: string };

export default function WebsiteDesign({ generatedCode }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const cleanCode = extractHTMLFromAIResponse(generatedCode);
    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;

    if (doc) {
      doc.open();
      doc.write(cleanCode);
      doc.close();
    }
  }, [generatedCode]);

  return (
    <div className="p-5 flex-1 h-[91vh] overflow-auto bg-neutral-900 rounded-lg">
      <iframe
        ref={iframeRef}
        title="Website Preview"
        className="w-full h-full rounded-lg border border-neutral-700 bg-white"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}


/**
 * Removes extra Markdown fences, instructions, or “How to use” text
 * and keeps only the <html> ... </html> or raw <body> code.
 */
function extractHTMLFromAIResponse(aiText: string): string {
  let cleaned = aiText
    // remove Markdown fences ```html ```css etc.
    ?.replace(/```[a-z]*\n?/gi, "")
    ?.replace(/```/g, "")
    // remove “How to use” or extra explanations
    ?.replace(/How to use[\s\S]*$/gi, "")
    ?.trim();

  // 🧩 Separate CSS and HTML if AI dumped both inline
  let cssMatch = cleaned?.match(/\/\*[\s\S]*?\*\/[\s\S]*?(?=<)/);
  let cssCode = cssMatch ? cssMatch[0] : "";
  let htmlPart = cleaned?.replace(cssCode, "").trim();

  // 🧩 Wrap CSS safely if it’s not already inside <style>
  if (cssCode && !cssCode.includes("<style")) {
    cssCode = `<style>\n${cssCode}\n</style>`;
  }

  // 🧩 Ensure HTML has <body>
  if (!/<html/i.test(htmlPart)) {
    htmlPart = `
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${cssCode || ""}
      </head>
      <body>
        ${htmlPart}
      </body>
      </html>
    `;
  }

  return htmlPart;
}
