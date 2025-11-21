import Logo from "./logo";
import Navbar from "./navbar";
import Links from "./links";

export default function Header() {
  return (
    <header className="flex h-12 py-2  border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo />
          <Navbar />
        </div>
        <Links />
      </div>
    </header>
  );
}
