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
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBLAdgOi+gLuqgDboBeWUAxBAPaZi6YButA1o2lkwUaRZigIsrAMapC9ANoAGALqy5iUAAdasXvWUgAHogC0ARgCcAVgAc2AEwBmU6cMA2GTccAWK6YA0IAJ4HDGVNsYzsrc0M3Q3s3YxkAdgBfRJ8uHDxCEnJKKjAAJzzaPOwVYgkAMyLkbDSeTP5KYRZacUlMRUVtNQ027T0EfSsZY2NrNxlIyJsZGSGrH38ED2tTY09TD3irY3i3U2TUjBxYAAtaAHdKAFECooBxMHwAGRaSAFlIIjfaCBIqACUrgAVf4ATQA+ndgeC3lcACIASQAgp0kCBuppMH0DFYrPFDCE9kMTCMrHsFohlp41jE8dtdhsDiBaucMIRBAAxIoAVVg+QAcqhkGAqECAPJ3O5PK7gpHcxFi1GqdSY7EDQy7AkyCKBMw2bbDGwUgZ40YOczxGxuS3axzmNyOJkstmULl5XkCoUi8WS6XggBqCLhV0V8i6Kt6aP6RniCRCFnM0zWZncRr8Bhs8VGnkcFnsw1MjicTqO2FZvE5PL5eUFwqoAGFAUigTL-mKxW8leiI+gtFGAvq3NhDOYrCOIq5tnZjfp4sFtZFjFETA5DIYS9xy+yoG6PTWvVQAFJihH88FtjtdjGR0DRpxuSyOTPmcwOGw2MzmY2hbDapfv19cXtRMNxwUR6AYURtyBWh-loWhkAbMV+X5K56yBBFkPBMUAAUrn5K8ez7W8AmGAlAlMeIqI2WIHy-dMEGMSwogSRd3CCSjjFApg4IQmh6EYER2E4UssF45AmjECRe3aeRCJ6GS1SMPEbGwexTBkWJQkcJ99RnGwnBCJwZHcRx8QSS1uLE+DEPyQpilKCoqhqUTMHEyTXjaDowzRa9FP7dU6WsS0sxGVxdPmBj9FcIdjCfbYPFY0wrSSFJmVc8SqFhABlbKkShc80KuBF-XheTVQC-QiwJfVMxGEzwncSLFiq4cNXxLNVgmJwNX2NLamsvjsvwuEYSuXL8qucqb10AxVisbAbFHJa7RHTxzGMY1wksOxHCXZKPEiPZUsObhBsQpF6wAaTGiaCsBetitKuFpv8kiBkcKxHGwS0PyLIYgm-GrYntB1Qm1VZzCstybKy+FkXBetkNQ9DMLPB6nrKnzlQU4jZoGS0CXMHT-vMGYdPiRwZy+od4giDa4vGdwmLcaHMuykEriRN5CsekqsaUXyiKxSrnFUgzIdzT7iY8Y0R1Usz8Q0qJ9pMk70rOmG+LhZskUR5G0IwrCMf5l7se7XGRfe2cvuwXMNT2oITLMqmotcVSs1xGZiY2D8uP6jLYcRbKkZQw2BfDS2lMMXa7YfPFE3xXElpneXCVsDwPHCFMrGSNLMB+OBtAGzBeCyAQoEjirra9ha7XMvbYk+3NU5MQlYwmUxTXGUJuNOC5rluPIHmeV5iA+CAvh+Egq5m6Nk-iYdwg0pa3AM605cMyiqMSymgjxdcA83F1K3datazAWe3vxowzMsWYTJGOISTTFqX1-WZKcLPZcyb7jwMwJBaCsEbJXzxneNwkDsBr1zGSOIY5IjfgWtvBkKsiwuFZkfdIWtkBgKtjfQIT4QixjJuMA+2xU5kjUmTGIXc4gvh0qBPBSlbBt32sSJ+ZJvBRQdJYHMqwHSzFWHYPOiQgA */
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
