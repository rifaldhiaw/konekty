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
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBLAdgOi+gLuqgDboBeWUAxBAPaZi6YButA1o2lkwUaRZigIsrAMapC9ANoAGALqy5iUAAdasXvWUgAHogC0AJgAcMgOzYzMgMzGALAEYH1mQDZDr1wBoQATwPOAKzYhmZ21nauZrYAnC4xdgC+iT5cOHiEJOSUVGAATnm0edgqxBIAZkXI2Gk8mfyUwiy04pKYioraahpt2noIRgnGljL2noGGdobTPv4IDobYMYYyDjGrNjEOgYHRyakYOLAAFrQA7pQAogVFAOJg+AAyLSQAspBEr7QQJFQASpcACp-ACaAH1bkCwa9LgARACSAEFOkgQN1NJg+gZrAsHNhHNYJlY4nZIt4-IgFksVmsNtYtjtjPsQLUzhhCIIAGJFACqsHyADlUMgwFRAQB5W63R6XMGInkI8Uo1TqDFYgaGQLrbCBOwJCLuMxOcyzbGjbDGXamGQyXWamzWZms9mUbl5PmC4WiiVSmVggBq8NhlyV8i6qt6qP6Rh2FimRsCrhkhmsZlcu1NAzs5q1icCo2shn1gSdh2wbN4XN5-LyQpFVAAwgDEYDZX9xeLXsq0RH0FoowZDA5oth07bnCmZHrE5n9A4p-iVjsElNjMsYkyUiyyxWOVA3R7a16qAApcXwgVg9ud7voyOgaOTDfYefuefTYzbBKZ1zWSz56xXEtEx1iLEst1qUR6AYUQ90BWg-loWhkBoehGBEdhODLKDMBguCEKQ5AmjECQ+3aeRb17fsHwCBIYmwHEbETOxAgcUkYjMH8-zMADPxMUJjCHbZS24HC8MoeDEOQ3IbmKUoKiqGpsOgsBYIkgjkOIl42g6MNUTvMj1SMX8ZAtMCHE-GI4mMYxMwcVx6LMTUPAiNNAhcTcDm4LApJQugGCYVgOCU7zMF8rTWjI3SlH0qjMQHDV5zxPM9R460bU4ikBkA+jXCmDdPBicYkzMET0jCwiZMKOSynwSo8mqWofMIiLSOkCi9JVHpDISox51Mkwpgy4cokLWdCzsF8CpWT9E2TGIyqYXyqBhABlVbEUhK9LgbS54X9OFKO66jdACSJTLMZYFkcXY3Dy8bghYqJjELQT6QiBaILLZrpNWy4BVhaFLnWzbLiOtVerYxwLXzI01mu1xnEzTV6NWMwbJtCy01CRafpQn1pVlBsAAkW3B+9ToGbYizMian3sNzZz1RZjDyxjEeMaIOPArzyuWxEGwAaSBkGtoBXb9sOzqe2O+KaKpuw0xCZMTHcBIrBmLL3GwDYzEunKrEcBxcYq6SYQRREwQbcUBQFHbAXhG3tolg7YXJnr5bnQJPwYj7UzXOxWas2ci0mhYZCKvU8psYcTeW1bgUuRFXmdvbXfdk7ozYiZLHsHF7Nuzw7Ds3VfdMS0I6TIDPO3ULlthFtLet237cdy9xbTqWYq6iHPe2JXw4jxxSSDmJxriF8cQ8DmbKHPW48qhFVubu2G1bN3pYMzPBxWVwX3spMDTtck5j6v8TDY8wwkNHjki3TBvjgbQmswXgsgEKBw1loyXBz7ZdULFOWwJhZxsXoqrO6loJwmEWicc4VxZL3CeC8Yg7wICfG+CQL+vdKb6A8nvLUQEQKpgiKzTMnMQi2CiFECYURRhJC+twXcrpqyehFNgimj4iT4jXMmPURU1gsVAcOBijgXqV3WIBF6i0xKqXwr5DhHtcHTAnusQO-Cio4h2FxShrNrRFQ-JEBhvMlqEUUdvKmWw-zhC2EWXE1gp6gPcksNYiMNwTEVraR0jC5YyxwdGHEDl8RBFCBHCIZJZzezxKzcI1NQJALvokIAA */
  createMachine(
    {
      context: {
        roomId: "",
        userId: nanoid(),
        userName: "",
        error: undefined,
        peer: undefined,
        localMediaStream: new MediaStream(),
        localAudioStatus: false,
        localVideoStatus: true,
        sidebarMode: "none",
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
          error: Error | undefined;
          peer: Peer | undefined;
          localMediaStream: MediaStream;
          localAudioStatus: boolean;
          localVideoStatus: boolean;
          sidebarMode: "none" | "chat";
          messages: Message[];
          streams: StreamData[];
          dataConnections: Record<string, DataConnection>;
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
              actions: ["saveName", "updateUrl"],
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
            src: "startMediaAndDataConnector",
            onDone: [
              {
                target: "inRoom",
                actions: "saveConnectionsAndStream",
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
            TOGGLE_CHAT: {
              actions: "toggleChat",
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
        saveError: assign({
          error: (context, event) => event.data as Error,
        }),
        removeError: assign({
          error: (context, event) => undefined,
        }),
        saveConnectionsAndStream: assign({
          dataConnections: (context, event) => {
            invariant(context.roomId);
            return {
              ...context.dataConnections,
              [context.roomId]: event.data.dataConnection,
            };
          },
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
        startMediaAndDataConnector: (context, event) =>
          new Promise((resolve, reject) => {
            invariant(context.peer);
            invariant(context.roomId);
            invariant(context.localMediaStream);

            const dataConnection = context.peer.connect(context.roomId, {
              metadata: {
                userId: context.userId,
                userName: context.userName,
              },
            });

            context.peer.once("error", (err) => {
              console.error(err);
              reject(err);
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

            const streamListener = (stream: MediaStream) => {
              mediaConnection.off("stream", streamListener);
              resolve({
                mediaConnection,
                dataConnection,
                streamData: {
                  stream,
                  userId: nanoid(), // TODO: Host Id
                  userName: "Todo Host Name",
                },
              });
            };

            mediaConnection.on("stream", streamListener);
          }),
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
