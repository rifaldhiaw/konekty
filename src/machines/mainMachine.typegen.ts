// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    initPeer: "LOCAL_MEDIA_READY";
    saveName: "CREATE_ROOM" | "JOIN_ROOM";
    saveRoomId: "CREATE_ROOM";
    saveRoomIdIfExist: "xstate.init";
    startMediaCall: "CREATE_ROOM" | "USER_LIST_RECEIVED";
    startMediaService: "xstate.init";
    startMessagingService: "CREATE_ROOM" | "JOIN_ROOM";
    toggleChat: "TOGGLE_CHAT";
    updateUrl: "CREATE_ROOM";
    updateUserData: "UPDATE_USER_DATA" | "USER_LIST_RECEIVED";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | "inRoom"
    | "initializing"
    | "waitingForUserName"
    | "waitingUserList";
  tags: never;
}
