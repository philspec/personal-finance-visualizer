import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Home() {
  let activeLink: string = "Dashboard";

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 flex items-center">
            <div className="h-8 w-8 mr-2 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
              L
            </div>
            <span className="font-bold">logo</span>
          </div>

          <nav className="flex flex-1 items-center justify-end space-x-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/dashboard" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        activeLink === "Dashboard" ? "bg-accent text-accent-foreground" : ""
                      )}
                    >
                      Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/transactions" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        activeLink === "Transactions" ? "bg-accent text-accent-foreground" : ""
                      )}
                    >
                      Transactions
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>
      </header>

      <main className="flex-1 container max-w-screen-2xl pt-8">
        <h1 className="text-2xl font-semibold">
          {activeLink} Content Area
        </h1>
        <p className="text-muted-foreground">
          This is where the content for the {activeLink.toLowerCase()} page will go.
        </p>
      </main>

      <footer className="py-6 md:px-8 md:py-0 border-t border-border/40">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by YourName/Company. The source code is available on GitHub.
          </p>
        </div>
      </footer>
    </div>
  );
}
