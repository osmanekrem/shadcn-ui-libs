import { GithubIcon } from "lucide-react";
import { buttonVariants } from "../ui/button";
import Link from "next/link";

export default function Links() {
  return (
    <div className="flex items-center gap-2">
      <Link
        className={buttonVariants({ size: "sm" })}
        href="https://github.com/shadcn/ui"
      >
        <GithubIcon className="size-4" />
        GitHub
      </Link>
    </div>
  );
}
