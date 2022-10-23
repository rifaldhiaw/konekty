// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.main.connectingToRoom:invocation[0]": {
      type: "done.invoke.main.connectingToRoom:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.main.initializing:invocation[0]": {
      type: "done.invoke.main.initializing:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    getLocalMedia: "done.invoke.main.initializing:invocation[0]";
    startMediaAndDataConnector: "done.invoke.main.connectingToRoom:invocation[0]";
    startMediaAndDataListener: "done.invoke.main.inRoom:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    initPeer: "SUBMIT_NAME";
    saveConnectionsFromConnector: "done.invoke.main.connectingToRoom:invocation[0]";
    saveDataConnection: "DATA_CONNECTION_RECEIVED";
    saveLocalMediaStream: "done.invoke.main.initializing:invocation[0]";
    saveMediaConnection: "MEDIA_CONNECTION_RECEIVED";
    savePendingMessage: "MESSAGE_RECEIVED";
    saveRoomIdIfExist: "RETRY_GET_MEDIA" | "xstate.init";
    saveStream: "STREAM_RECEIVED";
    sendMessage: "SEND_MESSAGE";
    updatePendingMessage: "ACK_MESSAGE_RECEIVED";
  };
  eventsCausingServices: {
    getLocalMedia: "RETRY_GET_MEDIA" | "xstate.init";
    startMediaAndDataConnector: "SUBMIT_NAME";
    startMediaAndDataListener:
      | "SUBMIT_NAME"
      | "done.invoke.main.connectingToRoom:invocation[0]";
  };
  eventsCausingGuards: {
    hasRoomId: "SUBMIT_NAME";
    noRoomId: "SUBMIT_NAME";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "connectingToRoom"
    | "inRoom"
    | "initializing"
    | "showingErrorGetLocalMediaModal"
    | "waitingForUserName";
  tags: never;
}
