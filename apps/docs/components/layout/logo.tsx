import { SparklesIcon } from "lucide-react";

type LogoProps = {
    size?: number;
    className?: string;
    withText?: boolean;
}

export default function Logo({size = 32,
    className,
    withText,
}: LogoProps) {
    return (
        <div className="flex items-center gap-2">
            <div style={{width: size, height: size}} className="rounded-md flex items-center justify-center bg-primary text-primary-foreground">
                <SparklesIcon style={{width: size*0.6, height: size*0.6}} />
            </div>
            {withText && <h1>ekrem ui</h1>}
        </div>
    );
}