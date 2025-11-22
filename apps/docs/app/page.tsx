import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Zap,
  Palette,
  Code,
  Shield,
  Rocket,
  Github,
  ArrowRight,
  CheckCircle2,
  Layers,
  MousePointerClick,
  Monitor,
} from "lucide-react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Logo from "@/components/layout/logo";

export default function Home() {
  return (
    <div className="flex flex-col h-full min-h-svh overflow-y-auto w-full">
      {/* Hero Section */}
      <section className="relative flex min-h-screen w-full flex-col items-start justify-start overflow-hidden">
        <BackgroundRippleEffect />
        <div className="mt-60 w-full">
          <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-4xl lg:text-7xl dark:text-neutral-100">
            Modern React Component Library
          </h2>
          <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500">
            A collection of beautifully designed, accessible, and customizable
            React components built with Radix UI and Tailwind CSS.
          </p>
          <HoverBorderGradient
            containerClassName="rounded-full mx-auto mt-4"
            as="a"
            href="/docs"
            className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
          >
            <span>Get Started</span>
            <ArrowRight className="ml-2 size-4" />
          </HoverBorderGradient>
        </div>
        <div className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500"></div>
      </section>

      {/* Features Section */}
      <section
        className="py-20 md:py-32 bg-muted/30"
        aria-labelledby="features-heading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              id="features-heading"
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Why Choose ekrem UI?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to build modern, accessible web applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="size-6 text-primary" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Optimized components built for performance. No unnecessary
                  re-renders, no bloat.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Palette className="size-6 text-primary" />
                </div>
                <CardTitle>Fully Customizable</CardTitle>
                <CardDescription>
                  Built with Tailwind CSS. Customize colors, spacing, and styles
                  to match your brand.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="size-6 text-primary" />
                </div>
                <CardTitle>Accessible by Default</CardTitle>
                <CardDescription>
                  Built on Radix UI primitives. WCAG compliant, keyboard
                  navigable, screen reader friendly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Code className="size-6 text-primary" />
                </div>
                <CardTitle>TypeScript Ready</CardTitle>
                <CardDescription>
                  Full TypeScript support with comprehensive type definitions
                  for better DX.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Monitor className="size-6 text-primary" />
                </div>
                <CardTitle>Responsive Design</CardTitle>
                <CardDescription>
                  Mobile-first approach. All components work seamlessly across
                  all device sizes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Rocket className="size-6 text-primary" />
                </div>
                <CardTitle>Production Ready</CardTitle>
                <CardDescription>
                  Battle-tested components used in production. Regular updates
                  and maintenance.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Components Showcase */}
      <section className="py-20 md:py-32" aria-labelledby="components-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              id="components-heading"
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Beautiful Components
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive collection of UI components ready to use
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "Button",
              "Card",
              "Dialog",
              "Dropdown",
              "Form",
              "Input",
              "Select",
              "Table",
              "Tabs",
              "Tooltip",
              "Alert",
              "Badge",
              "Avatar",
              "Calendar",
              "Carousel",
              "Chart",
            ].map((component) => (
              <Card
                key={component}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
              >
                <CardContent className="p-6 text-center">
                  <div className="size-10 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <Layers className="size-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{component}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/docs/components">
                View All Components
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 md:py-32 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10"
        aria-labelledby="cta-heading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-3xl mx-auto border-2">
            <CardHeader className="text-center space-y-4">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Rocket className="size-8 text-primary" />
              </div>
              <CardTitle className="text-3xl md:text-4xl" id="cta-heading">
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-lg">
                Start building your next project with ekrem UI today. It&apos;s
                free, open source, and ready to use.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Easy Installation</h4>
                    <p className="text-sm text-muted-foreground">
                      Install with npm or yarn in seconds
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Copy & Paste</h4>
                    <p className="text-sm text-muted-foreground">
                      Copy component code directly into your project
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Fully Customizable</h4>
                    <p className="text-sm text-muted-foreground">
                      Modify components to fit your design system
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Well Documented</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive docs and examples for every component
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="group">
                  <Link href="/docs/components">
                    Browse Components
                    <MousePointerClick className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 size-4" />
                    Star on GitHub
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
