import { useInterpret } from "@xstate/react";
import { createContext, ReactNode, useContext } from "react";
import { ActorRef, InterpreterFrom } from "xstate";
import { mainMachine } from "../machines/mainMachine";
import { MessagingEvent } from "../machines/messagingMachine";

export const GlobalStateContext = createContext({
  mainService: {} as InterpreterFrom<typeof mainMachine>,
});

export const GlobalStateProvider = (props: { children: ReactNode }) => {
  const mainService = useInterpret(mainMachine);

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

export const useMessagingService = () => {
  const service = useMainService();
  return service.children.get("messagingService") as ActorRef<MessagingEvent>;
};
