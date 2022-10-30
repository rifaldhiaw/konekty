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
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBLAdgOi+gLuqgDboBeWUAxADIDyAwgII0D6AsgKIAiAkk6wBKnJtwCaAbQAMAXUSgADgHtYBdEszyQAD0QBaAMwAOKQHZsUgGwBGIwFYALACY7lg1IMOANCACe+gE5zAwCDazsnIKNLCKMAgF94nzQsbAB3DEJMKAAxJQAnAFVYMHyAOVRkMCoAZU4AFVZOQUE6QWk5JBBlVUINLV0EQzs4i1MAywcrcYcTUx9-BFdsUzjjJ08zNwdrROSMHAy1bLyikvLK6oZhJnrOITo6dg6tHrV+rsHDA0jsIxMpP9HBsDHYFvpwtZsE5TA4QpYAq4wrY9iAUodMpRTsVShUqlQAFJ0XhlB5PF5dN59TSffQGH52CyRIzWdwBayhJzghDOP5SaxSAJOGwBQFmJyo9G4TCCJRKZBUep0ADiypo9wYAAlbhTFCp3jTQF8XJZzKs7GFTHYOasjN4-IhlqtQgEJtaHJYjMLJQd0pjsjj8jR0LB8FRCnVBKwaLwao1hAxOLwAGo8XXdfXUgb6Jx2gIWOyOQGmYwOIWWblOtaWU1OJzWNzWCVJNEHcMABW4t3uEearC79SY6ap6kNOjps3McRGRlh1lMIIrDoQMIc2FFTlm9YCdoMbksiRbmCUEDgWileEIJHIlFemdH2aGUzL2FspkFkxCcKt3L0rLXazhJudirFauwtlKRxZLkBSBniYB3r0D60kMoIlisQpSHC-LCiWBi-k2UIhGEnoBA4qyblIdg+qkWCyvKiEGo+ejCjuFgOB6timjuBjzMuf62Cse6zB45HRDE1EQb6UGUIGwahoxWYoYYViMpYuZTAKO6TtyJjQqYpiTBs4oJFJWCKchRr6FMQSvrOH5wmRvFgvxlH6Rx0yzj8omHvEQA */
  createMachine(
    {
      context: {
        roomId: "",
        userId: nanoid(),
        userName: "",
        error: undefined,
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
          error: Error | undefined;
          peer: Peer | undefined;
          remoteUserData: UserData[];
          sidebarMode: "none" | "chat";
        },
        events: {} as
          | { type: "JOIN_ROOM"; name: string }
          | { type: "SET_ERROR"; error: Error }
          | { type: "CLEAR_ERROR" }
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
          entry: ["saveRoomIdIfExist", "startMediaService", "initPeer"],
          on: {
            LOCAL_MEDIA_READY: {
              target: "waitingForUserName",
            },
          },
        },
        waitingForUserName: {
          exit: "clearError",
          invoke: {
            src: "startPeerListener",
          },
          on: {
            SET_ERROR: {
              actions: "setError",
            },
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
          invoke: {
            src: "startPeerListener",
          },
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
      services: {
        startPeerListener: (context, event) => (callback, onReceive) => {
          invariant(context.peer);

          const errorListener = (error: Error) => {
            callback({
              type: "SET_ERROR",
              error,
            });
          };

          context.peer.on("error", errorListener);

          return () => {
            context.peer?.off("error", errorListener);
          };
        },
      },
      actions: {
        clearError: assign({
          error: (context, event) => undefined,
        }),
        setError: assign({
          error: (context, event) => event.error,
        }),
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
