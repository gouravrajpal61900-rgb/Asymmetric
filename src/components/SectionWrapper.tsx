import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionWrapperProps {
    children: ReactNode;
    className?: string;
    id?: string;
}

export function SectionWrapper({ children, className, id }: SectionWrapperProps) {
    return (
        <section id={id} className={cn("w-full max-w-7xl mx-auto px-6 py-24 md:py-32", className)}>
            {children}
        </section>
    );
}
