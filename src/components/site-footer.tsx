import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0 mt-auto" role="contentinfo">
      <div className="container">
        <p className="text-center text-sm leading-loose text-muted-foreground">
          Built with Next.js, MongoDB, and Recharts.
        </p>
      </div>
    </footer>
  )
}
