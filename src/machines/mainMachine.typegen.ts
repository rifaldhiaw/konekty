// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
    "xstate.stop": { type: "xstate.stop" };
  };
  invokeSrcNameMap: {
    startPeerListener:
      | "done.invoke.main.waitingForUserName:invocation[0]"
      | "done.invoke.main.inRoom:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    clearError: "CREATE_ROOM" | "JOIN_ROOM" | "xstate.stop";
    initPeer: "xstate.init";
    saveName: "CREATE_ROOM" | "JOIN_ROOM";
    saveRoomId: "CREATE_ROOM";
    saveRoomIdIfExist: "xstate.init";
    setError: "SET_ERROR";
    startMediaCall: "CREATE_ROOM" | "USER_LIST_RECEIVED";
    startMediaService: "xstate.init";
    startMessagingService: "CREATE_ROOM" | "JOIN_ROOM";
    toggleChat: "TOGGLE_CHAT";
    updateUrl: "CREATE_ROOM";
    updateUserData: "UPDATE_USER_DATA" | "USER_LIST_RECEIVED";
  };
  eventsCausingServices: {
    startPeerListener:
      | "CREATE_ROOM"
      | "LOCAL_MEDIA_READY"
      | "USER_LIST_RECEIVED";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | "inRoom"
    | "initializing"
    | "waitingForUserName"
    | "waitingUserList";
  tags: never;
}
