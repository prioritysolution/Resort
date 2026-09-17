import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex h-10 shrink-0 items-center justify-between border-t-0 bg-[#f5f5f5] px-3 dark:bg-background sm:px-5">
      <div className="flex items-center gap-2">
        <Image
          src="/logo-text.png"
          alt="Innap"
          width={64}
          height={18}
          className="h-3.5 w-auto object-contain opacity-70 dark:hidden"
        />
        <Image
          src="/logo-white.png"
          alt="Innap"
          width={72}
          height={20}
          className="hidden h-4 w-auto object-contain opacity-80 dark:block"
        />
        <p className="text-[0.8125rem] tracking-wide text-chrome-muted">
          © {new Date().getFullYear()}
        </p>
      </div>
      <Link
        href="https://prioritysolutions.in/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[0.8125rem] font-medium tracking-widest text-chrome-muted uppercase hover:text-primary"
      >
        Priority Solutions
      </Link>
    </footer>
  );
};

export default Footer;
