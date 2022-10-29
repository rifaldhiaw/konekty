// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.messaging.connectingToMainHost:invocation[0]": {
      type: "done.invoke.messaging.connectingToMainHost:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    connectToHost: "done.invoke.messaging.connectingToMainHost:invocation[0]";
    connectToUserList: "done.invoke.messaging.inRoom:invocation[1]";
    listenForNewConnection: "done.invoke.messaging.inRoom:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    removeConnection: "CONNECTION_CLOSED";
    saveConnection: "CONNECTION_RECEIVED";
    saveHostConnAndUserList: "done.invoke.messaging.connectingToMainHost:invocation[0]";
    saveMessage: "MESSAGE_RECEIVED" | "SEND_MESSAGE";
    saveUserAndRoomInfo: "START";
    sendMessage: "SEND_MESSAGE";
    sendUserList: "REQUEST_USER_LIST";
    updateConnection: "CONNECTED_TO_USER";
    updateConnectionStatusError: "CONNECTION_ERROR";
  };
  eventsCausingServices: {
    connectToHost: "START";
    connectToUserList:
      | "START"
      | "done.invoke.messaging.connectingToMainHost:invocation[0]";
    listenForNewConnection:
      | "START"
      | "done.invoke.messaging.connectingToMainHost:invocation[0]";
  };
  eventsCausingGuards: {
    meHost: "START";
    meNonHost: "START";
  };
  eventsCausingDelays: {};
  matchesStates: "connectingToMainHost" | "idle" | "inRoom";
  tags: never;
}
