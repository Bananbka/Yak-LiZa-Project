import type { SVGProps } from "react"

export function TypescriptIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="38"
      height="38"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M15 21l-4.5 -8.5l-2.5 -4.5h-5l7 13z"></path>
      <path d="M14 21v-5a2 2 0 1 1 4 0v5"></path>
      <path d="M14 13h5.5"></path>
      <path d="M21 15.5h-5.5"></path>
    </svg>
  )
}