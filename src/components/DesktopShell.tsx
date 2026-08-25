import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  AppWindow,
  BadgeInfo,
  BatteryMedium,
  BookOpen,
  Clock3,
  GraduationCap,
  FolderKanban,
  Gamepad2,
  MessageSquare,
  Moon,
  NotebookText,
  Minus,
  Square,
  TerminalSquare,
  X,
  Wifi,
  Workflow,
  SunMedium,
} from "lucide-react"
import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import { DesktopThemeProvider } from "./desktopTheme"

const appItems = [
  { to: "/", label: "Home", icon: BadgeInfo },
  { to: "/experience", label: "Experience", icon: NotebookText },
  { to: "/education", label: "Education", icon: GraduationCap },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/contact", label: "Contact", icon: MessageSquare },
  { to: "/blogs", label: "Blogs", icon: BookOpen },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/artion", label: "Artion", icon: Workflow },
  { to: "/artionNextGen", label: "ECG AI", icon: AppWindow },
]

const techRibbonItems = [
  "Java",
  "C#",
  "Python",
  "Streaming",
  "Flink",
  "Kinesis",
  "React",
  "Kafka",
  "Distributed Systems",
  "Cloud",
]

const DesktopShell = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "light"
    }

    const storedTheme = window.localStorage.getItem("desktop-theme")
    return storedTheme === "dark" ? "dark" : "light"
  })

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })

  useEffect(() => {
    window.localStorage.setItem("desktop-theme", theme)
  }, [theme])

  const isDark = theme === "dark"
  const hideChrome = pathname === "/education"
  const isBlogsHome = pathname === "/blogs"

  const shellClass = useMemo(
    () =>
      hideChrome
        ? isDark
          ? "bg-[radial-gradient(circle_at_top,_rgba(89,146,198,0.16),_transparent_28%),linear-gradient(180deg,_#07111f,_#0d1728)] text-slate-100"
          : "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.96),_transparent_28%),linear-gradient(180deg,_#f7f7f4,_#e9eef3)] text-slate-900"
        : isDark
          ? "bg-[radial-gradient(circle_at_top_left,_rgba(89,146,198,0.26),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(89,146,198,0.12),_transparent_24%),linear-gradient(180deg,_#08111f,_#101b2f)] text-slate-100"
          : "bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.96),_transparent_28%),linear-gradient(180deg,_#f1f5f7,_#dbe4ea)] text-slate-900",
    [hideChrome, isDark]
  )

  const headerClass = useMemo(
    () =>
      isDark
        ? "border-[#5992C6]/18 bg-[#08111f]/58 text-slate-100 shadow-[0_16px_40px_rgba(8,17,31,0.26)]"
        : "border-white/35 bg-white/28 text-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.08)]",
    [isDark]
  )

  const chipClass = useMemo(
    () =>
      isDark
        ? "border-[#5992C6]/18 bg-[#0c1527]/72 text-slate-200"
        : "border-slate-200 bg-white/68 text-slate-600",
    [isDark]
  )

  const dockClass = useMemo(
    () =>
      isDark
        ? "border-[#5992C6]/14 bg-[#08111f]/80 text-white shadow-[0_-12px_34px_rgba(8,17,31,0.34)]"
        : "border-white/20 bg-white/22 text-slate-900 shadow-[0_-12px_34px_rgba(15,23,42,0.14)]",
    [isDark]
  )

  const ribbonClass = useMemo(
    () =>
      isDark
        ? "border-[#5992C6]/12 bg-[#08111f]/72 text-slate-200"
        : "border-slate-300/70 bg-white/55 text-slate-500",
    [isDark]
  )

  const windowTitle =
    pathname === "/experience" || pathname === "/resume"
      ? "Experience"
      : pathname === "/education"
        ? "Education"
      : pathname === "/projects"
        ? "Projects"
        : pathname.startsWith("/projects/")
          ? "Project"
        : pathname === "/contact"
          ? "Contact"
          : pathname === "/blogs"
            ? "Blogs"
            : pathname.startsWith("/blogs/")
              ? "Blog"
              : pathname === "/games"
                ? "Games"
                : pathname === "/artion"
                  ? "Artion"
                  : pathname === "/artionNextGen"
                    ? "ECG AI"
                    : "Home"

  const handleClose = () => navigate("/")
  const handleMinimize = () => navigate("/")
  const handleZoom = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <DesktopThemeProvider value={{ theme, isDark }}>
      <main className={`${shellClass} min-h-screen overflow-hidden font-sans transition-colors duration-300`}>
        {!hideChrome && (
          <>
            <header
              className={`fixed left-3 right-3 top-2 z-50 rounded-[24px] border px-3 py-1 backdrop-blur-3xl sm:left-4 sm:right-4 sm:px-4 ${headerClass}`}
            >
              <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="group flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 shadow-[0_0_0_1px_rgba(15,23,42,0.08)] transition hover:scale-110"
                    aria-label="Close window"
                    title="Close window"
                  >
                    <X className="h-2 w-2 opacity-0 text-rose-950 transition group-hover:opacity-100" />
                  </button>
                  <button
                    type="button"
                    onClick={handleMinimize}
                    className="group flex h-3 w-3 items-center justify-center rounded-full bg-amber-400 shadow-[0_0_0_1px_rgba(15,23,42,0.08)] transition hover:scale-110"
                    aria-label="Minimize window"
                    title="Minimize window"
                  >
                    <Minus className="h-2 w-2 opacity-0 text-amber-950 transition group-hover:opacity-100" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoom}
                    className="group flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_0_1px_rgba(15,23,42,0.08)] transition hover:scale-110"
                    aria-label="Zoom window"
                    title="Zoom window"
                  >
                    <Square className="h-2 w-2 opacity-0 text-emerald-950 transition group-hover:opacity-100" />
                  </button>
                </div>

                <div className="flex justify-center">
                  <div className={`rounded-full px-3 py-1 text-center backdrop-blur ${chipClass}`}>
                    <p className={`text-[11px] font-semibold leading-none sm:text-sm ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                      {windowTitle}
                    </p>
                    <p
                      className={`hidden max-w-[13rem] text-[9px] uppercase leading-tight tracking-[0.22em] sm:block ${
                        isDark ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      Rajashekar Mudigonda | Backend Engineer
                    </p>
                  </div>
                </div>

                <div className={`flex items-center gap-2 ${isDark ? "text-slate-200" : "text-slate-600"}`}>
                  <div className={`hidden items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium sm:flex ${chipClass}`}>
                    <Wifi className="h-3 w-3" />
                    Wi-Fi
                  </div>
                  <div className={`hidden items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium sm:flex ${chipClass}`}>
                    <BatteryMedium className="h-3 w-3" />
                    86%
                  </div>
                  <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ${chipClass}`}>
                    <Clock3 className="h-3 w-3" />
                    {currentTime}
                  </div>
                </div>
              </div>
            </header>

            <div className={`fixed inset-x-0 top-[62px] z-30 hidden border-y px-4 py-1 backdrop-blur-md md:block ${ribbonClass}`}>
              <div className="relative overflow-hidden">
                <div className={`pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r ${isDark ? "from-slate-950/90 to-transparent" : "from-white/90 to-transparent"}`} />
                <div className={`pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l ${isDark ? "from-slate-950/90 to-transparent" : "from-white/90 to-transparent"}`} />
                <div className={`flex w-max items-center gap-5 text-[9px] font-semibold uppercase tracking-[0.3em] ${isDark ? "text-slate-300" : "text-slate-500"} [animation:tech-ribbon-scroll_36s_linear_infinite] motion-reduce:animate-none`}>
                  {techRibbonItems.concat(techRibbonItems).map((item, index) => (
                    <span key={`${item}-${index}`} className="whitespace-nowrap">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <div
          className={
            hideChrome
              ? "pt-0 pb-0"
              : isBlogsHome
                ? "pt-[82px] pb-24"
                : "pt-28 pb-24"
          }
        >
          {children}
        </div>

        {!hideChrome && (
          <>
            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
              className={`fixed bottom-24 right-5 z-40 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium shadow-lg backdrop-blur-md transition hover:-translate-y-0.5 md:bottom-28 ${
                isDark
                  ? "border-[#5992C6]/18 bg-[#08111f]/86 text-slate-100"
                  : "border-white/70 bg-white/80 text-slate-700"
              }`}
              aria-label="Toggle desktop theme"
              title="Toggle desktop theme"
            >
              {isDark ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {isDark ? "Light mode" : "Dark mode"}
            </button>

            <nav className="fixed inset-x-0 bottom-2 z-40 px-3 sm:bottom-3">
              <div
                className={`mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-[28px] border px-3 py-2 backdrop-blur-2xl sm:px-4 ${dockClass}`}
              >
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <div className="hidden items-center gap-3 lg:flex">
                    <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                        isDark
                          ? "border-[#5992C6]/16 bg-white/8 text-[#9fc0db]"
                          : "border-white/35 bg-white/30 text-slate-700"
                      }`}
                    >
                      <TerminalSquare className="h-4.5 w-4.5" />
                    </div>
                    <div className="max-w-[12rem]">
                      <p className={`text-xs font-semibold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                        Rajashekar Mudigonda | Backend Engineer
                      </p>
                      <p className={`text-xs ${isDark ? "text-white/55" : "text-slate-600"}`}>
                        Click an app to open a page
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {appItems.map((item) => {
                      const Icon = item.icon
                      const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)

                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={`group relative flex min-w-[78px] flex-col items-center gap-1 rounded-xl border px-2.5 py-1.5 text-center transition duration-200 hover:-translate-y-1 hover:scale-105 ${
                            active
                              ? isDark
                                ? "border-[#5992C6]/60 bg-white/12 shadow-[0_0_0_1px_rgba(89,146,198,0.16)]"
                                : "border-white/55 bg-white/45 shadow-[0_0_0_1px_rgba(255,255,255,0.35)]"
                              : isDark
                                ? "border-white/10 bg-white/5 hover:border-[#5992C6]/40 hover:bg-white/10"
                                : "border-white/18 bg-white/16 hover:border-white/30 hover:bg-white/26"
                          }`}
                        >
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition duration-200 group-hover:scale-110 ${
                              active
                                ? isDark
                                  ? "bg-[#5992C6]/18 text-[#dcebf6]"
                                  : "bg-slate-900/10 text-slate-900"
                                : isDark
                                  ? "bg-white/10 text-[#9fc0db] group-hover:bg-[#5992C6]/15"
                                  : "bg-white/35 text-slate-700 group-hover:bg-white/55"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className={`text-[10px] font-medium ${isDark ? "text-white/90" : "text-slate-800"}`}>
                            {item.label}
                          </span>
                          {active && (
                            <span
                            className={`absolute -bottom-1 h-1 w-1 rounded-full ${
                              isDark
                                  ? "bg-[#5992C6] shadow-[0_0_10px_rgba(89,146,198,0.75)]"
                                  : "bg-slate-700 shadow-[0_0_10px_rgba(51,65,85,0.35)]"
                            }`}
                            />
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </nav>
          </>
        )}
      </main>
    </DesktopThemeProvider>
  )
}

export default DesktopShell
