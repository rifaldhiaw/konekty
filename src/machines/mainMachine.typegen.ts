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
    "error.platform.main.connectingToRoom:invocation[0]": {
      type: "error.platform.main.connectingToRoom:invocation[0]";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    getLocalMedia: "done.invoke.main.initializing:invocation[0]";
    startMediaConnector: "done.invoke.main.connectingToRoom:invocation[0]";
    startMediaListener: "done.invoke.main.inRoom:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    initPeer:
      | "DISCONNECTED"
      | "done.invoke.main.initializing:invocation[0]"
      | "error.platform.main.connectingToRoom:invocation[0]";
    removeError: "JOIN_ROOM";
    saveError: "error.platform.main.connectingToRoom:invocation[0]";
    saveLocalMediaStream: "done.invoke.main.initializing:invocation[0]";
    saveMediaConnection: "MEDIA_CONNECTION_RECEIVED";
    saveName: "CREATE_ROOM" | "JOIN_ROOM";
    saveNewStream: "done.invoke.main.connectingToRoom:invocation[0]";
    saveRoomId: "CREATE_ROOM";
    saveRoomIdIfExist: "RETRY_GET_MEDIA" | "TOGGLE_VIDEO" | "xstate.init";
    saveStream: "STREAM_RECEIVED";
    startMessagingService:
      | "CREATE_ROOM"
      | "done.invoke.main.connectingToRoom:invocation[0]";
    toggleAudio: "TOGGLE_AUDIO";
    toggleChat: "TOGGLE_CHAT";
    toggleVideo: "TOGGLE_VIDEO";
    updateUrl: "CREATE_ROOM";
  };
  eventsCausingServices: {
    getLocalMedia: "RETRY_GET_MEDIA" | "TOGGLE_VIDEO" | "xstate.init";
    startMediaConnector: "JOIN_ROOM";
    startMediaListener:
      | "CREATE_ROOM"
      | "done.invoke.main.connectingToRoom:invocation[0]";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | "connectingToRoom"
    | "inRoom"
    | "initializing"
    | "showingErrorGetLocalMediaModal"
    | "waitingForUserName";
  tags: never;
}
