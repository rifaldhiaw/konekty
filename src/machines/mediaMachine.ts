import Peer, { MediaConnection } from "peerjs";
import invariant from "tiny-invariant";
import { assign, createMachine, interpret } from "xstate";
import create from "zustand";
import { mainService, UserData } from "./mainMachine";

type UserMediaConnectionData = UserData & {
  connection?: MediaConnection;
  stream?: MediaStream;
  status: "idle" | "connecting" | "connected" | "error";
};

const mediaMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QFtIEsCGA6NEA2YAxAMoAqAggEqkDaADALqKgAOA9rGgC5psB2zEAA9EAWgDM4gGxSs4gOwBWcQEYpAFgCc66XUUAaEAE8xm+VhVL18zYvl1rO+QF9nh1BEw4+lNm2QkpJQAouQAsgD6IQDCwQCSAGrBACL0TEgg7Jw8-IIiCKIATA50WNqKAByaKoWFUmoV6oYmBYVaWMrqKhWNKnQV4o0Vru7o2Gg+fgHR5AAys1HBsYkpaYJZ3LwCGflFdKpldpWadNUVhT3NYgoVWOqK2uL74urnFVKKIyAeXhO+-oRogB5AByIKWpDioIiwUolCBlDWGQ2OW2oF2xVeWEKlXEinUXRk0iaxkQfXMCgemjaGhUD3k6i+P3GkwBwLBEKhIIi0VmQOIq0Y6w4m1yOzExWUZXuGh6qkUtXkVwQtwqekcCnUHzMwzc3zG3n+AVIQIA4qbZsEIuQAKrJKFI1gi1F5MSWRSlKQ9JRyrQKcTKop1Cx0eQfBl0wpmaxMg1-KaEE3my0RBJxZLBIGOzLOraugqWeodap9FTUuiFeSXUkFBR3KTyGzFc4qVv7WOebAwLg8PhQWZsADGGDwYTGhAg-DA3gAbmwANbT5lYbu9-tDkdjzsICZz4eotLZlF58WtCqKRRycQ4hk6+wqQM1T1SBSVxQqLR0BxSDteVcTddh1HccwAAJ1AthQKwFg8AwLgADNIOQLBl3-PsByArdMB3Pg9zgrZDyFZFczFdFrjoL0sCUHE7CqU5zikR8zCwbU1CeWxanDX9sFgAALNgAHcAOCcDIIwzdxxCIIAE0IlNYJSAiMIUjicgjxItFhGuC5zEcWiLzaXEmPMbVikrAYekUF9uKwPAN2AztKDADAICMQIqEUmZ5nU7ITzI1pr0KMowxOSpzzMKzH2KFiXwZKzCjUGx8RsuzMLGJyXLcpMLStW17SzIinV80itNaBVzDDCiBnUfYZC1QNZAbAZTlxVR7hsFL7KwjAMtcxMzRy1N00zHzRU0jFzk0MoKKsBR9nfAMa1ERqq3Y1qP0qD5XD1Pg2AgOBBGXXACGFYrxuuV5LzLV53TaE57kDZj3WsWx7A1XVRk7Q0plOsb8z2eQVAsf1lC-QpVE0RaWlEFQXhYqwpFqcluk0H89VQsAewA8SHMwX6XVPCRQ3EO5AajCpLH6JQobdBKLCsaxznsRstBsvjBOE0TQJx7r8b80qiZsDowzVGQpFsB8lsrEmKkbSQGXqaRBk6tLHOc1y+ZKjFFYsC4pAcQZxbxEloZqIHnrVCjYrMcRuM187a2UEnrop6jPwepatV0h4CT0c9YboOltucIA */
  createMachine(
    {
      context: {
        userId: "",
        userName: "",
        userData: [],
        peer: undefined,
        localMediaStream: new MediaStream(),
        localVideoStatus: true,
        localAudioStatus: false,
      },
      tsTypes: {} as import("./mediaMachine.typegen").Typegen0,
      schema: {
        context: {} as {
          userId: string;
          userName: string;
          userData: UserMediaConnectionData[];
          peer: Peer | undefined;
          localMediaStream: MediaStream;
          localVideoStatus: boolean;
          localAudioStatus: boolean;
        },
        services: {} as {
          getLocalMedia: {
            data: MediaStream;
          };
          callAllUserInRoom: {
            data: undefined;
          };
        },
        events: {} as
          | {
              type: "START";
            }
          | {
              type: "RETRY_GET_MEDIA";
            }
          | {
              type: "START_CALL";
              userId: string;
              userName: string;
              peer: Peer;
              userData: UserData[];
            }
          | {
              type: "TOGGLE_AUDIO";
            }
          | {
              type: "TOGGLE_VIDEO";
            }
          | {
              type: "STREAM_RECEIVED";
              stream: MediaStream;
              userId: string;
              userName: string;
            }
          | {
              type: "CONNECTION_ERROR";
              userId: string;
            }
          | {
              type: "CONNECTION_CLOSED";
              userId: string;
            }
          | {
              type: "CALL_RECEIVED";
              connection: MediaConnection;
              userId: string;
              userName: string;
            },
      },
      predictableActionArguments: true,
      id: "media",
      initial: "idle",
      states: {
        idle: {
          on: {
            START: {
              target: "gettingLocalMedia",
            },
          },
        },
        inRoom: {
          invoke: [
            {
              src: "startNewCallListener",
            },
            {
              src: "callAllUserInRoom",
            },
          ],
          on: {
            STREAM_RECEIVED: {
              actions: "saveStream",
            },
            CALL_RECEIVED: {
              actions: ["saveConnection", "answerTheCall"],
            },
            CONNECTION_ERROR: {
              actions: "setConnectionToError",
            },
            CONNECTION_CLOSED: {
              actions: "removeConnection",
            },
            TOGGLE_AUDIO: {
              actions: "toggleAudio",
            },
            TOGGLE_VIDEO: {
              actions: "replaceVideoTrack",
            },
          },
        },
        gettingLocalMedia: {
          invoke: {
            src: "getLocalMedia",
            onDone: [
              {
                target: "localMediaReady",
                actions: "saveLocalMediaStream",
              },
            ],
            onError: [
              {
                target: "showingErrorLocalMedia",
              },
            ],
          },
        },
        showingErrorLocalMedia: {
          on: {
            RETRY_GET_MEDIA: {
              target: "gettingLocalMedia",
            },
          },
        },
        localMediaReady: {
          entry: "tellLocalMediaReady",
          on: {
            START_CALL: {
              target: "inRoom",
              actions: "saveUserDataAndPeer",
            },
            TOGGLE_AUDIO: {
              actions: "toggleAudio",
            },
            TOGGLE_VIDEO: {
              target: "gettingLocalMedia",
              actions: "toggleVideo",
            },
          },
        },
      },
    },
    {
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
        callAllUserInRoom: (context, event) => (callback, onReceive) => {
          context.userData.forEach((u) => {
            invariant(context.peer);
            invariant(context.localMediaStream);

            const conn = context.peer.call(u.id, context.localMediaStream, {
              metadata: {
                userId: context.userId,
                userName: context.userName,
              },
            });

            conn.on("stream", (stream) => {
              callback({
                type: "STREAM_RECEIVED",
                stream: stream,
                userId: u.id,
                userName: u.name,
              });
            });

            conn.on("close", () => {
              callback({
                type: "CONNECTION_CLOSED",
                userId: u.id,
              });
            });

            conn.on("error", () => {
              callback({
                type: "CONNECTION_ERROR",
                userId: u.id,
              });
            });
          });
        },
        startNewCallListener: (context, event) => (callback, onReceive) => {
          invariant(context.peer);
          context.peer.on("call", (conn) => {
            const userId = conn.metadata.userId;
            const userName = conn.metadata.userName;

            callback({
              type: "CALL_RECEIVED",
              connection: conn,
              userId,
              userName,
            });

            conn.on("stream", (stream) => {
              callback({
                type: "STREAM_RECEIVED",
                stream: stream,
                userId,
                userName,
              });
            });

            conn.on("close", () => {
              callback({
                type: "CONNECTION_CLOSED",
                userId,
              });
            });

            conn.on("error", () => {
              callback({
                type: "CONNECTION_ERROR",
                userId,
              });
            });
          });

          return () => {
            context.peer?.removeAllListeners();
          };
        },
      },
      actions: {
        tellLocalMediaReady: (context, event) => {
          mainService.send("LOCAL_MEDIA_READY");
        },
        saveUserDataAndPeer: assign({
          userId: (context, event) => event.userId,
          userName: (context, event) => event.userName,
          peer: (context, event) => event.peer,
          userData: (context, event) =>
            event.userData.map(
              (u) => ({ ...u, status: "idle" } as UserMediaConnectionData)
            ),
        }),
        saveLocalMediaStream: assign({
          localMediaStream: (context, event) => event.data,
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
        replaceVideoTrack: (context, event) => {},
        saveStream: assign({
          userData: (context, event) =>
            context.userData.map((u) =>
              u.id === event.userId ? { ...u, stream: event.stream } : u
            ),
        }),
        saveConnection: assign({
          userData: (context, event) => [
            ...context.userData,
            {
              id: event.userId,
              name: event.userName,
              connection: event.connection,
              stream: undefined,
              status: "connected",
            } as UserMediaConnectionData,
          ],
        }),
        setConnectionToError: assign({
          userData: (context, event) =>
            context.userData.map((u) =>
              u.id === event.userId
                ? ({ ...u, status: "error" } as UserMediaConnectionData)
                : u
            ),
        }),
        removeConnection: assign({
          userData: (context, event) =>
            context.userData.filter((u) => u.id !== event.userId),
        }),
        answerTheCall: (context, event) => {
          event.connection.answer(context.localMediaStream);
        },
      },
    }
  );

export const mediaService = interpret(mediaMachine, {
  devTools: true,
  id: "MEDIA - " + Date.now().toString().slice(-4, -1),
});

type MediaServiceState = ReturnType<typeof mediaService["getSnapshot"]>;

export const useMediaService = create<MediaServiceState>((set) => {
  mediaService
    .onTransition((state) => {
      const initialStateChanged =
        state.changed === undefined && Object.keys(state.children).length;

      if (state.changed || initialStateChanged) {
        set(state);
      }
    })
    .start();

  return mediaService.getSnapshot();
});
