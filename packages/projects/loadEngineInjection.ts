import type { World } from '@xrengine/engine/src/ecs/classes/World'

import type { ProjectConfigInterface } from './ProjectConfigInterface'

export const loadEngineInjection = async (world: World, projects: string[]) => {
  for (const project of projects) {
    if (!globalThis[project]) globalThis[project] = {}
  }
  return Promise.all(
    projects
      .map(async (project) => {
        try {
          const projectConfig = (await import(`./projects/${project}/xrengine.config.ts`))
            .default as ProjectConfigInterface
          if (typeof projectConfig.worldInjection !== 'function') return null!
          return (await projectConfig.worldInjection()).default(world)
        } catch (e) {
          console.log(`Failed to import world load event for project ${project} with reason ${e}`)
          return null!
        }
      })
      .filter(($) => !!$)
  )
}
