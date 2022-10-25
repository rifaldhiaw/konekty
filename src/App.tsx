import { useSelector } from "@xstate/react";
import EntryView from "./components/EntryView";
import { useMainService } from "./components/MachineProvider";
import MainView from "./components/MainView";

function App() {
  const service = useMainService();
  const inRoom = useSelector(service, (s) => s.matches("inRoom"));

  if (inRoom) {
    return (
      <div className="flex w-screen h-screen" data-theme={"dark"}>
        <MainView />
      </div>
    );
  }

  return (
    <div className="flex h-screen justify-center items-center">
      <EntryView />;
    </div>
  );
}

export default App;
