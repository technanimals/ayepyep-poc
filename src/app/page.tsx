import { MainNav } from "~/components/main-nav";
import Link from "next/link";

import { marketingConfig } from "~/config/marketing";
import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import { siteConfig } from "~/config/site";
import { SiteFooter } from "~/components/site-footer";
import { Icons } from "~/components/icons";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={marketingConfig.mainNav} />
          <nav>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "px-4"
              )}
            >
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Slice of Heaven: Handcrafted with Love & Flavors
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Experience Pizza Perfection Like Never Before
            </p>
            <div className="space-x-4">
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Experience Pizza Perfection Like Never Before
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Icons.scatterChart size={48} />
                <div className="space-y-2">
                  <h3 className="font-bold">Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time insights for informed decisions.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Icons.lineChartIcon size={48} />
                <div className="space-y-2">
                  <h3 className="font-bold">Forecasting</h3>
                  <p className="text-sm">
                    Make data-driven business projections.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Icons.filePieChartIcon size={48} />
                <div className="space-y-2">
                  <h3 className="font-bold">Reporting</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyze financial health and trends.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto text-center md:max-w-[58rem]">
            <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Unlock the Power of Data: Elevate Your Pizza Business to New
              Heights!
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
