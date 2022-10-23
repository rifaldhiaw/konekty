import { nanoid } from "nanoid";
import Peer, { DataConnection, MediaConnection } from "peerjs";
import invariant from "tiny-invariant";
import { assign, createMachine } from "xstate";

export type Message = {
  id: string;
  body: string;
  from: string;
  status: "pending" | "success";
};

export const mainMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBLAdgOi+gLuqgDboBeWUAxBAPaZi6YButA1o2lkwUaRZigIsrAMapC9ANoAGALqy5iUAAdasXvWUgAHogC0ARgBsATgDs2YwCYALLcPWArNZMAOcwBoQATwOHDS0N7azcZJ0MnczdjEwBfOO8uHDxCEnJKKjAAJ2zabOwVYgkAM3zkbGSeNP5KYRZacUlMRUVtNQ1m7T0EIzcAZjcra1MZfvNTSNC7bz8EfsNscJlnY37rcxljMacEpIwcWAALWgB3SgBRXPyAcTB8ABlGkgBZSCIX2ggSKgAlC4AKr8AJoAfRugNBLwuABEAJIAQTaSBAHU0mG6BmsMgC2H6-VsMlMblsJKcWy8vkQCyW5NW602236xj2ICqpwwhEEADF8gBVWA5AByqGQYCoAIA8jcbg8LqCEXz4ZLkap1OjMb1IsFsOYHGF8eYjaZrMZZli3KZsC43IYZGSYoTDP1WezOZRedkBcLReKpTK5aCAGpwmEXFXydrqroonpGUmLWKmFy2I32VOUub6QZW01OZMm8b4-Gug7YDm8Hn8wXZEViqgAZT5ACEXnCAaChQjoarUdH0FpY-5rM5rU5jOPTLYzJb1uatYFsMFbKbHDjnbZk6XuBWuVBPd7a77Gy22x2uz3DEoUWiY6A445NniR4ZTMZjOZHGt+vOAtYrISZiRBM4TWNuOCiPQDCiHuAK0L8tC0MgVAAMKSkKQoXChAJwuhoKSgAChcQq9reA4YkOvRrLY2BuB4wQDAMBJOPO8aLK4I7OBMIyOi6iRsmWWAIUhND0IwIjsJwgmYMJyD1GIEjka0kY3v2g73v4a7YFORqGG41jMh+Gyses-TYJu2oyEaOLvuY4FMLJWTXAURSlOUlTSbJ8nPM0ynXmqnTkZqRgBFa77GNO+mGeYxlUr04yLE4gx6mMWx2KELL8VUQmIch0INg2CIQqC-woRccJBrCpFqRRGm9LYThDJ+EUfsyIxjJmw5WKYCwReEto4jI9r2TlIkNsRMJQhcBVFRc1WBepugGLY-RWka5JOBEek8bY86hIs0TBKYJoreELgjTJuVUAiKEANJTTNxWleVlUwvNGqUfoqY0V+NjJkNSXJvOJK6nqq1uPmq1vpl+zcKNeWwoioJoRhWE4Xhz0VVVKkBR9dX6OOTjmT15gRatm7mCxcX6K4NFDdsEybRsLhbBdjkNkCFzdiVWEvdj-l9gttVLfV5K6vaE6kn9HW-kaS44psK3YsyjhuGzV0wgiAIIsj6GYdhuFCjzZVY29OOC3jIsE9s2AbJa2IRRTVNZgsZk2YMVnrSugTqyJ8INij+sAvzUZC8Fa504SU62V++Ksa+MjWoE0QQ64xK7KymBfHA2jZZgvDpAIUCh5bD5Tv+VnbGMK2knRu3U86iyRFXaW2tEKz2ccZyXM5dyPM8xBvBAHxfCQJd3lbr6k0nKVjKEUe-uEeLGB4K4WI1zdgVlZa7h61Y+mK49BZ9y6WAsDXOCY0xmtTPVWJtx0WKt76RBnsMQVBYAwZQcGyUfi1xkmGtKy2IGKrX6ESX8jglyhAsNMUY51t5w0ukhf+wtAG4mZASGKDJ3D1yzI3Jc44hqt0CGEN+AksBoOCtifMeICREhJGSCkrFUxDDzG+V89hwiZQSEAA */
  createMachine(
    {
      context: {
        roomId: "",
        userId: nanoid(),
        userName: "",
        peer: undefined,
        localMediaStream: new MediaStream(),
        localAudioStatus: false,
        localVideoStatus: true,
        messages: [],
        streams: {},
        dataConnections: {},
        mediaConnections: {},
      },
      tsTypes: {} as import("./mainMachine.typegen").Typegen0,
      schema: {
        context: {} as {
          roomId: string | undefined;
          userId: string;
          userName: string;
          peer: Peer | undefined;
          localMediaStream: MediaStream;
          localAudioStatus: boolean;
          localVideoStatus: boolean;
          messages: Message[];
          streams: Record<string, MediaStream>;
          dataConnections: Record<string, DataConnection>;
          mediaConnections: Record<string, MediaConnection>;
        },
        events: {} as
          | { type: "RETRY_GET_MEDIA" }
          | { type: "SUBMIT_NAME"; name: string }
          | { type: "TOGGLE_AUDIO" }
          | { type: "TOGGLE_VIDEO" }
          | {
              type: "MEDIA_CONNECTION_RECEIVED";
              mediaConnection: MediaConnection;
              userId: string;
            }
          | {
              type: "DATA_CONNECTION_RECEIVED";
              dataConnection: DataConnection;
              userId: string;
            }
          | {
              type: "CONNECTION_OPEN";
              dataConnection: DataConnection;
              mediaConnection: MediaConnection;
            }
          | { type: "SEND_MESSAGE"; message: Message; to: string }
          | { type: "MESSAGE_RECEIVED"; message: Message; from: string }
          | { type: "ACK_MESSAGE_RECEIVED"; messageId: string }
          | { type: "STREAM_RECEIVED"; stream: MediaStream; userId: string }
          | { type: "DISCONNECTED" },
        services: {} as {
          getLocalMedia: {
            data: MediaStream;
          };
          startMediaAndDataConnector: {
            data: {
              mediaConnection: MediaConnection;
              dataConnection: DataConnection;
            };
          };
        },
      },
      predictableActionArguments: true,
      initial: "initializing",
      id: "main",
      states: {
        initializing: {
          entry: ["saveRoomIdIfExist"],
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
            SUBMIT_NAME: [
              {
                target: "inRoom",
                cond: "noRoomId",
                actions: "saveName",
              },
              {
                target: "connectingToRoom",
                cond: "hasRoomId",
                actions: "saveName",
              },
            ],
          },
        },
        connectingToRoom: {
          invoke: {
            src: "startMediaAndDataConnector",
          },
          on: {
            CONNECTION_OPEN: {
              target: "inRoom",
              actions: "saveConnectionsFromConnector",
            },
          },
        },
        inRoom: {
          entry: "updateUrl",
          invoke: {
            src: "startMediaAndDataListener",
            onDone: [{}],
            onError: [{}],
          },
          on: {
            MESSAGE_RECEIVED: {
              actions: "savePendingMessage",
            },
            SEND_MESSAGE: {
              actions: "sendMessage",
            },
            ACK_MESSAGE_RECEIVED: {
              actions: "updatePendingMessage",
            },
            MEDIA_CONNECTION_RECEIVED: {
              actions: "saveMediaConnection",
            },
            STREAM_RECEIVED: {
              actions: "saveStream",
            },
            DATA_CONNECTION_RECEIVED: {
              actions: "saveDataConnection",
            },
            DISCONNECTED: {
              target: "waitingForUserName",
            },
          },
        },
      },
    },
    {
      guards: {
        hasRoomId: (context, event) => !!context.roomId,
        noRoomId: (context, event) => !context.roomId,
      },
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
        sendMessage: (context, event) => {
          const conn = context.dataConnections[event.to];
          conn.send(event.message);
        },
        savePendingMessage: assign({
          messages: (context, event) => [...context.messages, event.message],
        }),
        updatePendingMessage: assign({
          messages: (context, event) =>
            context.messages.map((m) =>
              m.id === event.messageId
                ? ({ ...m, status: "success" } as Message)
                : m
            ),
        }),
        saveName: assign({
          userName: (context, event) => event.name,
        }),
        saveStream: assign({
          streams: (context, event) => ({
            ...context.streams,
            [event.userId]: event.stream,
          }),
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
        saveDataConnection: assign({
          dataConnections: (context, event) => {
            return {
              ...context.dataConnections,
              [event.userId]: event.dataConnection,
            };
          },
        }),
        saveConnectionsFromConnector: assign({
          dataConnections: (context, event) => {
            invariant(context.roomId);
            return {
              ...context.dataConnections,
              [context.roomId]: event.dataConnection,
            };
          },
          // mediaConnections: (context, event) => {
          //   invariant(context.roomId);
          //   return {
          //     ...context.mediaConnections,
          //     [context.roomId]: event.mediaConnection,
          //   };
          // },
        }),
        updateUrl: (context, event) => {
          if (!context.roomId) {
            window.history.replaceState(
              {},
              "Room: " + context.userId,
              context.userId
            );
          }
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
        startMediaAndDataConnector:
          (context, event) => (callback, onReceive) => {
            invariant(context.peer);
            invariant(context.roomId);
            invariant(context.localMediaStream);

            const dataConnection = context.peer.connect(context.roomId, {
              metadata: {
                userId: context.userId,
                userName: context.userName,
              },
            });

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

            const openListener = () => {
              dataConnection.send("hi!");

              callback({
                type: "CONNECTION_OPEN",
                dataConnection,
                mediaConnection,
              });
            };

            dataConnection.on("open", openListener);

            return () => {
              dataConnection.off("open", openListener);
            };
          },
        startMediaAndDataListener:
          (
            { peer, localMediaStream, dataConnections, mediaConnections },
            event
          ) =>
          (callback, onReceive) => {
            invariant(peer);
            invariant(localMediaStream);

            peer.on("connection", (dataConnection) => {
              callback({
                type: "DATA_CONNECTION_RECEIVED",
                dataConnection,
                userId: dataConnection.metadata.userId,
              });
              dataConnection.on("data", (data) => {
                // Will print 'hi!'
                console.log(data);
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
                  stream: remoteStream,
                  userId: mediaConnection.metadata.userId,
                });
              });
            });

            return () => {
              peer.removeAllListeners();
              Object.values(dataConnections).forEach((d) =>
                d.removeAllListeners()
              );
              Object.values(mediaConnections).forEach((d) =>
                d.removeAllListeners()
              );
            };
          },
      },
    }
  );

/**
 * TODO:
 * - update room URL on host enter
 * - host should send active user list on someone new connected
 */
