"use client"

import React, { useContext, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuItemProps,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@radix-ui/react-navigation-menu"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icon, Icons } from "@/components/icons"

const NavContext = React.createContext<{
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
} | null>(null)

/**
 * Hook to get the collapsed state and setCollapsed function for the nav sidebar
 * @returns [collapsed, setCollapsed]
 */
const useCollapsed = () => {
  const { collapsed, setCollapsed } = useContext(NavContext)
  return [collapsed, setCollapsed] as const
}

const Nav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => {
    const [collapsed, setCollapsed] = useState(false)

    // Load collapsed state from local storage
    useEffect(() => {
      const stored = localStorage.getItem("nav-collapsed")
      if (stored === "true") setCollapsed(true)
    }, [])

    // Controlled state of Accordion and NavigationMenu components
    const [accordionValue, setAccordionValue] = useState([])
    const [accordionValuePrev, setAccordionValuePrev] = useState([])

    useEffect(() => {
      if (collapsed) {
        setAccordionValuePrev(accordionValue)
        setAccordionValue([])
      } else setAccordionValue(accordionValuePrev)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collapsed])

    return (
      <NavContext.Provider value={{ collapsed, setCollapsed }}>
        <aside
          className={cn(
            "flex h-screen shrink-0 flex-col justify-between border-r border-border bg-card p-3 transition-[width] duration-500 ease-in-out",
            collapsed ? "w-[4.5rem]" : "w-[15.5rem]",
            className
          )}
          ref={ref}
          {...props}
        >
          <Accordion
            type="multiple"
            value={accordionValue}
            onValueChange={setAccordionValue}
            className="h-full"
            asChild
          >
            <nav className="flex h-full flex-col">{children}</nav>
          </Accordion>
        </aside>
      </NavContext.Provider>
    )
  }
)
Nav.displayName = "Nav"

const NavHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...props
}) => {
  const [collapsed, setCollapsed] = useCollapsed()

  const toggleCollapsed = () => {
    localStorage.setItem("nav-collapsed", (!collapsed).toString())
    setCollapsed(!collapsed)
  }

  return (
    <div className="relative mb-8 flex w-full items-center justify-between">
      <div
        className={cn(
          "flex items-center gap-x-2 overflow-hidden whitespace-nowrap text-lg transition-[max-width,opacity] duration-500 ease-in-out",
          collapsed ? "max-w-0 opacity-0" : "max-w-full opacity-100"
        )}
        {...props}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={"ghost"} onClick={toggleCollapsed} className="px-2">
            <Icons.NavCollapseIcon className="shrink-0" collapsed={collapsed} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {collapsed ? "Expand" : "Collapse"} sidebar
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

const NavContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
}) => {
  return <div className="relative w-full space-y-2">{children}</div>
}

const NavFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
}) => {
  return <div className="relative mt-auto w-full space-y-2">{children}</div>
}

interface NavCategoryProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  icon: Icon
}

const NavCategory: React.FC<NavCategoryProps> = ({
  title,
  icon: Icon,
  children,
  ...props
}) => {
  const [collapsed] = useCollapsed()

  return (
    <AccordionItem value={title} {...props}>
      <AccordionTrigger className="flex w-full flex-1 items-center justify-between p-3 font-medium transition-all duration-300 hover:underline [&[data-state=open]>svg]:rotate-180">
        <div className="flex items-center gap-x-2">
          <Icon className="relative z-10 h-6 w-6 shrink-0" />
          <p
            className={cn(
              "text-sm uppercase transition-[max-width,opacity] duration-300 ease-in-out",
              collapsed ? "max-w-0 opacity-0" : "max-w-full opacity-100"
            )}
          >
            {title}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-[transform,opacity] duration-300",
            collapsed ? "opacity-0" : "opacity-100"
          )}
        />
      </AccordionTrigger>
      <AccordionContent className="relative w-full space-y-2 overflow-hidden pl-4 text-sm transition-all duration-300 animate-in fade-in data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}

interface NavLinkProps {
  href: string
  icon: Icon
  label: string
  notifications?: number
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon: Icon,
  label,
  notifications,
}) => {
  const [collapsed] = useCollapsed()

  const pathname = usePathname()
  const active = pathname.startsWith(href)

  return (
    <div className="relative">
      <Tooltip open={!collapsed ? false : undefined} delayDuration={500}>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className="flex h-12 items-center rounded-md p-3 text-foreground hover:bg-accent/30 "
          >
            {active && (
              <motion.span
                layoutId="bubble"
                className={cn(
                  "absolute inset-0 z-0 bg-accent",
                  collapsed ? "w-12" : "w-56"
                )}
                style={{ borderRadius: 6 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              />
            )}
            <div className="flex items-center">
              <div className="relative">
                {notifications && collapsed && (
                  <motion.div
                    layoutId={`${label} notification`}
                    className={cn(
                      "absolute right-0 top-0 z-20 h-2 w-2 rounded-full bg-primary"
                    )}
                    style={{ borderRadius: 9999 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}
                <Icon className="relative z-10 h-6 w-6 shrink-0" />
              </div>
              <span
                className={cn(
                  "relative z-10 w-32 max-w-full truncate text-lg transition-[margin,max-width,opacity] duration-500 ease-in-out",
                  collapsed
                    ? "ml-0 max-w-0 opacity-0"
                    : "ml-4 max-w-full opacity-100"
                )}
              >
                {label}
              </span>
            </div>
            {notifications && !collapsed && (
              <Badge asChild>
                <motion.div
                  layoutId={`${label} notification`}
                  className="absolute right-0 z-10 mr-2"
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  style={{ borderRadius: 9999 }}
                >
                  {notifications > 0 && notifications < 100
                    ? notifications
                    : "99+"}
                </motion.div>
              </Badge>
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </div>
  )
}

const NavProfile = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [collapsed] = useCollapsed()

  return (
    <Card
      className={cn(
        "flex items-center gap-x-2 p-2 transition-[opacity,padding] duration-500 ease-in-out",
        collapsed
          ? "border-border/0 pl-1 shadow-transparent"
          : "border-border/100 pl-2"
      )}
      ref={ref}
      {...props}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage
          src="https://neumarksurgery.com/wp-content/uploads/2022/12/Dr-Harish-Mithiran-Thoracic-Surgeon-Singapore.jpg"
          className="object-cover"
        />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          collapsed ? "w-0 opacity-0" : "w-full opacity-100",
          "truncate transition-[width,opacity] duration-500 ease-in-out"
        )}
      >
        <p className="truncate font-bold">Johnathan Doeghy</p>
        <p className="truncate text-sm text-foreground/80">email@gmail.com</p>
      </div>
    </Card>
  )
})
NavProfile.displayName = "ProfileCard"

interface SeperatorProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
}

const NavSeperator: React.FC<SeperatorProps> = ({
  title,
  className,
  ...props
}) => {
  const [collapsed] = useCollapsed()

  return (
    <li
      className={cn(
        "relative z-20 my-1.5 h-px w-full bg-border",
        title && "mt-4",
        className
      )}
      {...props}
    >
      {title && (
        <p
          className={cn(
            "absolute inset-0 flex w-fit items-center bg-card pl-1 pr-3 text-lg capitalize text-card-foreground transition-[width,opacity] duration-500 ease-in-out",
            collapsed && "w-0 opacity-0"
          )}
        >
          {title}
        </p>
      )}
    </li>
  )
}

export {
  Nav,
  NavHeader,
  NavContent,
  NavFooter,
  NavCategory,
  NavLink,
  NavSeperator,
  NavProfile,
}
