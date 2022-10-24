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
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBLAdgOi+gLuqgDboBeWUAxBAPaZi6YButA1o2lkwUaRZigIsrAMapC9ANoAGALqy5iUAAdasXvWUgAHogC0AJgBsADgCM2UwGYArLesAWWzIDsATlvmANCACeBuaGrtgepqbGhp7W5u7mDgC+Cb5cOHiEJOSUVGAATrm0udgqxBIAZoXI2Kk8GfyUwiy04pKYioraahqt2noIRqaGhlaOMvHu7mO2jsa+AQiGMtjWnsau1uHuxtPupq5JKRg4sAAWtADulACi+YUA4mD4ADLNJACykERvtBAkVABKVwAKv8AJoAfTuwPBbyuABEAJIAQQ6SBAXU0mF6Biinmw01sQxkjlcblcPn8iEWy1W60220cE0cBxANXOGEIggAYoUAKqwPIAOVQyDAVCBAHk7ncnldwUjeYiJajVOpMdj+oYZo5sGZzEFTDJiY47HMDNYxstBjFImYvDJ3Cy2RzKDzcvyhSKxZLpbLwQA1BFwq7K+SdNU9NF9Iwmyz2cKM0bmB1m-pJ7BBMZrYmuRajYxOo7Ydm8bl8gW5YWiqgAYUBSKBcv+EolbxV6Ij6C0UZxOdCg0WxmMbgsnlT+i22Hczjctm25Ictn2yVZRZLnKgbo9la9VAAUhKEYLwc3W+2MZHQNHDNZc9gbx4ZNZh9MbLNKQhyffDLZTISYtqD6Ftwoj0AwogbkCtD-LQtDIDQ9CMCI7CcEWoGYOBkHQbByCNGIEhdm08jnp23ZXoE1rYI4jh5rshh7Osjipl+Qy-tsMh2oY8TWMBaSYDBcFULCADKwlIlCJ5XDWVwIv68Ikd0hEavo5jWE4U43hYrgOCa7jjsEU4WLijJDtMbjMiuNRYAJ8HCVcgpwjCVyieJVwKeqPb9Kp8SGVqMiEqY7iuH+qYmMYVHuGpxgbMSLhcbxTA2VQSI1gA0k5LkSYC0myfJYZoheSmeSpdhLGpKweGsiw-npH7GO4VERCYMT2NRdiGAl1k4UJ8LIuCNYSoKgpSUCCKDZJOVyXC7mXrogTOLYVFDtFQS5rEz76REurOI4FjmMFUQ3p1-HdcJIJXEibwTTJU0zUV5FedYJhTuYw7+U+umpq9lgWHYZjhOYhqDMdSVwg2SL9YNw01qN43ZTdeVKAVpFYsV5gzveXjBdpQzre+8z6Bsi3bEugyjBa1oFpZRZdYJiLCQNQ0jYj4aKWRc2ajIhr3rtURmDR2n6f5Vj+e4N5bP5MWmEkK6YD8cDaFZmC8JkAhQKzHkPUYYvhfR5I-jR+r-uO6M-cmv4WiTNgWYc3CnBc1y3LkDzPK8xAfBAXw-CQGuzdeEuhPRhI3ujazWKm06hKbL4bI4yY-gl66uuWnqir790czGlqRG4gO3nYgOuCbDpWEOTjkjYUSuDRCXoZhlBQTZ6fs9er2mNgT4Mmp6zRUFzFLOScfRQDWzBdL1PcLTyDN6jWv7Xs+KkgOjIRPYJszFR1GqcOQ7rPqHUT7PHZs0f0YWia+LOESJJkhSBOMksmb7Q6amvaSVNJEAA */
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
