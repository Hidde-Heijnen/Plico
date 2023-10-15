import {
  Book,
  Check,
  Download,
  Home,
  LucideIcon,
  LucideProps,
  Mic,
  Pause,
  Pencil,
  SendHorizonal,
  Settings,
  Trash2,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type Icon = LucideIcon

export const Icons = {
  Close: X,
  Logo: ({ ...props }: LucideProps) => (
    <svg
      width="256"
      height="256"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M131.192 0.0390142C130.131 0.0130551 129.067 0 128 0C57.3076 0 0 57.3076 0 128C0 198.692 57.3076 256 128 256C130.594 256 133.17 255.923 135.725 255.771L15.3018 142.573C11.3311 138.84 9.05545 133.649 9.001 128.2C8.94655 122.751 11.1181 117.515 15.0133 113.704L131.192 0.0390142ZM181.797 244.18C189.957 240.395 197.651 235.776 204.77 230.432L111.302 142.573C107.331 138.84 105.055 133.649 105.001 128.2C104.947 122.751 107.118 117.515 111.013 113.704L202.673 24.0271C195.05 18.5425 186.799 13.8756 178.05 10.1548L57.8938 127.711L181.797 244.18ZM256 128C256 155.455 247.356 180.89 232.642 201.735L153.894 127.711L231.12 52.1555C246.759 73.3824 256 99.612 256 128Z"
        fill="currentColor"
      />
    </svg>
  ),
  Mic: Mic,
  Pause: Pause,
  Trash: Trash2,
  Download: Download,
  Edit: Pencil,
  Summarize: SendHorizonal,
  Settings: Settings,
  Check: Check,
  Home: Home,
  Docs: Book,
}
