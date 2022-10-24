import { useSelector } from "@xstate/react";
import EntryView from "./components/EntryView";
import { useMainService } from "./components/MachineProvider";
import MainView from "./components/MainView";

function App() {
  const service = useMainService();
  const initializing = useSelector(service, (s) => s.matches("initializing"));
  const waitingForUserName = useSelector(service, (s) =>
    s.matches("waitingForUserName")
  );

  if (initializing || waitingForUserName) {
    return (
      <div className="flex h-screen justify-center items-center">
        <EntryView />;
      </div>
    );
  }

  return (
    <div className="flex w-screen h-screen" data-theme={"dark"}>
      <MainView />
    </div>
  );
}

export default App;
