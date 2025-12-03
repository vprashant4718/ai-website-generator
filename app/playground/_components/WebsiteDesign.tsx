import React, { useEffect, useRef, useState } from "react";
import WebPageTool from "./WebPageTool";

type Props = {
    generatedCode: string;
};

export default function WebsiteDesign({ generatedCode }: Props) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [selectedScreenSize, setSelectedScreenSize] = useState('web');
    // Initialize iframe shell once
    useEffect(() => {
        if (!iframeRef.current) return;
        const doc = iframeRef.current.contentDocument;
        if (!doc) return;

        doc.open();
        doc.write(`
      <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template">
          <title>AI Website Builder</title>

          <!-- Tailwind CSS -->
          <script src="https://cdn.tailwindcss.com"></script>

          <!-- Flowbite CSS & JS -->
          <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

          <!-- Font Awesome / Lucide -->
          <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

          <!-- Chart.js -->
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

          <!-- AOS -->
          <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

          <!-- GSAP -->
          <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

          <!-- Lottie -->
          <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

          <!-- Swiper -->
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
          <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

          <!-- Tippy.js -->
          <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
          <script src="https://unpkg.com/@popperjs/core@2"></script>
          <script src="https://unpkg.com/tippy.js@6"></script>
      </head>
      <body id="root">
     
      </body>
      </html>
    `);
        doc.close();
    }, []);

    // Update body only when code changes
  useEffect(() => {
  if (!iframeRef.current) return;
  const doc = iframeRef.current.contentDocument;
  if (!doc) return;

  const root = doc.getElementById("root");
  if (root) {
      let html =
        generatedCode
          ?.replaceAll("```html", "")
          .replaceAll("```", "")
          .replace(/@apply[^;]+;/g, '')
          .replace(/^[^<]*(?=<)/, "") // remove junk before <!DOCTYPE>
          .trim() ?? "";

      root.innerHTML = html;

      //  NEW FIX: Execute inline and external <script> tags
      const scripts = root.querySelectorAll("script");
      scripts.forEach((oldScript) => {
        const newScript = doc.createElement("script");
        if (oldScript.src) newScript.src = oldScript.src; // for external libs
        else newScript.textContent = oldScript.textContent; // inline scripts
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }
  }, [generatedCode]);


  return (
    <div className='p-5 w-full flex flex-col justify-center items-center '>
    <iframe
      ref={iframeRef}
      title="AI Preview"
      className={`${selectedScreenSize==='web'? 'w-full': 'w-96'} h-[650px] border rounded-xl bg-white shadow-sm`}
      sandbox="allow-scripts allow-same-origin allow-forms"
      />
      <WebPageTool selectedScreenSize={selectedScreenSize} setSelectedScreenSize={(v:string)=>setSelectedScreenSize(v)} generatedCode={generatedCode}/>
      </div>
  );
}