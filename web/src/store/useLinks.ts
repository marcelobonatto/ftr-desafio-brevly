// import { create } from 'zustand'
// import { immer } from 'zustand/middleware/immer'
// import { useShallow } from 'zustand/shallow'
// import { api } from '@/services/api'
// import type { Link } from '@/types/Link'

// type LinkOperation = {
//     id: string
//     type: 'create' | 'update' | 'delete'
//     status: 'pending' | 'success' | 'error'
//     error?: string
// }

// type LinksState = {
//     links: Map<string, Link>
//     operations: Map<string, LinkOperation>
//     loading: boolean
//     error: string | null

//     // Ações
//     fetchLinks: () => Promise<void>
//     createLink: (data: Omit<Link, 'id' | 'createdAt' | 'accesses'>) => Promise<void>
//     updateLink: (id: string, data: Partial<Link>) => Promise<void>
//     deleteLink: (id: string) => Promise<void>
//     clearError: () => void
// }

// export const useLinks = create<LinksState, [['zustand/immer', never]]>(
//     immer((set, get) => {
//         // Ajudante par atualizar as operações que serão feitas        
//         function updateOperation(operationId: string, data: Partial<LinkOperation>) {
//             set(state => {
//                 const existing = state.operations.get(operationId);
                
//                 if (existing) {
//                     state.operations.set(operationId, { ...existing, ...data })
//                 }
//             })
//         }

//         // Ajudante para adicionar ou atualizar o Link
//         function updatingLink(link: Link) {
//             set(state => {
//                 state.links.set(link.id, link)
//             })
//         }

//         // Reinicia como nulo o erro obtido na última operação
//         function clearError() {
//             set(state => {
//                 state.error = null
//             })
//         }

//         // Lista os links já cadastrados
//         async function fetchLinks() {
//             set(state => {
//                 state.loading = true
//                 state.error = null
//             })

//             try {
//                 const links = await api.getLinks()

//                 set(state => {
//                     state.loading = false
//                     state.links.clear()

//                     links.forEach(link => {
//                         state.links.set(link.id, link)
//                     })
//                 })
//             } catch (error) {
//                 set(state => {
//                     state.loading = false
//                     state.error = error instanceof Error ? error.message : 'Erro desconhecido'
//                 })
//             }
//         }

//         async function createLink(data: Omit<Link, 'id' | 'createdAt' | 'accesses'>) {
//             const operationId = crypto.randomUUID()

//             set(state => {
//                 state.operations.set(operationId, {
//                     id: operationId,
//                     type: 'create',
//                     status: 'pending'
//                 })
//             })

//             try {
//                 const newLink = await api.createLink(data)

//                 updatingLink(newLink)
//                 updateOperation(operationId, { status: 'success' })

//                 setTimeout(() => {
//                     set(state => {
//                         state.operations.delete(operationId)
//                     })
//                 }, 2000)
//             } catch (error) {
//                 updateOperation(operationId, {
//                     status: 'error',
//                     error: error instanceof Error ? error.message : 'Erro ao criar link'
//                 })
//             }
//         }

//         async function updateLink(id: string, data: Partial<Link>) {
//             const operationId = crypto.randomUUID()

//             set(state => {
//                 state.operations.set(operationId, {
//                     id: operationId,
//                     type: 'update',
//                     status: 'pending'
//                 })
//             })

//             try {
//                 const updatedLink = await api.updateLink(id, data)

//                 updatingLink(updatedLink)
//                 updateOperation(operationId, { status: 'success' })

//                 setTimeout(() => {
//                     set(state => {
//                         state.operations.delete(operationId)
//                     })
//                 }, 2000);
//             } catch (error) {
//                 updateOperation(operationId, {
//                     status: 'error',
//                     error: error instanceof Error ? error.message : 'Erro ao atualizar link'
//                 })
//             }
//         }

//         async function deleteLink(id: string) {
//             const operationId = crypto.randomUUID();

//             set(state => {
//                 state.operations.set(operationId, {
//                     id: operationId,
//                     type: 'delete',
//                     status: 'pending'
//                 })
//             })

//             try {
//                 await api.deleteLink(id)                ;

//                 set(state => {
//                     state.links.delete(id)
//                 })

//                 updateOperation(operationId, { status: 'success' })

//                 setTimeout(() => {
//                     set(state => {
//                         state.operations.delete(operationId)
//                     })
//                 }, 2000)
//             } catch (error) {
//                 updateOperation(operationId, {
//                     status: 'error',
//                     error: error instanceof Error ? error.message : 'Erro ao deletar link'
//                 })
//             }
//         }

//         return {
//             links: new Map(),
//             operations: new Map(),
//             loading: false,
//             error: null,
//             fetchLinks,
//             createLink,
//             updateLink,
//             deleteLink,
//             clearError
//         }
//     }   
// ))

// export const useLinksArray = () => {
//     return useLinks(useShallow(state => 
//         Array.from(state.links.values()).sort((a, b) => 
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         )
//     ))
// }

// export const useLinksStats = () => {
//     return useLinks(useShallow(state => {
//         const links = Array.from(state.links.values())
//         const totalClicks = links.reduce((sum, link) => sum + link.accesses, 0)
//         const activeLinks = links.filter(link => link.status === 'active').length

//         return {
//             totalLinks: links.length,
//             activeLinks,
//             inactiveLinks: links.length - activeLinks,
//             totalClicks
//         }
//     }))
// }

// export const usePendingOperations = () => {
//     return useLinks(useShallow(state => {
//         const operations = Array.from(state.operations.values())
//         const pendingOperations = operations.filter(op => op.status === 'pending')
//         const hasErrors = operations.some(op => op.status === 'error')

//         return {
//             hasPendingOperations: pendingOperations.length > 0,
//             pendingCount: pendingOperations.length,
//             hasErrors,
//             operations
//         }
//     }))
// }

// export const useLinksData = () => {
//     const store = useLinks(useShallow(state => ({
//         fetchLinks: state.fetchLinks,
//         createLink: state.createLink,
//         updateLink: state.updateLink,
//         deleteLink: state.deleteLink,
//         clearError: state.clearError,
//         loading: state.loading,
//         error: state.error
//     })))

//     const links = useLinksArray()
//     const stats = useLinksStats()
//     const { hasPendingOperations, hasErrors } = usePendingOperations()

//     return {
//         links,
//         stats,
//         loading: store.loading,
//         error: store.error,
//         hasPendingOperations,
//         hasErrors,
//         actions: {
//             fetchLinks: store.fetchLinks,
//             createLink: store.createLink,
//             updateLink: store.updateLink,
//             deleteLink: store.deleteLink,
//             clearError: store.clearError
//         }
//     }
// }

import { api } from '@/services/api'
import type { Link } from '@/types/Link'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type LinksState = {
    links: Link[]
    loading: boolean
    error: string | null
    fetchLinks: () => Promise<void>
    addLink: (original: string, short: string) => Promise<void>
}

export const useLinkStore = create<LinksState>()(
    immer((set) => ({
        links: [],
        loading: true,  // Para começar já em loading
        error: null,

        fetchLinks: async () => {
            set((state) => {
                state.loading = true
                state.error = null
            })

            await api.getLinks()
                     .then((data) => {
                        set((state) => {
                            state.links = data.links
                            state.loading = false
                        })
                     }).catch((error) => {
                        set((state) => {
                            state.error = error.message
                            state.loading = false
                        })
                     })
        },

        addLink: async (original: string, short: string) => {
            set((state) => {
                state.loading = true
                state.error = null
            })

            await api.createLink({ original, short })
                     .then((data) => {
                        const newLink: Link = {
                            id: data.id,
                            original,
                            short,
                            accesses: 0,
                            createdAt: new Date().toISOString()
                        }

                        set((state) => {
                            state.links.push(newLink)
                            state.loading = false
                        })
                     }).catch ((error) => {
                        set((state) => {
                            state.error = error.message
                            state.loading = false
                        })
                     })
        }
    }))
)