import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: number | string
}

export function Loader({ className, size = 24, ...props }: LoaderProps) {
    return (
        <div className={cn("flex justify-center items-center w-full", className)} {...props}>
            <Loader2 className="animate-spin text-primary" size={size} />
        </div>
    )
}

export function FullPageLoader() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background/50 backdrop-blur-sm">
            <Loader size={48} />
        </div>
    )
}
