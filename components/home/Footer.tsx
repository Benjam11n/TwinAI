import { Github, Linkedin, Twitter } from 'lucide-react';
import { Logo } from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="mt-20 w-full border-t border-border/10">
      <div className="container px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Logo className="size-10" />
                <span className="text-lg font-semibold">TwinAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering therapists with AI-powered patient digital twins for clinical skill
                development.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="transition-colors hover:text-primary">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-primary">
                    Therapeutic Techniques
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-primary">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Connect</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  aria-label="Github"
                >
                  <Github className="size-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="size-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  aria-label="Twitter"
                >
                  <Twitter className="size-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-border/10 pt-8">
            <div className="text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} TwinAI. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
