import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const projectsDirectory = path.join(process.cwd(), 'src/content/projects')

export interface ProjectMetadata {
  title: string
  summary: string
  date: string
  stack: string[]
  category: string
  featured?: boolean
  liveUrl?: string
  githubUrl?: string
  image?: string
  tags?: string[]
}

export interface Project extends ProjectMetadata {
  slug: string
  content: string
}

export function getAllProjects(): Project[] {
  const fileNames = fs.readdirSync(projectsDirectory)
  const allProjectsData = fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(projectsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        content,
        ...data,
      } as Project
    })

  return allProjectsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getProjectBySlug(slug: string): Project | null {
  try {
    const fullPath = path.join(projectsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      content,
      ...data,
    } as Project
  } catch (error) {
    return null
  }
}

export function getFeaturedProjects(): Project[] {
  const allProjects = getAllProjects()
  return allProjects.filter((project) => project.featured)
}

export function getProjectsByCategory(category: string): Project[] {
  const allProjects = getAllProjects()
  return allProjects.filter((project) => project.category === category)
}

export function getAllCategories(): string[] {
  const allProjects = getAllProjects()
  const categories = new Set(allProjects.map((project) => project.category))
  return Array.from(categories)
}






