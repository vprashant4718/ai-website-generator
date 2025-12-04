import { Button } from '@/components/ui/button'
import { Code, Code2Icon, Download, Monitor, SquareArrowOutUpRight, TabletSmartphone } from 'lucide-react'
import ViewCodeBlock from './ViewCodeBlock';
import { useEffect, useState } from 'react';

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
    const [finalCode, setFinalCode] = useState<string>();

    useEffect(()=>{
        let pureCode = generatedCode || "";
        // Remove markdown fences and stray junk before <!DOCTYPE> or <html>
        pureCode = pureCode
        .replaceAll("```html", "")
        .replaceAll("```", "")
        .replace(/^[^<]*(?=<)/, "")  // removes “TYPE >” or anything before first <html> or <!DOCTYPE>
        .trim();
        //  Inject clean code into full HTML document
        const cleanCode = HTML_DOC.replace("{code}", pureCode);

        setFinalCode(cleanCode);
    }, [generatedCode]);

    const ViewInNewTab = ()=>{
        if(!finalCode)  return;

        const blob = new Blob([finalCode??''], {type:'text/html'});
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }

    const downloadCode = ()=>{
        const blob = new Blob([finalCode ?? '' ], {type:'text/html'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'index.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

    }
  return (
    <div className='p-2 shadow rounded-xl w-full flex justify-between'>
        <div className='flex justify-start items-start gap-3 '>
            <Button variant={'ghost'} onClick={()=>setSelectedScreenSize('web')} className={`${selectedScreenSize === 'web' ? 'border border-primary': null}`}> <Monitor /></Button>
            <Button variant={'ghost'} onClick={()=>{setSelectedScreenSize('mobile'); console.log("mobile")} } className={`${selectedScreenSize === 'mobile' ? 'border border-primary':null}`}> <TabletSmartphone /></Button>
        </div>
        <div className='flex gap-3'>
            <Button variant={'outline'} className=' cursor-pointer' onClick={ViewInNewTab}>View <SquareArrowOutUpRight /></Button>
            <ViewCodeBlock code={finalCode} >
            <span className='flex flex-row justify-center items-center gap-3 bg-white hover:bg-gray-100 dark:bg-neutral-900 border dark:hover:bg-neutral-800 dark:border-neutral-700 border-gray-200 p-1 px-2 rounded-sm cursor-pointer '><span>Code</span> <Code2Icon /></span>
            </ViewCodeBlock>
            <Button variant={'outline'} className=' cursor-pointer' onClick={downloadCode}>Download <Download /></Button>
        </div>
    </div>
  )
}
