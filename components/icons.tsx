import {
  Moon,
  SunMedium,
  Twitter,
  Github,
  Home,
  Users,
  Box,
  GraduationCap,
  User,
  type LightbulbIcon as LucideProps,
  type LucideIcon,
} from "lucide-react"
import { Search } from "lucide-react"

export const Icons = {
  sun: SunMedium,
  moon: Moon,
  twitter: Twitter,
  gitHub: Github,
  home: Home,
  users: Users,
  box: Box,
  graduationCap: GraduationCap,
  user: User,
  search: Search,
  logo: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 3l9 4v10l-9 4l-9-4V7l9-4zm0 2.236L5 8.618v6.764L12 18.764l7-3.382V8.618L12 5.236zM12 16a4 4 0 1 1 0-8a4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4a2 2 0 0 0 0 4z"
      />
    </svg>
  ),
  solarPanel: (props: LucideProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </svg>
  ),
}

