import { Button } from '@/components/ui/button'
import { Code, Download, Monitor, SquareArrowOutUpRight, TabletSmartphone } from 'lucide-react'
import React from 'react'
import { blob } from 'stream/consumers'

const HTML_DOC = `<!DOCTYPE html>
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
       {code}
      </body>
      </html>`

export default function WebPageTool({selectedScreenSize, setSelectedScreenSize, generatedCode}:any) {
    const ViewInNewTab = ()=>{
        if(!generatedCode)  return;

        let pureCode = generatedCode || "";

        // 1️⃣ Remove markdown fences and stray junk before <!DOCTYPE> or <html>
        pureCode = pureCode
        .replaceAll("```html", "")
        .replaceAll("```", "")
        .replace(/^[^<]*(?=<)/, "")     // removes “TYPE >” or anything before first <html> or <!DOCTYPE>
        .trim();

        // 2️⃣ Inject clean code into full HTML document
        const cleanCode = HTML_DOC.replace("{code}", pureCode);
        

        const blob = new Blob([cleanCode], {type:'text/html'});
        const url = URL.createObjectURL(blob);

        window.open(url, '_blank')
    }
  return (
    <div className='p-2 shadow rounded-xl w-full flex justify-between'>
        <div className='flex justify-start items-start gap-3 '>
            <Button variant={'ghost'} onClick={()=>setSelectedScreenSize('web')} className={`${selectedScreenSize === 'web' ? 'border border-primary': null}`}> <Monitor /></Button>
            <Button variant={'ghost'} onClick={()=>{setSelectedScreenSize('mobile'); console.log("mobile")} } className={`${selectedScreenSize === 'mobile' ? 'border border-primary':null}`}> <TabletSmartphone /></Button>
        </div>
        <div className='flex gap-3'>
            <Button variant={'outline'} onClick={ViewInNewTab}>View <SquareArrowOutUpRight /></Button>
            <Button variant={'outline'} onClick={ViewInNewTab}>View <Code /></Button>
            <Button variant={'outline'} onClick={ViewInNewTab}>Download <Download /></Button>
        </div>
    </div>
  )
}
