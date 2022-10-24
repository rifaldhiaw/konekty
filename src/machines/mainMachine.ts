import { nanoid } from "nanoid";
import Peer, { DataConnection, MediaConnection } from "peerjs";
import invariant from "tiny-invariant";
import { assign, createMachine } from "xstate";

export type Message = {
  id: string;
  userName: string;
  body: string;
  from: string;
  status: "pending" | "success";
};

export type StreamData = {
  userId: string;
  userName: string;
  stream: MediaStream;
};

export const mainMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBLAdgOi+gLuqgDboBeWUAxBAPaZi6YButA1o2lkwUaRZigIsrAMapC9ANoAGALqy5iUAAdasXvWUgAHogC0AJgDMhgGzYAnAFYALObMzjZ+9YA0IAJ4GAjLYv2AOz+AByWPtZ2ljKBAL6xHlw4eIQk5JRUYABOWbRZ2CrEEgBmecjYSTyp-JTCLLTikpiKitpqGk3aeghG-oFW1iFhfsYyMobjHt4IPtiBZoEyC5aGgYaWwaHxiRg4sAAWtADulACiOXkA4mD4ADINJACykESPtBAkVABKpwAqXwBNAD6lz+QMepwAIgBJACCrSQIHamkwXQM5lsMmwZjMxhsPkshMMtncXkQs3mi2Wq3WwWseO2IEqRwwhEEADE8gBVWDZAByqGQYCovwA8pdLrdTkDYVyYaKEap1Ci0T1DD4ZJY5oSQtYbKZopYpgZTFiZBqVoYTDIQmYQv5GczWZROVkefzBcKxRKpUCAGrQyGnBXyNrKzqI7pGGIWBaBQaa9bWFzGnq2AlzWwhQKBUaa5M+MyO3bYFm8Dnc3lZAVCqgAYR+sN+0q+otFj0VSPD6C0kd8ZhWVjGlmMIR8znWxlJ030Pgi2GsubthYJ1jnPmL3DLbKgrvd1c9VAAUqLoXyga3253kRHQFGJj5+lOcVPx3jBqnrIYFxtibiv4Y9ohMYm44KI9AMKIO6-LQXy0LQyD1qKfJ8qcda-NCyFAqKAAKpx8te3a9nevgklqITEl+8a2LYlhZiEn79OEuqrP4mKRIEuqgUwcEIVQEIAMoCbCoIXmhpzQn6UKER0Paon2PSWCEZquLRSyAS4hipvo-jYpq0R2Hq5orrY3FYLxiECfhkLgqcQkiacMkqgp+iWGYswanOzhjhRgxGmSCDEv0tq2PGnH2H4JJxAkTIluZ8GIbCdYANK2fZok-HWElSZCTm3roBiEtY2Akqsc4TDI06INYWK6vMi4EqMupKaZMWVPFfEQjCsJAnWyGoehmHnpl2XSaGiI3nJqqzhqWKDPSZiAWMOLzNpozFaxNqBH4Sy0faZmYBZVACf8pywo8YlZZJY1KBNRHySRilrNgTihc4yYafYqYjNgPj2m56wEiSSzRTs3AdYhkJNj1fUoWhGFYSN125eNSqycRBU9BaxXGIsa4GUsCxmNpmK2NggG2KOwFmHYeKWAdR0wgJsMDc2KO3WjzmPbOaw4ws4zAdtVqjtpVpk5TpVEoBNiLfEMWYO8cDaO1mC8GkAhQGG6MPZjRgNSVlW6gOtGLTT2mFlilPMdEqx0ZqIFtSWBzHGcFxZNcdwPMQzwQK87wkFrXO6+YlXYPavOjpTfiBKm8wvbqkRRY4VEbo7W7OhWbpVjWYCB-l94yLpuZ0bR0QEiO5uASVdH6n4yZREWadgRBYBQZQMEWXnU0uX946-ZErE23Otift+NqRIu4RuRqxitWDySHQlXcY1GIzfnaNh2OMQv+TOhbFTErETOsNq2o38-Lzr952iE2K4vihIrCS2k1bfwTZvGYSLSYDvxEAA */
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
        streams: [],
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
          streams: StreamData[];
          dataConnections: Record<string, DataConnection>;
          mediaConnections: Record<string, MediaConnection>;
        },
        events: {} as
          | { type: "RETRY_GET_MEDIA" }
          | { type: "JOIN_ROOM"; name: string }
          | { type: "CREATE_ROOM"; name: string }
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
          | { type: "MESSAGE_RECEIVED"; message: Message }
          | { type: "ACK_MESSAGE_RECEIVED"; messageId: string }
          | { type: "STREAM_RECEIVED"; streamData: StreamData }
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
              actions: ["saveName", "updateUrl"],
            },
            JOIN_ROOM: {
              target: "connectingToRoom",
              actions: "saveName",
            },
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
          invoke: {
            src: "startMediaAndDataListener",
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
          mediaConnections: (context, event) => {
            invariant(context.roomId);
            return {
              ...context.mediaConnections,
              [context.roomId]: event.mediaConnection,
            };
          },
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
              callback({
                type: "CONNECTION_OPEN",
                dataConnection,
                mediaConnection,
              });
            };

            const streamListener = (stream: MediaStream) => {
              callback({
                type: "STREAM_RECEIVED",
                streamData: {
                  stream,
                  userId: mediaConnection.metadata.userId,
                  userName: mediaConnection.metadata.userName,
                },
              });
            };

            dataConnection.on("open", openListener);
            mediaConnection.on("stream", streamListener);

            return () => {
              dataConnection.off("open", openListener);
              mediaConnection.off("stream", streamListener);
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
                callback({
                  type: "MESSAGE_RECEIVED",
                  message: data as Message,
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
