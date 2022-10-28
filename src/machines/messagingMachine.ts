import Peer, { DataConnection } from "peerjs";
import invariant from "tiny-invariant";
import { assign, createMachine, sendParent } from "xstate";
import { Message } from "./mainMachine";

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
  /** @xstate-layout N4IgpgJg5mDOIC5QFs6wIZQJYDsoDoBjAexxzEIBdcoAVYgWXVwAljZKBiCUsfXAG7EA1n1SwM2PEVLkqNek1btKCQcULpqpANoAGALr6DiUAAd2WbTlMgAHogC0AZmcB2fHoCMrgKwBOACYvN0D-ADZwgBoQAE9EL3D8ZwAOfxTwlL0UsMDfABYvFIBfYpjxSRoZMgpqPEVmHDYOTjAAJzbiNvwzABstADMu5HwKzCqSGvl6xkbm1XVNa2NjWwtYKyxSWwcER180-DD-PxSA7x8Y+IQff3wvX0DvfOc9E-y9PV9S8rRx6VwACViMRkJwAMIAeQActCAKLg2hwgAiAH1aJDUQBVADKcMBqyQIHWm22RN2gXwbjcXnStI+ekCzl82SuCSCRweXnyvlCenc-kePxAYykBCBILBUNhCNoAEkYajAQi4XKAGoownmSzWHaIZz5FL4cJ6D5ZcLUlJnDJsvZePT4R72t7hXyZT4HNzC0VVCWgzgMOE4nEAQQA4nClSr1ZrDGsdVsbOTEIF8vg0m4vmFHm63AFbY4fB4gv4Xv5Qik3M50t8yiK-mL+Dhgf68dC0YHg+G4VriQmyaAKZT-Kbq-lwvknplfL5nAXAhP7uPy+9Qq49F66z6Ac3JRCYfDEQroajwQAZSF45G9km65M3I7+B6Gif8jJpPK21JeTwjrKprwimcLw8m9BtfV3f1lQARSxINaGxPFAVRM85RxWgb37JNB31V17g3fxSweE43FLW1ALuHkXSdQI3AtNx8jAiR-nFSCpQPWVj1RfFAUhAk4yJW9Ez1PZnEdJ1QgXQUzldfJbUCFI015cInzzA1aMUpjKgBCBejAThMI2O8cL2E0PFNcIQgeBc-ECAtMnTZxIkI0imWyIItJY-hdP0nQvBMQSsJElxQnTbNClNbkLS8eyjRSJyaW8RlXkAkphRwYgIDgWxtwISY5DqOhZmUDh4yM4T70ccInOSBKQOCNJEjnOIEgdHIFMnU0mSk2tfmYxs-WQMrSWw+wnGrdNClIicUkArlPxahBKXcWaVLonlAieQVPIGnzhuMsa9jdJJznCBrx1mh4Cy5R1q3qmkgk+LwdpofaKpMqrFNq6LNqKJ9qoLZkxKi8tuvtaTwlKUogA */
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
            onError: [
              {
                actions: "sendParentConnectionError",
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
          always: [
            {
              target: "connectingToMainHost",
              cond: "meNonHost",
            },
            {
              target: "inRoom",
              cond: "meHost",
            },
          ],
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
            context.userConnectionData.forEach((u) =>
              u.connection?.removeAllListeners()
            );
          };
        },
      },
      actions: {
        saveHostConnAndUserList: assign({
          userConnectionData: (context, event) => event.data.userConnectionData,
        }),
        sendParentConnectionError: sendParent("CONNECT_TO_HOST_FAILED"),
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
        saveMessage: sendParent((context, event) => ({
          type: "MESSAGE_RECEIVED",
          message: event.message,
        })),
        sendMessage: (context, event) => {
          if (event.to) {
            const target = context.userConnectionData.find(
              (v) => v.id === event.to
            );
            target?.connection?.send(event.message);
          } else {
            context.userConnectionData.forEach((v) => {
              console.log("send message to", v.name);
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
              .map((v) => {
                delete v.connection;
                return v;
              }),
          };

          context.userConnectionData
            .find((v) => v.id === event.userId)
            ?.connection?.send(initialResp);
        },
      },
      guards: {
        meHost: (context, event) => context.userId === context.mainHostId,
        meNonHost: (context, event) => context.userId !== context.mainHostId,
      },
    }
  );
