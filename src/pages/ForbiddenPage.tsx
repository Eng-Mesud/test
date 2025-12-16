import { buttonVariants } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

export default function ForbiddenPage() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-4xl font-bold">403</h1>
            <p className="text-xl text-muted-foreground">Access Forbidden</p>
            <p className="text-muted-foreground">You do not have permission to view this page.</p>
            <Link to="/dashboard" className={cn(buttonVariants())}>
                Go back to Dashboard
            </Link>
        </div>
    )
}
