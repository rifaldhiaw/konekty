import type { Interpreter, StateMachine } from "xstate";
import { interpret } from "xstate";
import type { StoreApi } from "zustand";

export type Store<M> = M extends StateMachine<
  infer Context,
  infer Schema,
  infer Event,
  infer State,
  infer _A,
  infer _B,
  infer _C
>
  ? {
      state: Interpreter<Context, Schema, Event, State>["state"];
      send: Interpreter<Context, Schema, Event, State>["send"];
      service: Interpreter<Context, Schema, Event, State>;
    }
  : never;

const xstate =
  <M extends StateMachine<any, any, any, any, any, any, any>>(machine: M) =>
  (set: StoreApi<Store<M>>["setState"]): Store<M> => {
    const service = interpret(machine)
      .onTransition((state) => {
        const initialStateChanged =
          state.changed === undefined && Object.keys(state.children).length;

        if (state.changed || initialStateChanged) {
          // @ts-ignore
          set({ state });
        }
      })
      .start();

    return {
      state: service.state,
      send: service.send,
      service,
    } as Store<M>;
  };

export default xstate;
