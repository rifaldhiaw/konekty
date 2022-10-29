import { nanoid } from "nanoid";
import Peer, { MediaConnection } from "peerjs";
import invariant from "tiny-invariant";
import { assign, createMachine, interpret } from "xstate";
import create from "zustand";
import { defaultMessagingContext, messagingMachine } from "./messagingMachine";

export type Message = {
  id: string;
  userName: string;
  body: string;
  from: string;
};

export type StreamData = {
  userId: string;
  userName: string;
  stream: MediaStream;
};

export const mainMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBLAdgOi+gLuqgDboBeWUAxBAPaZi6YButA1o2lkwUaRZigIsrAMapC9ANoAGALqy5iUAAdasXvWUgAHogC0AJgAcANkPYAjAFYALKcsBmU9ce2A7JdMAaEAE8DJ0tsBxlHGQBOCNNjYxtrUwBfRN8uHDxCEnJKKjAAJzzaPOwVYgkAMyLkbDSeTP5KYRZacUlMRUVtNQ027T0EfXCwq2sIw0cImQ8ZU3dfAIQvbGtjW0NDGPdbMMiklJBa2AALWgB3SgBRAqKAcTB8ABkWkgBZSCIX2ggSKgAlC4AKr8AJoAfRugNBLwuABEAJIAQU6SBA3U0mD6Bkclnc1mwZjWUQc5giXnmiCWKzWG2MWx20WMyVSGBwpwwhEEADEigBVWD5AByqGQYCoAIA8jcbg8LqCETz4eLkap1OjMQMNrY8TIdYYZJ5bFFrNY5v4sTI8ZYIo53KZHCZbE5DdYmQcWdg2bwubz+XkhSKxZLpbKAGpwmEXJXyLqq3oo-pGBzBWnuMbGOymUKmhb6ba2bDWryWbbmYwmSyu2qejlQbl5PmC4WigDC-wRANlv3F4peytRsfQWnjBnWa2wJYio1xxdsjnJA0shncI1neoitlWM0sFf2VfZlDrDb9TaoAClxXCBaCuz2+2i46AE4ZrIZ89ZF7aJq-Z2t56NlmM0SONYkRAbMlbuqI9AMKINYArQvy0LQyA0PQjAiOwnCQdBYCwZQ8GIchTRiBIg7tPId4DkOj4jjqjjYLa24mBEWyGOu2aILM44zpYxgWsxuIQdwUGYDBcEIUhKH5IUxSlBUVQ1Nhom4eJhHIMRzxtB00YoveZHqom6bYCYMhsfq6zjHOZqLO49GOMY1q6vYpj2IYQnpJgamBlKMqgs2AAS7aUT0+nDguJoRMZ9jYhEZaLmWhjzoMtj5qZDosUuTqMru7pYF50LwgifnigKAoXM2AJwiV17lRccIhrCwVqmF+hFvRjrbixNo2i4iXWYukXGM4rFppmvGOO5TBeQAykCFwIi8NXNnVDUwk1D66IEL7BGM2Jaq+diTFZCzhAW7gOduni2eu9oujl3B5ZJVDwtNzYlWVFWNTpKohdRm0ahsMjLLMNqjLEmVJWuIQ4jakSMeYO77JgXxwNotQZHw2SCDGv0Yi12IzCEMx6lqmYg0lxZ4uYepDHEepbJNxxnJc1x5HcjzPMQbwQB8XwkDjzU0QMe3BFMtoyMWpgS9aPjWZMBamZ4wHrOd5gTfdrL7t69a+v6YACxtT4rDtEyptOR2ThTTghO4tvrlaDmGJTk0iWJ+ESchBuhULRjhBY53rOZ2w2LY85assdMyA5Q16mx6vMg9nmSV7f0JlaXGxFEEsuY6tp9TmNhA8+xpDVH4zGsW7kp3jPv2uM+IuWx0ReGxZLWbm1oFtiDjhJLtm2skyRAA */
  createMachine(
    {
      context: {
        roomId: "",
        userId: nanoid(),
        userName: "",
        error: undefined,
        peer: undefined,
        messages: [],
        localMediaStream: new MediaStream(),
        localAudioStatus: false,
        localVideoStatus: false,
        sidebarMode: "none",
        streams: [],
        mediaConnections: {},
      },
      tsTypes: {} as import("./mainMachine.typegen").Typegen0,
      schema: {
        context: {} as {
          roomId: string | undefined;
          userId: string;
          userName: string;
          error: Error | undefined;
          peer: Peer | undefined;
          messages: Message[];
          localMediaStream: MediaStream;
          localAudioStatus: boolean;
          localVideoStatus: boolean;
          sidebarMode: "none" | "chat";
          streams: StreamData[];
          mediaConnections: Record<string, MediaConnection>;
        },
        events: {} as
          | { type: "RETRY_GET_MEDIA" }
          | { type: "JOIN_ROOM"; name: string }
          | { type: "CREATE_ROOM"; name: string }
          | { type: "TOGGLE_CHAT" }
          | { type: "TOGGLE_AUDIO" }
          | { type: "TOGGLE_VIDEO" }
          | {
              type: "MEDIA_CONNECTION_RECEIVED";
              mediaConnection: MediaConnection;
              userId: string;
            }
          | { type: "MESSAGE_RECEIVED"; message: Message }
          | { type: "STREAM_RECEIVED"; streamData: StreamData }
          | { type: "DISCONNECTED" },
        services: {} as {
          getLocalMedia: {
            data: MediaStream;
          };
          startMediaConnector: {
            data: {
              mediaConnection: MediaConnection;
              streamData: StreamData;
            };
          };
        },
      },
      predictableActionArguments: true,
      initial: "initializing",
      id: "main",
      states: {
        initializing: {
          entry: "saveRoomIdIfExist",
          invoke: {
            src: "getLocalMedia",
            onDone: [
              {
                target: "waitingForUserName",
                actions: "saveLocalMediaStream",
              },
            ],
            onError: [
              {
                target: "showingErrorGetLocalMediaModal",
              },
            ],
          },
        },
        showingErrorGetLocalMediaModal: {
          on: {
            RETRY_GET_MEDIA: {
              target: "initializing",
            },
          },
        },
        waitingForUserName: {
          entry: "initPeer",
          on: {
            TOGGLE_AUDIO: {
              actions: "toggleAudio",
            },
            TOGGLE_VIDEO: {
              target: "initializing",
              actions: "toggleVideo",
            },
            CREATE_ROOM: {
              target: "inRoom",
              actions: ["saveName", "saveRoomId", "updateUrl"],
            },
            JOIN_ROOM: {
              target: "connectingToRoom",
              actions: "saveName",
            },
          },
        },
        connectingToRoom: {
          entry: "removeError",
          invoke: {
            src: "startMediaConnector",
            onDone: [
              {
                target: "inRoom",
                actions: "saveNewStream",
              },
            ],
            onError: [
              {
                target: "waitingForUserName",
                actions: "saveError",
              },
            ],
          },
        },
        inRoom: {
          invoke: [
            {
              src: "startMediaListener",
            },
            {
              id: "messagingService",
              src: messagingMachine,
              data: (context, event) => ({
                ...defaultMessagingContext,
                userId: context.userId,
                userName: context.userName,
                peer: context.peer,
                mainHostId: context.roomId,
              }),
            },
          ],
          on: {
            MESSAGE_RECEIVED: {
              actions: "saveNewMessage",
            },
            TOGGLE_CHAT: {
              actions: "toggleChat",
            },
            MEDIA_CONNECTION_RECEIVED: {
              actions: "saveMediaConnection",
            },
            STREAM_RECEIVED: {
              actions: "saveStream",
            },
            DISCONNECTED: {
              target: "waitingForUserName",
            },
          },
        },
      },
    },
    {
      actions: {
        saveRoomIdIfExist: assign({
          roomId: (context, event) => {
            const urlArr = window.location.href.split("/");
            const roomId = urlArr[urlArr.length - 1];
            return roomId.trim();
          },
        }),
        saveLocalMediaStream: assign({
          localMediaStream: (context, event) => event.data,
        }),
        toggleChat: assign({
          sidebarMode: (context, event) =>
            context.sidebarMode === "chat" ? "none" : "chat",
        }),
        toggleAudio: assign({
          localAudioStatus: (context, event) => !context.localAudioStatus,
          localMediaStream: (context, event) => {
            context.localMediaStream
              ?.getAudioTracks()
              .forEach((v) => (v.enabled = !context.localAudioStatus));
            return context.localMediaStream;
          },
        }),
        toggleVideo: assign({
          localVideoStatus: (context, event) => !context.localVideoStatus,
        }),
        saveNewMessage: assign({
          messages: (context, event) => [...context.messages, event.message],
        }),
        saveName: assign({
          userName: (context, event) => event.name,
        }),
        saveStream: assign({
          streams: (context, event) => [...context.streams, event.streamData],
        }),
        initPeer: assign({
          peer: (context, event) =>
            !!context.peer ? context.peer : new Peer(context.userId),
        }),
        saveMediaConnection: assign({
          mediaConnections: (context, event) => {
            return {
              ...context.mediaConnections,
              [event.userId]: event.mediaConnection,
            };
          },
        }),
        saveError: assign({
          error: (context, event) => event.data as Error,
        }),
        removeError: assign({
          error: (context, event) => undefined,
        }),
        saveNewStream: assign({
          mediaConnections: (context, event) => {
            invariant(context.roomId);
            return {
              ...context.mediaConnections,
              [context.roomId]: event.data.mediaConnection,
            };
          },
          streams: (context, event) => [
            ...context.streams,
            event.data.streamData,
          ],
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
      },
      services: {
        getLocalMedia: async (context, event) => {
          if (context.localMediaStream && !context.localVideoStatus) {
            context.localMediaStream.getVideoTracks().forEach((t) => t.stop());
          }

          const media = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: context.localVideoStatus,
          });

          if (!context.localAudioStatus) {
            media.getAudioTracks().forEach((v) => (v.enabled = false));
          }
          return media;
        },
        startMediaConnector: (context, event) =>
          new Promise((resolve, reject) => {
            invariant(context.peer);
            invariant(context.roomId);
            invariant(context.localMediaStream);

            const mediaConnection = context.peer.call(
              context.roomId,
              context.localMediaStream,
              {
                metadata: {
                  userId: context.userId,
                  userName: context.userName,
                },
              }
            );

            const streamListener = (stream: MediaStream) => {
              mediaConnection.off("stream", streamListener);
              resolve({
                mediaConnection,
                streamData: {
                  stream,
                  userId: nanoid(), // TODO: Host Id
                  userName: "Todo Host Name",
                },
              });
            };

            mediaConnection.on("stream", streamListener);
          }),
        startMediaListener:
          ({ peer, localMediaStream, mediaConnections }, event) =>
          (callback, onReceive) => {
            invariant(peer);
            invariant(localMediaStream);

            Object.values(mediaConnections).forEach((mediaConnection) => {
              mediaConnection.on("stream", (remoteStream) => {
                callback({
                  type: "STREAM_RECEIVED",
                  streamData: {
                    stream: remoteStream,
                    userId: mediaConnection.metadata.userId,
                    userName: mediaConnection.metadata.userName,
                  },
                });
              });
            });

            peer.on("call", (mediaConnection) => {
              callback({
                type: "MEDIA_CONNECTION_RECEIVED",
                mediaConnection,
                userId: mediaConnection.metadata.userId,
              });
              mediaConnection.answer(localMediaStream);
              mediaConnection.on("stream", (remoteStream) => {
                callback({
                  type: "STREAM_RECEIVED",
                  streamData: {
                    stream: remoteStream,
                    userId: mediaConnection.metadata.userId,
                    userName: mediaConnection.metadata.userName,
                  },
                });
              });
            });

            return () => {
              peer.removeAllListeners();
              Object.values(mediaConnections).forEach((d) =>
                d.removeAllListeners()
              );
            };
          },
      },
    }
  );

export const mainService = interpret(mainMachine);

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
