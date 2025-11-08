import { Github } from "lucide-react"
import { NextjsIcon } from "@/components/icons/next-icon"
import { ReactIcon } from "@/components/icons/react-icon"
import { TailwindIcon } from "@/components/icons/tailwind-icon"

const students = [
  {
    name: "Якимів Данило",
    group: "343-2",
    github: "https://github.com/YakymivDanylo",
  },
  {
    name: "Лічинський Давид",
    group: "343-2",
    github: "https://github.com/davlicha",
  },
  {
    name: "Залога Нікіта",
    group: "343-2",
    github: "https://github.com/Bananbka",
  },
]

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container py-8">
        <div className="text-center mb-6">
          <h3 className="font-semibold text-lg mb-4">Команда розробників</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {students.map((student, index) => (
              <div key={index} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background">
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-muted-foreground">Група: {student.group}</p>
                <a
                  href={student.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <ReactIcon className="h-6 w-6" />
            <NextjsIcon className="h-6 w-6" />
            <TailwindIcon className="h-6 w-6" />
          </div>
          <p>Лабораторна робота №9-10</p>
        </div>
      </div>
    </footer>
  )
}