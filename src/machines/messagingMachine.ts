import Peer, { DataConnection } from "peerjs";
import invariant from "tiny-invariant";
import { assign, createMachine, interpret } from "xstate";
import create from "zustand";

export type Message = {
  id: string;
  userName: string;
  body: string;
  from: string;
};

type UserConnectionData = {
  id: string;
  name: string;
  connection?: DataConnection;
  status: "idle" | "connecting" | "connected" | "error";
};

type initialCallResp = {
  host: Omit<UserConnectionData, "connection" | "status">;
  users: Omit<UserConnectionData, "connection" | "status">[];
};

export type MessagingEvent =
  | {
      type: "START";
      userId: string;
      userName: string;
      mainHostId: string;
      peer: Peer;
    }
  | {
      type: "CONNECTION_RECEIVED";
      userId: string;
      userName: string;
      connection: DataConnection;
    }
  | { type: "REQUEST_USER_LIST"; userId: string }
  | { type: "CONNECTION_CLOSED"; userId: string }
  | { type: "CONNECTION_ERROR"; userId: string }
  | {
      type: "CONNECTED_TO_USER";
      userId: string;
      connection: DataConnection;
    }
  | { type: "SEND_MESSAGE"; message: Message; to?: string }
  | { type: "MESSAGE_RECEIVED"; message: Message }
  | { type: "NOTIF_OK" };

export const defaultMessagingContext = {
  userId: "",
  userName: "",
  mainHostId: "",
  peer: undefined,
  userConnectionData: [],
  messages: [],
};

export const messagingMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QFs6wIZQJYDsoDoBjAexxzEIBdcoAVYgWXVwAljZKBiCUsfXAG7EA1n1SwM2PEVLkqNek1btKCQcULpqpANoAGALr6DiUAAd2WbTlMgAHogC0AZmcB2fHoCMrgKwBOACYvN0D-ADZwgBoQAE9EL3D8ZwAOfxTwlL0UsMDfABYvFIBfYpjxSRp+HAAlYmJkTgBhAHkAOTaAUSbaToARAH1aFoGAVQBlTprjWwtYKyxSWwcEQPw3Ny90rfy9PUDnX2yY+IQtteDfL3zfUL13f19A0vK0TCrcOobm9q6egEl2gMat1Ov8AGr9GZIEBzBZLGErZz5FL4cJ6XZZcIbFIpXwZE5OLx6fBPYl6CK+TJ7fFuF4gCrvaSfeqNBidcbjACCAHFOsDQRCoYZZpZrMtEIF8vg0m49E9HnlsQFCQhHD4PEF-PlnP5Qik3Lq8fTGVICCzvpM2oN2ZzeZ1oeYxYsbIjJWt-BjdflwvlAnpMr5fM5VY5Ar78Ndwnr-MjQq49HSygy3mbql9Gq0Ot1aIC2gMmgAZFqTPqO2HOhGgFZefBhLwFDK7VKZIK+VWpWsU7L7QpFZxePIm1MfWqszgggCKow5tDGkxqA0L-3GtHLcPFboQznCvkjif82obsbc2tVXi2+BuFN3wUCbmxbnyw4kTPNY++Wb+uaBUxqLWmEUYQ3F0JTVZxSTJUJw0ePFd3yVVAhSaVbmjEJgz9NxkJfSpmQgAAbMBOFXLkajXICnXmTdqyccI8jRR5dx8SICnbOIiSKfBDzcK5rj9IoFRwt9+AIoiSLInQvBMYDK1dGjwPCCD5UeJ8H0UnIDVDC9UW43j8n4vEwlKZMcGICA4FsU0qhIMgKGoPBFGYHA2A4UUqNArdHEUpJXGxQdgjSRIQ3Ys4SRyJC-QxA4YN8IS0wtZA3PhOT7CcXUZUKU9fRSC8G0HNjTjWdwcujB8bkCf1Hjij5RKS6jUrVIMkhyAMg1uEJ70CUN-VraNDylZTsj9aq8Dqjz5K85Dkh3TYKqKfwgtDQ4IKjdIouJJVjOKIA */
  createMachine(
    {
      context: defaultMessagingContext,
      tsTypes: {} as import("./messagingMachine.typegen").Typegen0,
      schema: {
        context: {} as {
          userId: string;
          userName: string;
          mainHostId: string;
          peer: Peer | undefined;
          userConnectionData: UserConnectionData[];
          messages: Message[];
        },
        events: {} as MessagingEvent,
        services: {} as {
          connectToHost: {
            data: {
              userConnectionData: UserConnectionData[];
            };
          };
        },
      },
      predictableActionArguments: true,
      id: "messaging",
      initial: "idle",
      states: {
        connectingToMainHost: {
          invoke: {
            src: "connectToHost",
            onDone: [
              {
                target: "inRoom",
                actions: "saveHostConnAndUserList",
              },
            ],
          },
        },
        inRoom: {
          invoke: [
            {
              src: "listenForNewConnection",
            },
            {
              src: "connectToUserList",
            },
          ],
          on: {
            CONNECTED_TO_USER: {
              actions: "updateConnection",
            },
            CONNECTION_RECEIVED: {
              actions: "saveConnection",
            },
            MESSAGE_RECEIVED: {
              actions: "saveMessage",
            },
            SEND_MESSAGE: {
              actions: ["sendMessage", "saveMessage"],
            },
            CONNECTION_CLOSED: {
              actions: "removeConnection",
            },
            REQUEST_USER_LIST: {
              actions: "sendUserList",
            },
            CONNECTION_ERROR: {
              actions: "updateConnectionStatusError",
            },
          },
        },
        idle: {
          on: {
            START: [
              {
                target: "connectingToMainHost",
                cond: "meNonHost",
                actions: "saveUserAndRoomInfo",
              },
              {
                target: "inRoom",
                cond: "meHost",
                actions: "saveUserAndRoomInfo",
              },
            ],
          },
        },
      },
    },
    {
      services: {
        connectToHost: (context, event) => {
          return new Promise((resolve, reject) => {
            invariant(context.peer);

            const conn = context.peer.connect(context.mainHostId, {
              metadata: {
                userId: context.userId,
                userName: context.userName,
              },
            });
            conn.once("open", () => {
              conn.send("requestUsers");
            });

            conn.once("data", (data) => {
              const meta = data as initialCallResp;

              const userData = meta.users.map(
                (u): UserConnectionData => ({ ...u, status: "idle" })
              );

              resolve({
                userConnectionData: [
                  { ...meta.host, connection: conn, status: "connected" },
                  ...userData,
                ],
              });
            });
          });
        },
        connectToUserList: (context, event) => (callback, onReceive) => {
          context.userConnectionData.forEach((userData) => {
            invariant(context.peer);

            const conn = (() => {
              if (userData.connection) return userData.connection;

              return context.peer.connect(userData.id, {
                metadata: {
                  userId: context.userId,
                  userName: context.userName,
                },
              });
            })();

            conn.on("data", (message) => {
              callback({
                type: "MESSAGE_RECEIVED",
                message: message as Message,
              });
            });

            conn.on("open", () => {
              callback({
                type: "CONNECTED_TO_USER",
                userId: userData.id,
                connection: conn,
              });
            });

            conn.once("error", () => {
              callback({
                type: "CONNECTION_ERROR",
                userId: userData.id,
              });
            });

            conn.once("close", () => {
              callback({
                type: "CONNECTION_CLOSED",
                userId: userData.id,
              });
            });
          });
        },
        listenForNewConnection: (context, event) => (callback, onReceive) => {
          const connListener = (conn: DataConnection) => {
            const { userId, userName } = conn.metadata;

            callback({
              type: "CONNECTION_RECEIVED",
              userId,
              userName,
              connection: conn,
            });

            conn.on("data", (message) => {
              if (message === "requestUsers") {
                callback({
                  type: "REQUEST_USER_LIST",
                  userId,
                });
                return;
              }

              callback({
                type: "MESSAGE_RECEIVED",
                message: message as Message,
              });
            });

            conn.once("error", () => {
              callback({
                type: "CONNECTION_ERROR",
                userId,
              });
            });

            conn.once("close", () => {
              callback({
                type: "CONNECTION_CLOSED",
                userId,
              });
            });
          };

          invariant(context.peer);
          context.peer.on("connection", connListener);

          return () => {
            context.peer?.off("connection", connListener);
            context.userConnectionData.forEach((u) => {
              u.connection?.removeAllListeners();
            });
          };
        },
      },
      actions: {
        saveUserAndRoomInfo: assign({
          userId: (context, event) => event.userId,
          userName: (context, event) => event.userName,
          mainHostId: (context, event) => event.mainHostId,
          peer: (context, event) => event.peer,
        }),
        saveHostConnAndUserList: assign({
          userConnectionData: (context, event) => event.data.userConnectionData,
        }),
        updateConnection: assign({
          userConnectionData: (context, event) => {
            return context.userConnectionData.map((d) =>
              d.id === event.userId ? { ...d, connection: event.connection } : d
            );
          },
        }),
        saveConnection: assign({
          userConnectionData: (context, event) => [
            ...context.userConnectionData,
            {
              id: event.userId,
              name: event.userName,
              connection: event.connection,
              status: "connected",
            } as UserConnectionData,
          ],
        }),
        saveMessage: assign({
          messages: (context, event) => [...context.messages, event.message],
        }),
        sendMessage: (context, event) => {
          if (event.to) {
            const target = context.userConnectionData.find(
              (v) => v.id === event.to
            );
            target?.connection?.send(event.message);
          } else {
            context.userConnectionData.forEach((v) => {
              v.connection?.send(event.message);
            });
          }
        },
        removeConnection: assign({
          userConnectionData: (context, event) =>
            context.userConnectionData.map((u) =>
              u.id === event.userId
                ? ({
                    ...u,
                    connection: undefined,
                    status: "idle",
                  } as UserConnectionData)
                : u
            ),
        }),
        updateConnectionStatusError: assign({
          userConnectionData: (context, event) =>
            context.userConnectionData.map((u) =>
              u.id === event.userId
                ? ({
                    ...u,
                    status: "error",
                  } as UserConnectionData)
                : u
            ),
        }),
        sendUserList: (context, event) => {
          const initialResp: initialCallResp = {
            host: {
              id: context.userId,
              name: context.userName,
            },
            users: context.userConnectionData
              .filter((v) => v.id !== event.userId)
              .map((v) => ({ ...v, connection: undefined })),
          };

          context.userConnectionData
            .find((v) => v.id === event.userId)
            ?.connection?.send(initialResp);
        },
      },
      guards: {
        meHost: (context, event) => event.userId === event.mainHostId,
        meNonHost: (context, event) => event.userId !== event.mainHostId,
      },
    }
  );

export const msgService = interpret(messagingMachine, {
  devTools: true,
  id: "MESSAGING - " + Date.now(),
});

type MsgServiceState = ReturnType<typeof msgService["getSnapshot"]>;

export const useMsgService = create<MsgServiceState>((set) => {
  msgService
    .onTransition((state) => {
      const initialStateChanged =
        state.changed === undefined && Object.keys(state.children).length;

      if (state.changed || initialStateChanged) {
        set(state);
      }
    })
    .start();

  return msgService.getSnapshot();
});
