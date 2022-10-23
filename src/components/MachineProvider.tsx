import { useInterpret } from "@xstate/react";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { InterpreterFrom } from "xstate";
import { mainMachine } from "../machines/mainMachine";

export const GlobalStateContext = createContext({
  mainService: {} as InterpreterFrom<typeof mainMachine>,
});

export const GlobalStateProvider = (props: { children: ReactNode }) => {
  const mainService = useInterpret(mainMachine, {});

  useEffect(() => {
    mainService.onTransition((state) => console.log(state));
  }, [mainService]);

  return (
    <GlobalStateContext.Provider
      value={{
        mainService: mainService,
      }}
    >
      {props.children}
    </GlobalStateContext.Provider>
  );
};

export const useMainService = () => {
  const globalContext = useContext(GlobalStateContext);
  return globalContext.mainService;
};
