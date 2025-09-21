import { api } from "@/services/api";
import type { Link } from "@/types/Link";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type LinksState = {
  links: Link[];
  loading: boolean;
  error: string | null;
  fetchLinks: () => Promise<void>;
  addLink: (original: string, short: string) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  selectByShort: (short: string) => Promise<void>;
  updateAccesses: (id: string) => Promise<void>;
};

export const useLinkStore = create<LinksState>()(
  immer((set) => ({
    links: [],
    loading: true, // Para começar já em loading
    error: null,

    fetchLinks: async () => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      await api
        .getLinks()
        .then((data) => {
          set((state) => {
            state.links = data.links;
            state.loading = false;
          });
        })
        .catch((error) => {
          set((state) => {
            state.error = error.message;
            state.loading = false;
          });
        });
    },

    addLink: async (original: string, short: string) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      await api
        .createLink({ original, short })
        .then((data) => {
          const newLink: Link = {
            id: data.id,
            original,
            short,
            accesses: 0,
            createdAt: new Date().toISOString(),
          };

          set((state) => {
            state.links.push(newLink);
            state.loading = false;
          });
        })
        .catch((error) => {
          set((state) => {
            state.error = error.message;
            state.loading = false;
          });
        });
    },

    deleteLink: async (id: string) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      await api
        .deleteLink(id)
        .then(() => {
          set((state) => {
            state.links = state.links.filter((l) => l.id !== id);
            state.loading = false;
          });
        })
        .catch((error) => {
          set((state) => {
            state.error = error.message;
            state.loading = false;
          });
        });
    },

    selectByShort: async (short: string) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      await api
        .getLinkByShort(short)
        .then((data) => {
          console.log("data", data);

          set((state) => {
            state.links.push(data.link);
            state.loading = false;
          });
        })
        .catch((error) => {
          set((state) => {
            state.error = error.message;
            state.loading = false;
          });
        });
    },

    updateAccesses: async (id: string) => {
      set((state) => {
        const linkToUpdate = state.links.find((l) => l.id === id);
        if (linkToUpdate) {
          linkToUpdate.accesses += 1; // Incrementa o acesso
        }
      });

      await api.updateLink(id).catch((error) => {
        set((state) => {
          state.error = error.message;

          const linkToUpdate = state.links.find((l) => l.id === id);
          if (linkToUpdate) {
            linkToUpdate.accesses -= 1;
          }
        });
      });
    },
  }))
);
