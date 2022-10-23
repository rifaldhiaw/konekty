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
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBLAdgOi+gLuqgDboBeWUAxBAPaZi6YButA1o2lkwUaRZigIsrAMapC9ANoAGALqy5iUAAdasXvWUgAHogC0ANgAsAJmwBWABzHDAZgsBGGadNW3AGhABPAwE4ZbDNbU0NHRysLFytDAF9Yry4cPEISckoqMAAnLNos7BViCQAzPORsJJ5U-kphFlpxSUxFRW01DSbtPQR9AHZew2wZQxNw4ysrGWNHPy9fBGM7bDs7Kzs-Yz9DVwsB43jEjBxYAAtaAHdKAFEcvIBxMHwAGQaSAFlIIjfaCBIqACUrgAVf4ATQA+ndgeC3lcACIASQAgq0kCB2ppMF1-BYLNhwlNbHZejYZhY5ohFstVutNttTLtDBYDiBKucMIRBAAxPIAVVg2QAcqhkGAqABlXkAITeCKB4MFSNhqNU6kx2J6jl6gSchl6flMMii4wNpgpPQCQVMtmGk1WuuZCVZR2w7N43L5AqywtFEulsvliuVjiUaIxnTR3X0pkceLc1pmDIiFg25sc62WhhkdmMKYGKwsdhZlVE9AYok5UCBtH+tFoyBo9EYInYnBdpcw5cr1dr9bqYgk6Gk8hV6LVEdA3XT5nCqwZ0XGJnJPkQbmWu2tUSi9osTOLLqwvYbdAYTFYHAqB8wR-7ryaLXkbXHQ6xkYMTOwAX1xhkVi1oRiXpzWjLZsH6ZN7F6Nw1n2J1KkPOsG2yXJ8kKEoykvbgEL7FtGhfB9Q1VDoXw1IxjGwbYRgCP8oMMQDgJzci-2olNfz8FNcX3LDr0QqhYXFcUkShcFAQAYSuBEADV4VHcMSLfBAU0GOxTBWZwjSZGRszTciXBMAIVj8CJXD8PwuOSHj6wlK5BThGErgEoSrlk58tAUsI4xMKDVJkAld3NOxf0sXzYzsExs3tcymCPKgkVEgBpezHOEsSJOkuEXOItzJ0QaxAiMuxHGMfUIhiXM03CIINiNUxTMcUx9TMuCrxi2FESRcFRIAeUFQUrlEoEER6kT+rSmTHzDVzXxyhYrD8SwbXTFxjDMAJjGAiJemwNwTCTXFbCsXpHUObiYvFEEriVEbxKk8bCLHLLpt0RAs3ItT6oZXcom0lcEENJZ3HTaxei1Excyak6LJiuEkSBDrut6-rBuG1LboyiaiPVBTNnIgZf13foVtqqZgJ27atlo1YXGsGIouwhtEXFBG+oGu6n0e0iivmrTwkMA0nEiVNfv0Rx7DAvw-xzerit83p4idTAfjgbR4MwXg0gEKB2axmb9AmLbs3pLNY3GRYNqmIIwpzbZArm4rHCi04LmuW4sgeZ5XmID4IC+H4SG1idnotGMgn6ekAgCKYrDTFShgmdZemJQKJb8Itmu4N1Kx5LJ+SFEUwAD+TdfWcwGuK4rekWMwImAkZPyt3Mc1UkkGSijsu0oHtEML7Kg6B6kGSO1OLGKwqY6sbAbBiBrXHsBw08h6Lu8mjmFKKpY9XsBlh9HxxgMtVP7GmdMbFniHnSwHunqjdSlgJFbINJdjgMWAGZnx6j2PYx14iAA */
  createMachine(
    {
      context: {
        roomId: "",
        peer: undefined,
        localMediaStream: undefined,
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
          localMediaStream: MediaStream | undefined;
          messages: Message[];
          streams: Record<string, MediaStream>;
          dataConnections: Record<string, DataConnection>;
          mediaConnections: Record<string, MediaConnection>;
        },
        events: {} as
          | { type: "RETRY_GET_MEDIA" }
          | { type: "SUBMIT_NAME" }
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
        getLocalMedia: (context, event) => {
          return navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });
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
