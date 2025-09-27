type AppLogoProps = {
  className?: string
}

export default function AppLogo({ className }: AppLogoProps) {
  return (
    <svg
      viewBox="0 0 207 46"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        className="fill-black dark:fill-white"
        fontFamily="Arial"
        fontSize="50px"
        y="36"
      >
        Todo App
      </text>
    </svg>
  )
}
