// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.media.gettingLocalMedia:invocation[0]": {
      type: "done.invoke.media.gettingLocalMedia:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    callAllUserInRoom: "done.invoke.media.inRoom:invocation[1]";
    getLocalMedia: "done.invoke.media.gettingLocalMedia:invocation[0]";
    startNewCallListener: "done.invoke.media.inRoom:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    answerTheCall: "CALL_RECEIVED";
    removeConnection: "CONNECTION_CLOSED";
    saveConnection: "CALL_RECEIVED";
    saveLocalMediaStream: "done.invoke.media.gettingLocalMedia:invocation[0]";
    saveStream: "STREAM_RECEIVED";
    saveUserDataAndPeer: "START_CALL";
    setConnectionToError: "CONNECTION_ERROR";
    stopOrReplaceVideoTrack: "TOGGLE_VIDEO";
    tellLocalMediaReady: "done.invoke.media.gettingLocalMedia:invocation[0]";
    toggleAudio: "TOGGLE_AUDIO";
    toggleVideo: "TOGGLE_VIDEO";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    callAllUserInRoom: "START_CALL";
    getLocalMedia: "RETRY_GET_MEDIA" | "START" | "TOGGLE_VIDEO";
    startNewCallListener: "START_CALL";
  };
  matchesStates:
    | "gettingLocalMedia"
    | "idle"
    | "inRoom"
    | "localMediaReady"
    | "showingErrorLocalMedia";
  tags: never;
}
