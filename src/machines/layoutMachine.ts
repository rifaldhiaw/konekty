import { createMachine, interpret } from "xstate";
import create from "zustand";
const layoutMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBsCGBPA9gVwC4DoA3ASwjEwHEAnUgYgBUB5CigGQFEB9AIUYEEASgBEA2gAYAuolAAHTLGK5imAHbSQAD0QBaAIwAWMfgBsATgBMu06YDsYuwGZd5gKwAaEOkQ2X+c8YdjfWNdBwAOfV0AhwBfGI80LDx8ACNMVCoIADFMAGNsWEgGZjYuXkFRSXU5BSVVdS0EByMHc1MHfRdHZ3dPRFCbfFMxXRcwlxdTUciHWLiPFUwyeCQQRJxcavlFZTVVxu0nQY6I-Vt7MSdXDy8EPQd8fTCAl3CQscDjY3m1jA2iUjkaikLa1XYNHT+Uz4E76M52brXPoIGz6fAjQLBUIRKKzH7rZJpDLZPIFSCgnb1faIDpDUbmMKtS49G7eNEYoIhcKRaJxOJAA */
  id: "layout",
  tsTypes: {} as import("./layoutMachine.typegen").Typegen0,
  predictableActionArguments: true,
  schema: {
    context: {} as {},
    events: {} as { type: "TOGGLE_BOARD" },
  },
  context: {},
  initial: "videoGrid",
  states: {
    videoGrid: {
      on: {
        TOGGLE_BOARD: "boardFocused",
      },
    },

    boardFocused: {
      on: {
        TOGGLE_BOARD: "videoGrid",
      },
    },
  },
});

export const layoutService = interpret(layoutMachine, {
  devTools: true,
  id: "LAYOUT - " + new Date().getMinutes() + ":" + new Date().getSeconds(),
});

type LayoutServiceState = ReturnType<(typeof layoutService)["getSnapshot"]>;

export const useLayoutService = create<LayoutServiceState>((set) => {
  layoutService
    .onTransition((state) => {
      const initialStateChanged =
        state.changed === undefined && Object.keys(state.children).length;

      if (state.changed || initialStateChanged) {
        set(state);
      }
    })
    .start();

  return layoutService.getSnapshot();
});
