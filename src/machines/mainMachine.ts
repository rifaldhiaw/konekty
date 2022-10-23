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
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBLAdgOi+gLuqgDboBeWUAxBAPaZi6YButA1o2lkwUaRZigIsrAMapC9ANoAGALqy5iUAAdasXvWUgAHogC0ARgBsATgDs2YwCYALLcPWArNZMAOcwBoQATwOHDS0N7azcZJ0MnczdjEwBfOO8uHDxCEnJKKjAAJ2zabOwVYgkAM3zkbGSeNP5KYRZacUlMRUVtNQ1m7T0EIzcnJ2wnGWtTUxiAZlMp81tvP17HK2mTW3C3QxlNmTcEpIwcWAALWgB3SgBRXPyAcTB8ABlGkgBZSCIX2ggSKgAlC4AKr8AJoAfRugNBLwuABEAJIAQTaSBAHU0mG6BmsWxk2EiI2sE3MFjchOM80QJishg8aycxlsFlsE1sTj2ICqpwwhEEADF8gBVWA5AByqGQYCoAIA8jcbg8LqCEQL4dLkap1OjMYsIrZsLMaTIJkTzMTrOTfFi3KYhqFNm5WTE1oYJuzOdzKPzskLReLJQBlAUAIRecIBoJFCOh6tRmq6KJ6RmsziG9PpplsZmtE2sFMWgTxIVi2ICLNMbMSHIO2C5vD5guF2TFEqogZDYYjUYuUkMShRaPjoETjnMuJzrlMxmM5kcxmNeYC1isazMkWJ4WsburtZ5UC9PqbfqlsvlioAanCYRc1fJ2nH0FoE-5bBtqeW7Kb7LZTXn9BNrdg5pOOWpiEuYxrGlu3CiPQDCiLuAK0L8tC0MgND0IwIjsJw1YwZgcEIUhKHIPUYgSA+LTyDGA4Udq+igUuoHAS4UwyKYgROAuVhEsBMjGE4EybMmTi7JWVRYMhqHoQwTCsBwlTVhJxGkc8zStLe-b3o+Q7+I4uIZqaNJktO1heJavQ5hM2CMpEmymlsU7mFBKSYJJaE5HkBRFKU5QKdwSmoSpTQUepfYap0tFPvmhg2lODLGKSEyOaZv5EoYQz-rMRp8XYoTGM5TBuVQ0L+v6CIQqC-wAMIXHCZ6wtRWkYlF+iOvqqzTkloxGmZCxJssgkMusmzbKJ+z+a5xGthcIowlCFyleV3YaeFWotcyNqmsMAwBKS4xzOZdr6hsjKgcy4QuAVAVoQiVUANLzYtFXVbV9Uwo1EXaboBjfnqs42OWMjhFMnHmQ6+qzFM-TTGMU5XZNUnQvCCKglV0oiiKFxVQCcLo5VWOvQ1K2xp9zU6b0abWdM5gMlMjLmKDfWuHqQPGDIxIDKZLh8fDRX+kCFxRvjNV1UTYUk2t5OtcM+o7PxL4Az1C6mniWyjsy2JJY4Y1VhNRUwgiAIo2jGNYzjeMvaL73EzRX2JvSuKmda2IMvTjMGIJVkOf+7NbbYrhOWJikI2h8L+ibmPY2Ld6k3Reks2sGaObO87mUYpi4hEppuP0E79AklaYF8cDaOJmC8OkAhQDHkvfYsGZLuzbNGsyL45wdfUuulkTNzlGzRCMBXHGclzXNkdyPM8xBvBAHxfCQNeDnX6c00MgRrEaoSJwu4TYEltKjAzGz0puQfcDunoNr6EqL5FUvBN+e-BC4EQ2KSFp9dMVgDGMFhTFOkQKzjRwHhAilBEJuVvnbAw7FNrsxLC+KYEw2ILiWNrCwoRuqXTPi5SBmlY4tXYulJKLJdRuCQSgtOARLD8WAuWASUQeY4KgWTZe2IRJ4mGMmIkJI7C-m-G4QC-FJzBHfBnU+CQgA */
  createMachine(
    {
      context: {
        roomId: "",
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
          | { type: "SUBMIT_NAME" }
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
                actions: "initPeer",
              },
              {
                target: "connectingToRoom",
                cond: "hasRoomId",
                actions: "initPeer",
              },
            ],
          },
        },
        connectingToRoom: {
          invoke: {
            src: "startMediaAndDataConnector",
            onDone: [
              {
                target: "inRoom",
                actions: "saveConnectionsFromConnector",
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
            return roomId;
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
        saveStream: assign({
          streams: (context, event) => ({
            ...context.streams,
            [event.userId]: event.stream,
          }),
        }),
        initPeer: assign({
          peer: (context, event) => new Peer(),
        }),
        saveMediaConnection: assign({
          mediaConnections: (context, event) => {
            invariant(context.roomId);
            return {
              ...context.mediaConnections,
              [event.userId]: event.mediaConnection,
            };
          },
        }),
        saveDataConnection: assign({
          dataConnections: (context, event) => {
            invariant(context.roomId);
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
        }),
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
        startMediaAndDataConnector: (context, event) => {
          return new Promise((resolve, reject) => {
            invariant(context.peer);
            invariant(context.roomId);
            invariant(context.localMediaStream);

            const dataConnection = context.peer.connect(context.roomId, {
              metadata: {
                id: context.peer.id,
              },
            });
            const mediaConnection = context.peer.call(
              context.roomId,
              context.localMediaStream,
              {
                metadata: {
                  id: context.peer.id,
                },
              }
            );

            resolve({
              dataConnection,
              mediaConnection,
            });
          });
        },
        startMediaAndDataListener:
          (
            { peer, localMediaStream, dataConnections, mediaConnections },
            event
          ) =>
          (callback, onReceive) => {
            invariant(peer);
            invariant(localMediaStream);
            console.log("peer.id:", peer.id);

            peer.on("connection", (dataConnection) => {
              console.log(
                "connection received, id:",
                dataConnection.metadata.id
              );

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
              console.log(
                "connection received, id:",
                mediaConnection.metadata.id
              );
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
