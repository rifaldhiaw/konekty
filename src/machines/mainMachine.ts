import { nanoid } from "nanoid";
import Peer from "peerjs";
import invariant from "tiny-invariant";
import { assign, createMachine, interpret } from "xstate";
import create from "zustand";
import { mediaService } from "./mediaMachine";
import { msgService } from "./messagingMachine";

export type UserData = {
  id: string;
  name: string;
};

export type StreamData = {
  userId: string;
  userName: string;
  stream: MediaStream;
};

export const mainMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBLAdgOi+gLuqgDboBeWUAxADIDyAwgII0D6AsgKIAiAkk6wBKnJtwCaAbQAMAXUSgADgHtYBdEszyQAD0QBaAMwAWAwHZspgIwA2AJynTUgwetSAHABoQAT32WATEYWRv5uVga2lgZS1m7WAL7xXmhY2ADuGISYUABiSgBOAKqwYPkAcqjIYFQMwkwAKpxCdHTs0nJIIMqqhBpaugh6-rau2ACsBmP+llGWI0ZevoOWpm7Y1oEzE7EjY6YJSSApOBlq2XlFJeWV1QBSdLxlza3tWt1qfZ0DQ7ZjY+tuIy2SZxWz+FzWRaISz-IxjKKmEIxELWRG2RLJDA4LCCJRKZBUep0ADixJoTQYAAkGq9Ou9epovvppm4pNh-NMDJYpI5EaioQhhtgTLsjPspFIxtYYW4MUcselMpRiqUaOhYPgqIUAMqcQSsGi8bX1IScBicXgANR4tMUKg+jNA30CplsFm5ExhMNdiIFQpF1iMbmivykkQmcuOWoACtwGk0dXrWHH6kxbV17Qz+vouZY1n9uYXbHCDMG-WLxlN9mY3Hs3IF-IlDpglBA4FpjrhMGoSORKG9M+pHToc6i3YCOXNpqiQgYBXobP52SEwu5HFNbDFIwrTllcgUVdcqgOekPs4MDP4pEEjGKbHXbPZPD4-EHgqEwi5r6spI3Dp2cTxZATwdc8hkvNY7HsIxLDhKwQnnWDrGwdxpVsMJXCmSU-0xVJd2VK41Q1ECsyZQZ-DsZDQkmcEwj2SJIRfBApmwMFXVo4trC-QJtywEizzIwxTH8cwJ2mMEbERcF5wo8wNhgzYxnQx89ibeIgA */
  createMachine(
    {
      context: {
        roomId: "",
        userId: nanoid(),
        userName: "",
        peer: undefined,
        remoteUserData: [],
        sidebarMode: "none",
      },
      tsTypes: {} as import("./mainMachine.typegen").Typegen0,
      schema: {
        context: {} as {
          roomId: string | undefined;
          userId: string;
          userName: string;
          peer: Peer | undefined;
          remoteUserData: UserData[];
          sidebarMode: "none" | "chat";
        },
        events: {} as
          | { type: "JOIN_ROOM"; name: string }
          | { type: "UPDATE_USER_DATA"; userData: UserData[] }
          | { type: "USER_LIST_RECEIVED"; userData: UserData[] }
          | { type: "LOCAL_MEDIA_READY" }
          | { type: "CREATE_ROOM"; name: string }
          | { type: "TOGGLE_CHAT" },
      },
      predictableActionArguments: true,
      on: {
        UPDATE_USER_DATA: {
          actions: "updateUserData",
        },
      },
      initial: "initializing",
      id: "main",
      states: {
        initializing: {
          entry: ["saveRoomIdIfExist", "startMediaService"],
          on: {
            LOCAL_MEDIA_READY: {
              target: "waitingForUserName",
            },
          },
        },
        waitingForUserName: {
          entry: "initPeer",
          on: {
            CREATE_ROOM: {
              target: "inRoom",
              actions: [
                "saveName",
                "saveRoomId",
                "updateUrl",
                "startMessagingService",
              ],
            },
            JOIN_ROOM: {
              target: "waitingUserList",
              actions: ["saveName", "startMessagingService"],
            },
          },
        },
        inRoom: {
          entry: "startMediaCall",
          on: {
            TOGGLE_CHAT: {
              actions: "toggleChat",
            },
          },
        },
        waitingUserList: {
          on: {
            USER_LIST_RECEIVED: {
              target: "inRoom",
              actions: "updateUserData",
            },
          },
        },
      },
    },
    {
      actions: {
        updateUserData: assign({
          remoteUserData: (context, event) => event.userData,
        }),
        startMediaService: (context, event) => {
          mediaService.send("START");
        },
        saveRoomIdIfExist: assign({
          roomId: (context, event) => {
            const urlArr = window.location.href.split("/");
            const roomId = urlArr[urlArr.length - 1];
            return roomId.trim();
          },
        }),
        toggleChat: assign({
          sidebarMode: (context, event) =>
            context.sidebarMode === "chat" ? "none" : "chat",
        }),
        saveName: assign({
          userName: (context, event) => event.name,
        }),
        initPeer: assign({
          peer: (context, event) =>
            !!context.peer ? context.peer : new Peer(context.userId),
        }),
        saveRoomId: assign({
          roomId: (context, event) => context.userId,
        }),
        updateUrl: (context, event) => {
          window.history.replaceState(
            {},
            "Room: " + context.userId,
            context.userId
          );
        },
        startMessagingService: (context, event) => {
          invariant(context.peer);

          msgService.send({
            type: "START",
            peer: context.peer,
            mainHostId: context.roomId ?? "",
            userId: context.userId,
            userName: event.name,
          });
        },
        startMediaCall: (context, event) => {
          invariant(context.peer);

          mediaService.send({
            userId: context.userId,
            userName: context.userName,
            type: "START_CALL",
            peer: context.peer,
            userData: context.remoteUserData,
          });
        },
      },
    }
  );

export const mainService = interpret(mainMachine, {
  devTools: true,
  id: "MAIN - " + new Date().getMinutes() + ":" + new Date().getSeconds(),
});

type MainServiceState = ReturnType<typeof mainService["getSnapshot"]>;

export const useMainService = create<MainServiceState>((set) => {
  mainService
    .onTransition((state) => {
      const initialStateChanged =
        state.changed === undefined && Object.keys(state.children).length;

      if (state.changed || initialStateChanged) {
        set(state);
      }
    })
    .start();

  return mainService.getSnapshot();
});
