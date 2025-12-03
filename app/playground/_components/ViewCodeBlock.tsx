import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy } from "lucide-react";
import { useTheme } from "next-themes";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark, docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { toast } from "sonner";

export default function DialogDemo({children, code}:any) { 
    const { theme } = useTheme();

    const handleCopy =async()=>{
        await navigator.clipboard.writeText(code);
        toast.success('code copied!');
    }
  return (
    <Dialog> 
        <DialogTrigger> {children}</DialogTrigger>
        <DialogContent className="min-w-5xl max-h-[600px] overflow-auto" >
          <DialogHeader>
            <DialogTitle asChild><div className="flex items-center gap-48" ><span className="text-black dark:text-white">Source Code</span> <Button onClick={handleCopy} > <Copy /></Button> </div></DialogTitle>
            <DialogDescription asChild>
                <div>
                    <SyntaxHighlighter language="javascript" style={theme==='dark'?dark : docco}>
                        {code}
                    </SyntaxHighlighter>
                </div>
              
            </DialogDescription>
          </DialogHeader>
           
        </DialogContent> 
    </Dialog>
  )
}
