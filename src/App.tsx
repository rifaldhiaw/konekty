import { useSelector } from "@xstate/react";
import EntryView from "./components/EntryView";
import { useMainService } from "./components/MachineProvider";

function App() {
  const service = useMainService();
  const initializing = useSelector(service, (s) => s.matches("initializing"));
  const waitingForUserName = useSelector(service, (s) =>
    s.matches("waitingForUserName")
  );

  const renderContent = () => {
    if (initializing || waitingForUserName) {
      return <EntryView />;
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-base-100">
      {renderContent()}
    </div>
  );
}

export default App;
