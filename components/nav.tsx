import React from "react"
import { motion } from "framer-motion"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { Link, useMatch } from "react-router-dom"

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

interface NavLinkProps {
  href: string
  icon: Icon
  text: string
  notifications?: number
}

const collapsedAtom = atomWithStorage("collapsed", true)

const Nav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    const [collapsed] = useAtom(collapsedAtom)

    return (
      <aside
        className={cn(
          "border-border bg-card flex h-screen shrink-0 flex-col justify-between border-r p-3 transition-[width] duration-500 ease-in-out",
          collapsed ? "w-[4.5rem]" : "w-[15.5rem]",
          className
        )}
        ref={ref}
        {...props}
      >
        <nav className="flex flex-col">
          <NavHeader />
          <ul className="relative flex flex-col gap-y-2">
            <NavLink
              href="/"
              icon={Icons.Mic}
              text="Summarize"
              notifications={1}
            />
            <NavSeperator />
            <NavLink href="/settings" icon={Icons.Settings} text="Settings" />
          </ul>
        </nav>
        <ProfileCard />
      </aside>
    )
  }
)
Nav.displayName = "Nav"

const NavHeader: React.FC = () => {
  const [collapsed, setCollapsed] = useAtom(collapsedAtom)

  return (
    <div className="relative mb-8 ml-1 flex w-full items-center">
      <span
        className={cn(
          "flex grow items-center gap-x-2 overflow-hidden whitespace-nowrap text-lg font-bold transition-[max-width,opacity] duration-500 ease-in-out",
          collapsed ? "max-w-0 opacity-0" : "max-w-full opacity-100"
        )}
      >
        {/* <img src={reactLogo} className="w-10 shrink-0" alt="Laplace Logo" /> */}
        <Icons.Logo className="fill-highlight h-8 w-8 shrink-0" />
        Easy Intake
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"ghost"}
            onClick={() => setCollapsed(!collapsed)}
            className="px-2"
          >
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

const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon: Icon,
  text,
  notifications,
}) => {
  const [collapsed] = useAtom(collapsedAtom)

  const match = useMatch(href + "/*")

  return (
    <li className="relative">
      <Tooltip open={!collapsed ? false : undefined} delayDuration={500}>
        <TooltipTrigger asChild>
          <Link
            to={href}
            className="text-foreground hover:bg-accent/30 flex h-12 items-center rounded-md p-3 "
          >
            {match && (
              <motion.span
                layoutId="bubble"
                className={cn(
                  "bg-accent absolute inset-0 z-0",
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
                    layoutId={`${text} notification`}
                    className={cn(
                      "bg-highlight absolute right-0 top-0 z-20 h-2 w-2 rounded-full"
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
                {text}
              </span>
            </div>
            {notifications && !collapsed && (
              <Badge asChild variant="highlight">
                <motion.div
                  layoutId={`${text} notification`}
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
        <TooltipContent side="right">{text}</TooltipContent>
      </Tooltip>
    </li>
  )
}

const ProfileCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [collapsed] = useAtom(collapsedAtom)
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
        <AvatarImage src="https://neumarksurgery.com/wp-content/uploads/2022/12/Dr-Harish-Mithiran-Thoracic-Surgeon-Singapore.jpg" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          collapsed ? "w-0 opacity-0" : "w-full opacity-100",
          "truncate transition-[width,opacity] duration-500 ease-in-out"
        )}
      >
        <p className="truncate font-bold">Johnathan Doeghy</p>
        <p className="text-foreground/80 truncate text-sm">email@gmail.com</p>
      </div>
    </Card>
  )
})
ProfileCard.displayName = "ProfileCard"

interface SeperatorProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
}

const NavSeperator: React.FC<SeperatorProps> = ({
  title,
  className,
  ...props
}) => {
  const [collapsed] = useAtom(collapsedAtom)
  return (
    <li
      className={cn(
        "bg-border relative z-20 my-1.5 h-px w-full",
        title && "mt-4",
        className
      )}
      {...props}
    >
      {title && (
        <p
          className={cn(
            "bg-card text-card-foreground absolute inset-0 flex w-fit items-center pl-1 pr-3 text-lg capitalize transition-[width,opacity] duration-500 ease-in-out",
            collapsed && "w-0 opacity-0"
          )}
        >
          {title}
        </p>
      )}
    </li>
  )
}

export { Nav }
