export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Solar CRM",
  description: "Integrated CRM and planning solution for the solar industry",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Contacts",
      href: "/contacts",
    },
    {
      title: "Projects",
      href: "/projects",
    },
    {
      title: "Inventory",
      href: "/inventory",
    },
    {
      title: "Training",
      href: "/training",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}

