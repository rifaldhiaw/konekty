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
  /** @xstate-layout N4IgpgJg5mDOIC5QFtIEsCGA6NEA2YAxAMoAqAggEqkDaADALqKgAOA9rGgC5psB2zEAA9EAWgDM4gGxSs4gOwBWcQEYpAFgCc66XUUAaEAE8xm+VhVL18zYvl1rO+QF9nh1BEw4+lNm2QkpJQAouQAsgD6IQDCwQCSAGrBACL0TEgg7Jw8-IIiCKIATCrq6lgAHCqF5YWS5Yo1koYmCCV0WNXl2lJ0KuXqKpoqiq7u6NhoPn4B0eQAMnNRwbGJKWmCWdy8Ahn5RSriihWF6opq5ZW29c2IhYVYjmflkgO24qejIB5ek77+hNEAPIAOWBy1IcRBEWClEogMo6wymxyO1Aez6tiwdHkJ3UUksvW6NwKhTOWEUFMUhU0th61kUUk+3wmU3+QNB4MhwIi0TmgOIa0YGw4W1yuzEGM0WCk9gOMspmik5WJEnU5WlhQ0mjqxXs8nUTPG3j+AVIgIA4ua5sEIuQAKrJSGI1gilF5CXPe42KSqcq9OiaOjY4kqFRYqr62k4ob9TSGzwsk2EM2W60RBJxZLBQHOzKu7bugp9GUdUm2U6UlR6EMlDp4mVqhTFP0jNxfI0wLg8PhQOZsADGGDwYXGhAg-DA3gAbmwANaT5lYTvd3sDocjhMISYzwcotK55EF8Uk+pHSSkyPycqylVVdoyJtKEqBhyMtuL5eTVeD4ejsAAJ3-Nh-ywFg8AwLgADNgOQLAPzALsvz7H8N0wLc+B3CDtn3IUkXzMU0TEcQ6CVLAlFJOwugDGopFvMxpUUIYfQDKlNTseMvFgAALNgAHcv2CQDgOQ9dRxCIIAE0InNYJSAiMIUjicgD3w1FhCI6pzEeK8KROBpxDo8wpEYwo6EKK9xAuBlxA47A8DXX8E0oMAMAgIxAioOTZgWFTsiPQiSXEO4sDMKRAwaeozAZW9TOlH19QZYoZXLWysHslDxmc1z3JTK0bXtR0c1wl0-II9SSSpcx5B6JV3joaQNFo4wxFkGVnhY55VFOGxUvS0SnJctzkwtPL00zbNfNFNS9mqakQpIqwFHqs4DOagpWosjrJBKBpjNcNs+DYCA4EERdcAIYVSumoi1SOQY1UsKktAcAw1tEejHusWx7EcSzUt+aZLqmwsihI9piLUeQSn1GwFFvd5pSsHFNKkE5pFSz8exExzMCBt1jwkbFxAeKHqUqexr2UGKw0+6waj1SNUu4viBKE-9sdQjA8f88rCZsclqr9GQwrOFVzOJ695EkfV8WkP73yNPqcYwLK3O5sqZtlixqjpSywsOdRqYsKw-RI+KzBshWE3V66CkOSQLG0cmnsDU4VScDUtSpTRilsFR9ucIA */
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
              connection: MediaConnection;
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
              actions: ["toggleVideo", "stopOrReplaceVideoTrack"],
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
            video: context.localVideoStatus
              ? { width: 640, height: 360 }
              : false,
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
                connection: conn,
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

            new Audio("./enter.mp3").play();

            conn.on("stream", (stream) => {
              callback({
                type: "STREAM_RECEIVED",
                connection: conn,
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

            conn.on("error", (e) => {
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
        stopOrReplaceVideoTrack: async (context, event) => {
          if (!context.localVideoStatus) {
            context.localMediaStream?.getVideoTracks().forEach((v) => {
              v.stop();
            });
            const activeLocal = context.localMediaStream.getVideoTracks()[0];
            context.localMediaStream.removeTrack(activeLocal);
          } else {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
              video: { width: 640, height: 360 },
            });

            const videoTrack = mediaStream.getVideoTracks()[0];

            context.userData.forEach((v) => {
              const sender = v.connection?.peerConnection
                .getSenders()
                .find((v) => v?.track?.kind === videoTrack.kind);
              sender?.replaceTrack(videoTrack);
            });

            context.localMediaStream.addTrack(videoTrack);
          }
        },
        saveStream: assign({
          userData: (context, event) =>
            context.userData.map((u) =>
              u.id === event.userId
                ? { ...u, stream: event.stream, connection: event.connection }
                : u
            ),
        }),
        saveConnection: assign({
          userData: (context, event) => {
            const found =
              context.userData.findIndex((v) => v.id === event.userId) !== -1;
            if (found) {
              return context.userData.map((v) =>
                v.id === event.userId
                  ? { ...v, connection: event.connection }
                  : v
              );
            } else {
              return [
                ...context.userData,
                {
                  id: event.userId,
                  name: event.userName,
                  connection: event.connection,
                  stream: undefined,
                  status: "connected",
                } as UserMediaConnectionData,
              ];
            }
          },
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
  id: "MEDIA - " + new Date().getMinutes() + ":" + new Date().getSeconds(),
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
