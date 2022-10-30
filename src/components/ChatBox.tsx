import { nanoid } from "nanoid";
import { useState } from "react";
import { useMainService } from "../machines/mainMachine";
import {
  Message,
  msgService,
  useMsgService,
} from "../machines/messagingMachine";

const ChatBox = () => {
  const messages = useMsgService((s) => s.context.messages);
  const localId = useMainService((s) => s.context.userId);

  return (
    <div className="card border border-base-200 bg-base-100 flex-1 h-full shadow-lg">
      <div className="flex flex-1 flex-col h-full overflow-y-scroll py-5 p-5 bg-base-200">
        <div className="flex flex-1 flex-col">
          {messages.map((m, i) => {
            const isMine = m.from === localId;

            const prevIndex = i - 1;
            const isPrevSameOwner =
              prevIndex >= 0 && messages[prevIndex].from === m.from;

            return (
              <div
                key={m.id}
                className={
                  "my-1 max-w-[80%] " +
                  (isMine ? "self-end text-right" : "self-start text-left")
                }
              >
                {!isPrevSameOwner && (
                  <div className="mx-2 mb-1 font-semibold">{m.userName}</div>
                )}
                <MessageBubble message={m} isMine={isMine} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-5 border-t border-base-300 w-full">
        <ChatInput />
      </div>
    </div>
  );
};

const MessageBubble = (props: { message: Message; isMine: boolean }) => {
  return (
    <div
      className={
        "rounded-lg shadow-md px-2 py-1 " +
        (props.isMine ? "bg-primary text-primary-content" : "bg-base-100")
      }
    >
      <div
        className={
          "flex items-center " +
          (props.isMine ? "flex-row" : "flex-row-reverse")
        }
      >
        {props.message.body}
      </div>
    </div>
  );
};

function ChatInput() {
  const [message, setMessage] = useState("");

  const localId = useMainService((s) => s.context.userId);
  const userName = useMainService((s) => s.context.userName);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setMessage("");
        msgService.send({
          type: "SEND_MESSAGE",
          message: {
            id: nanoid(),
            userName,
            body: message,
            from: localId,
          },
        });
      }}
    >
      <div className="flex">
        <input
          autoFocus={true}
          className="input input-bordered flex-1 bg-base-200 min-w-0"
          type="text"
          name="message"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="btn btn-secondary ml-5">
          Send
        </button>
      </div>
    </form>
  );
}

export default ChatBox;
