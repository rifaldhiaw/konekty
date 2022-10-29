import { FormEventHandler, useState } from "react";
import { mainService, useMainService } from "../machines/mainMachine";
import EntryVideo from "./EntryVideo";

const EntryView = () => {
  const [name, setName] = useState("");

  const roomId = useMainService((s) => s.context.roomId);
  const connectingToRoom = useMainService((s) => s.matches("connectingToRoom"));
  const error = useMainService((s) => s.context.error);

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!name) return;

    if (roomId) {
      mainService.send({
        type: "JOIN_ROOM",
        name,
      });
    } else {
      mainService.send({
        type: "CREATE_ROOM",
        name,
      });
    }
  };

  const handleForceCreateNew: FormEventHandler = (e) => {
    e.preventDefault();
    if (!name) return;

    mainService.send({
      type: "CREATE_ROOM",
      name,
    });
  };

  return (
    <div className="flex container px-8">
      <div className="flex w-7/12 relative">
        <EntryVideo />
      </div>
      <div className="w-5/12 flex justify-center items-center">
        <form
          className="flex flex-col justify-center items-center"
          onSubmit={onSubmit}
        >
          <h1 className="text-2xl font-semibold text-center">Ready To Join?</h1>
          <div className="form-control w-full max-w-xs mt-10 items-center">
            <label className="label text-center">
              <span className="label-text">What is your name?</span>
            </label>
            <input
              autoFocus
              type="text"
              placeholder="My Cool Name"
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full max-w-xs bg-base-200 text-center"
            />
          </div>
          <div className={"flex mt-5" + (roomId ? " w-[300px]" : "")}>
            <button
              type="submit"
              className={
                "btn btn-primary flex-1 mx-1" +
                (connectingToRoom ? " loading" : "")
              }
            >
              {roomId ? "Join" : "Create Room"}
            </button>

            {roomId && (
              <button
                className="btn btn-primary btn-ghost flex-1 mx-1 shadow"
                onClick={handleForceCreateNew}
              >
                Create New
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-100 card py-3 px-4 mt-8 max-w-xs text-center">
              {error.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EntryView;
