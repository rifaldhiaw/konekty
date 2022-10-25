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
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBLAdgOi+gLuqgDboBeWUAxBAPaZi6YButA1o2lkwUaRZigIsrAMapC9ANoAGALqy5iUAAdasXvWUgAHogC0AJgAcMgOzYzMgMzGALAEYH1mQDZDr1wBoQATwPOAKzYhmZ21nauZrYAnC4xdgC+iT5cOHiEJOSUVGAATnm0edgqxBIAZkXI2Gk8mfyUwiy04pKYioraahpt2noIRgnGljL2noGGdobTPv4IDobYMYYyDjGrNjEOgYHRyakYOLAAFrQA7pQAogVFAOJg+AAyLSQAspBEr7QQJFQASpcACp-ACaAH1bkCwa9LgARACSAEFOkgQN1NJg+gZrAsHNhHNYJlY4nZIt4-IgFksVmsNtYtjtjPsQLUzhhCIIAGJFACqsHyADlUMgwFRAQB5W63R6XMGInkI8Uo1TqDFYgaGQLrbCBOwJCLuMxOcyzbGjbDGXamGQyXWamzWZms9mUbl5PmC4WiiVSmVggBq8NhlyV8i6qt6qP6Rh2FimRsCrhkhmsZlcu1NAzs5q1icCo2shn1gSdh2wbN4XN5-LyQpFVAAwgDEYDZX9xeLXsq0RH0FoowZDA5oth07bnCmZHrE5n9A4p-iVjsElNjMsYkyUiyyxWOVA3R7a16qAApcXwgVg9ud7voyOgaOTDfYefuefTYzbBKZ1zWSz56xXEtEx1iLEst1qUR6AYUQ90BWg-loWhkBoehGBEdhODLKDMBguCEKQ5AmjECQ+3aeRb17fsHwCBIYmwHEbETOxAgcUkYjMH8-zMADPxMUJjCHbZS24LBEOQ1CGCYVgOBqMsxMI4iXjaDow1RO8yPVIx5zxPM9R460bU4ikBkA+jXCmDdPBicYkzMET0kwcSUJhABlVzEUhK9LgbS54X9OFKJ6TSBwGNik0sZYFkcXY3As2dCXxRMzGMQtBPpCIYgcphnNyG5ilKCoqjk0SnMUjDWjI1SlHUqjMVC7SbRCewVnMYcokLBLJhfKyVk-RNkyyiD5LKiTXMuAVYWhS53M8y4grVBq2McC18yNNZotcZxM01ejVhS60HGMNNQmyhSJJ9aVZQbAAJFsFvvXQAgmej0smJ97DTQJZz1RZjAsxituO+keLO0aUMRBsAGlptmryAV8-zArUlVguop6wrsNMQmTEx3ASKwZhM9xsA2MwzDiVwOKnJwwdymEEURMEG3FAUBR8wF4VZ7zEYC2EHpCmiwsCT8GMy1M1zsf6YhiWcizsF8VhsvULJsYc6cIqhXOBS5EVeHm-L5gX0ejNiJksewcQcdMrE8OxM22BXrFsUZ8xstxjE3A5Sty2EWyZlm2Y5rnLwRw3kZq1HFqFuddlcRWbQSZbpdlkz9Ayl8cQ8IHPaHcmNYkhFXMD9mG1bfmUZ7NH6pj6Y3Bfa2kwNO1yTmbS-xMNjzDCQ1QeZTBvjgbRagyPhskEcNq60lxze2XVCynWwTFnNj6LxuLLQnExspOc4rny+4nheYh3ggT5vhISfo4x9PRnjrUgJA1MIn+zNjpCWwoiiCYolGJJhu4LuV01ZPQiivo9R8RJ8RrmTHqGyawWIr2HAxRwqUZA2XWIBVK2UcJ4UoPBZy4DBY32mHEJYU57AyxsjiHYXEP7-WtDZD8kR-7e0coQ2qU8lpbD-OELYRZcTOwWCvQIf4tjwI3BMLGtpHQAJrlXa+0YcRU3xEEUI6CIhklnCLPE-1LKe3cFjIayQgA */
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
          invoke: {
            src: "startMediaAndDataConnector",
            onDone: [
              {
                target: "inRoom",
                actions: "saveConnectionsAndStream",
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
