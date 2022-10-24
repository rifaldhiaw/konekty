import { useSelector } from "@xstate/react";
import { nanoid } from "nanoid";
import { useState } from "react";
import DoubleCheck from "../icons/DoubleCheck";
import SingleCheck from "../icons/SingleCheck";
import { Message } from "../machines/mainMachine";
import { useMainService } from "./MachineProvider";

const ChatBox = () => {
  const service = useMainService();
  const messages = useSelector(service, (s) => s.context.messages);
  const localId = useSelector(service, (s) => s.context.userId);

  return (
    <div className="card border border-base-200 bg-base-100 flex-1 h-full shadow-lg">
      <h2 className="text-center text-xl font-semibold p-5 border-b border-base-300">
        Chat Box
      </h2>

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
                  <div className="mx-2 mb-1 font-semibold">{m.from}</div>
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
        <span className={props.isMine ? "ml-2" : "mr-2"}>
          {props.message.status === "pending" ? (
            <SingleCheck />
          ) : (
            <DoubleCheck />
          )}
        </span>
      </div>
    </div>
  );
};

function ChatInput() {
  const [message, setMessage] = useState("");
  const service = useMainService();
  const localId = useSelector(service, (s) => s.context.userId);

  // TODO: should handle multiple user
  const dataConnections = useSelector(
    service,
    (s) => s.context.dataConnections
  );
  const remoteTarget = Object.keys(dataConnections)?.[0];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setMessage("");
        service.send({
          type: "SEND_MESSAGE",
          message: {
            id: nanoid(),
            body: message,
            from: localId,
            status: "pending",
          },
          to: remoteTarget,
        });
      }}
    >
      <div className="flex">
        <input
          className="input input-bordered flex-1 bg-base-200"
          type="text"
          name="message"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="btn ml-5">
          Send
        </button>
      </div>
    </form>
  );
}

export default ChatBox;
