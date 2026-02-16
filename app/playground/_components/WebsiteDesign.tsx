import React, { useEffect, useRef, useState } from "react";
import WebPageTool from "./WebPageTool";
import ElementSettingSection from "./ElementSettingSection";
import ImageSettingSection from "./ImageSettingSection";

type Props = { generatedCode: string };

const HTML_DOC = `
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template">
  <title>AI Website Builder</title>

  <!--  Load Tailwind & Flowbite first -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

  <!--  Keep lightweight icons (Lucide) -->
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js" defer></script>

  <!--  Optional libraries (loaded async to not block selection) -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js" async></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js" async></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" async></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js" async></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js" async></script>

  <!--  Tooltip (Tippy.js) - lightweight -->
  <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
  <script src="https://unpkg.com/@popperjs/core@2" async></script>
  <script src="https://unpkg.com/tippy.js@6" async></script>
</head>

<body id="root">
</body>
</html>
`;

export default function WebsiteDesign({ generatedCode }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedScreenSize, setSelectedScreenSize] = useState("web");
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);

  // Initialize iframe once
  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(HTML_DOC);
    doc.close();
  }, []);

  // Update HTML when generatedCode changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!iframeRef.current) return;
      const doc = iframeRef.current.contentDocument;
      if (!doc) return;
      const root = doc.getElementById("root");
      if (root) {
        let html = generatedCode
          ?.replaceAll("```html", "")
          .replaceAll("```", "")
          .replace(/@apply[^;]+;/g, "")
          .replace(/^[^<]*(?=<)/, "")
          .trim() ?? "";

        root.innerHTML = html;

        // re-run inline scripts
        const scripts = root.querySelectorAll("script");
        scripts.forEach((oldScript) => {
          const newScript = doc.createElement("script");
          if (oldScript.src) newScript.src = oldScript.src;
          else newScript.textContent = oldScript.textContent;
          oldScript.parentNode?.replaceChild(newScript, oldScript);
        });
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [generatedCode]);

  // Element selection (hover, click)
  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    let hoverEl: HTMLElement | null = null;
    let selectedEl: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      if (selectedEl) return;
      const target = e.target as HTMLElement;
      if (hoverEl && hoverEl !== target) hoverEl.style.outline = "";
      hoverEl = target;
      hoverEl.style.outline = "2px dotted blue";
    };

    const handleMouseOut = () => {
      if (selectedEl) return;
      if (hoverEl) hoverEl.style.outline = "";
      hoverEl = null;
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;
      if (selectedEl && selectedEl !== target) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
      }
      selectedEl = target;
      selectedEl.style.outline = "2px solid red";
      selectedEl.setAttribute("contenteditable", "true");
      selectedEl.focus();
      setSelectedElement(selectedEl);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedEl) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
        selectedEl = null;
        setSelectedElement(null);
      }
    };

    doc.body?.addEventListener("mouseover", handleMouseOver);
    doc.body?.addEventListener("mouseout", handleMouseOut);
    doc.body?.addEventListener("click", handleClick);
    doc.addEventListener("keydown", handleKeyDown);

    return () => {
      doc.body?.removeEventListener("mouseover", handleMouseOver);
      doc.body?.removeEventListener("mouseout", handleMouseOut);
      doc.body?.removeEventListener("click", handleClick);
      doc.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex p-2 flex-row w-full">
      <div className="p-2 w-full flex flex-col justify-center items-center">
        <iframe
          ref={iframeRef}
          title="AI Preview"
          className={`${
            selectedScreenSize === "web" ? "w-full" : "w-96"
          } h-[650px] border rounded-xl bg-white shadow-sm`}
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
        <WebPageTool
          selectedScreenSize={selectedScreenSize}
          setSelectedScreenSize={(v: string) => setSelectedScreenSize(v)}
          generatedCode={generatedCode}
        />
      </div>

      {/*  Fixed: no re-render loop */}
      {/* {selectedElement?.tagName==='IMG'? */}
      {/* // @ts-ignore */}
      {/* <ImageSettingSection selectedEl={selectedElement} />: */}
      {/* @ts-ignore */}
      <ElementSettingSection selectedEl={selectedElement}  clearSelection={() => setSelectedElement(null)}  />
      {/* } */}
    </div>
  );
}
