import { log } from "console"
import React, { useContext, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { motion, useReducedMotion } from "framer-motion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  accordionValue: string[]
  setAccordionValue: React.Dispatch<React.SetStateAction<string[]>>
} | null>(null)

/**
 * Hook to get the collapsed state and setCollapsed function for the nav sidebar
 * @returns [collapsed, setCollapsed]
 */
const useNavContext = () => useContext(NavContext)

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
      <NavContext.Provider
        value={{
          collapsed,
          setCollapsed,
          accordionValue,
          setAccordionValue,
        }}
      >
        <aside
          className={cn(
            "flex h-screen shrink-0 flex-col justify-between border-r border-border bg-card p-3 text-card-foreground transition-[width] duration-plico ease-in-out",
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
            orientation={collapsed ? "horizontal" : "vertical"}
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
  const { collapsed, setCollapsed } = useNavContext()

  const toggleCollapsed = () => {
    localStorage.setItem("nav-collapsed", (!collapsed).toString())
    setCollapsed(!collapsed)
  }

  return (
    <div className="relative mb-8 ml-1 flex w-full items-center duration-plico">
      <div
        className={cn(
          "flex grow items-center gap-x-2 overflow-hidden whitespace-nowrap text-lg transition-[max-width,opacity,padding] duration-plico ease-in-out",
          collapsed ? "max-w-0 pl-0 opacity-0" : "max-w-full pl-1 opacity-100"
        )}
        {...props}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleCollapsed}
            className="inline-flex h-10 items-center justify-center rounded-md p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 "
          >
            <NavCollapseIcon />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {collapsed ? "Expand" : "Collapse"} sidebar
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

const NavCollapseIcon: React.FC<React.HTMLAttributes<HTMLOrSVGElement>> = ({
  ...props
}) => {
  const { collapsed } = useNavContext()

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={"shrink-0"}
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="15" x2="15" y1="3" y2="21" />
      <path
        className={cn(
          collapsed ? "rotate-0" : "rotate-180",
          "transition-transform duration-plico ease-in-out"
        )}
        style={{ transformOrigin: "40%" }}
        d="m8 9 3 3-3 3"
      />
    </svg>
  )
}

const NavContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
}) => {
  return <ul className="relative w-full space-y-2">{children}</ul>
}

const NavFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
}) => {
  return <ul className="relative mt-auto w-full space-y-2 ">{children}</ul>
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
  const { collapsed, accordionValue, setAccordionValue } = useNavContext()

  return (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger asChild>
            <div className="flex h-12 items-center rounded-md p-3 text-foreground hover:bg-accent/30 ">
              <Icon className="relative z-10 h-6 w-6 shrink-0" />
              <span
                className={cn(
                  "relative z-10 ml-4 w-32 max-w-full truncate text-lg opacity-100 transition-[margin,max-width,opacity] duration-plico ease-in-out",
                  collapsed &&
                    "ml-0 max-w-0 opacity-0 group-[.category]:ml-4 group-[.category]:max-w-full group-[.category]:opacity-100"
                )}
              >
                {title}
              </span>
            </div>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content
            className={cn(
              "absolute left-full top-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            )}
          >
            <NavigationMenu.Sub>
              <NavigationMenu.List>hello</NavigationMenu.List>
              <NavigationMenu.Viewport />
            </NavigationMenu.Sub>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
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
  const { collapsed } = useNavContext()

  const pathname = usePathname()
  let isActive: boolean
  if (href === "/") {
    isActive = pathname === href
  } else {
    isActive = pathname.startsWith(href)
  }

  const [transitionDuration, setTransitionDuration] = useState<number>(0.5) // Default value

  useEffect(() => {
    if (typeof window !== "undefined") {
      const computedStyle = window.getComputedStyle(document.documentElement)
      const durationValue = parseFloat(
        computedStyle.getPropertyValue("--plico-animation-d")
      )
      if (!isNaN(durationValue)) {
        setTransitionDuration(durationValue)
      } else console.warn("Invalid --plico-animation-d value")
    }
  }, [])

  console.log(transitionDuration)

  return (
    <li className="relative">
      <Tooltip open={!collapsed ? false : undefined} delayDuration={500}>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className="flex h-12 items-center rounded-md p-3 text-foreground hover:bg-accent/30 "
          >
            {isActive && (
              <motion.span
                layoutId="bubble"
                className={"absolute inset-0 z-0 w-full bg-accent"}
                style={{ borderRadius: 6 }}
                transition={{
                  duration: transitionDuration,
                  ease: [0.4, 0, 0.2, 1],
                }}
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
                    transition={{
                      duration: transitionDuration,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  />
                )}
                <Icon className="relative z-10 h-6 w-6 shrink-0" />
              </div>
              <span
                className={cn(
                  "relative z-10 ml-4 w-32 max-w-full truncate text-lg leading-none opacity-100 transition-[margin,max-width,opacity] duration-plico ease-in-out",
                  collapsed &&
                    "ml-0 max-w-0 opacity-0 group-[.category]:ml-4 group-[.category]:max-w-full group-[.category]:opacity-100"
                )}
              >
                {label}
              </span>
            </div>
            {notifications && !collapsed && (
              <motion.div
                layoutId={`${label} notification`}
                className="absolute right-0 z-10 mr-2 inline-flex items-center rounded-full border border-transparent bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                transition={{
                  duration: transitionDuration,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{ borderRadius: 9999 }}
              >
                {notifications > 0 && notifications < 100
                  ? notifications
                  : "99+"}
              </motion.div>
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </li>
  )
}

const NavProfile = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { collapsed } = useNavContext()

  return (
    <Card
      className={cn(
        "flex items-center gap-x-2 p-2 transition-[opacity,padding] duration-plico ease-in-out",
        collapsed
          ? "border-border/0 pl-1 shadow-transparent"
          : "border-border/100 pl-2"
      )}
      ref={ref}
      {...props}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage
          asChild
          src="/images/profile-picture.jpg"
          className="object-cover"
        >
          <Image
            src="/images/profile-picture.jpg"
            alt="logo"
            width={40}
            height={40}
          />
        </AvatarImage>
        <AvatarImage />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          collapsed ? "w-0 opacity-0" : "w-full opacity-100",
          "truncate transition-[width,opacity] duration-plico ease-in-out"
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
  const { collapsed } = useNavContext()

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
            "absolute inset-0 flex w-fit items-center bg-card pl-1 pr-3 text-lg capitalize text-card-foreground transition-[width,opacity] duration-plico ease-in-out",
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
