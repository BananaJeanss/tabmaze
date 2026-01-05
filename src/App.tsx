import { Suspense, lazy, type ComponentType } from 'react'

// 1. Auto-import all .tsx files from the src/pages folder
const pages = import.meta.glob('./pages/*.tsx')

// 2. Create a route map dynamically
const routes = Object.keys(pages).reduce((acc, filePath) => {
  const name = filePath.match(/\.\/pages\/(.*)\.tsx$/)?.[1]
  
  if (name) {
    const routePath = name === 'index' ? '/' : `/${name}`
    acc[routePath] = lazy(pages[filePath] as () => Promise<{ default: ComponentType }>)
  }
  return acc
}, {} as Record<string, React.LazyExoticComponent<ComponentType>>)

export default function App() {
  const path = window.location.pathname === '/index.html' ? '/' : window.location.pathname
  
  const Page = routes[path]

  if (!Page) {
    return (
      <div className="text-white w-full h-full flex items-center justify-center">
        404 - Page Not Found
      </div>
    )
  }

  return (
    <Suspense fallback={<div className="text-white p-10">Loading Level...</div>}>
      <Page />
    </Suspense>
  )
}