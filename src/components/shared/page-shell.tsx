import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "./breadcrumb";

interface PageShellProps {
    title: string;
    description?: string;
    breadcrumb: { label: string; href?: string }[];
    actions?: ReactNode;
    children: ReactNode;
}

export function PageShell({ title, description, breadcrumb, actions, children }: PageShellProps) {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            {/* Top Navigation & Breadcrumb */}
            <div className="space-y-4">
                <Breadcrumb items={breadcrumb} />

                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
                        {description && (
                            <p className="text-muted-foreground text-sm">{description}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {actions}
                    </div>
                </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Main Content Area */}
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}