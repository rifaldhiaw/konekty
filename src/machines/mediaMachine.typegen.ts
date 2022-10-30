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
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    answerTheCall: "CALL_RECEIVED";
    removeConnection: "CONNECTION_CLOSED";
    replaceVideoTrack: "TOGGLE_VIDEO";
    saveConnection: "CALL_RECEIVED";
    saveLocalMediaStream: "done.invoke.media.gettingLocalMedia:invocation[0]";
    saveStream: "STREAM_RECEIVED";
    saveUserDataAndPeer: "START_CALL";
    setConnectionToError: "CONNECTION_ERROR";
    tellLocalMediaReady: "done.invoke.media.gettingLocalMedia:invocation[0]";
    toggleAudio: "TOGGLE_AUDIO";
    toggleVideo: "TOGGLE_VIDEO";
  };
  eventsCausingServices: {
    callAllUserInRoom: "START_CALL";
    getLocalMedia: "RETRY_GET_MEDIA" | "START" | "TOGGLE_VIDEO";
    startNewCallListener: "START_CALL";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | "gettingLocalMedia"
    | "idle"
    | "inRoom"
    | "localMediaReady"
    | "showingErrorLocalMedia";
  tags: never;
}
