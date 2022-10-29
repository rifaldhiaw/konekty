import EntryView from "./components/EntryView";
import MainView from "./components/MainView";
import { useMainService } from "./machines/mainMachine";

function App() {
  const inRoom = useMainService((s) => s.matches("inRoom"));

  if (inRoom) {
    return (
      <div className="flex w-screen h-screen" data-theme={"dark"}>
        <MainView />
      </div>
    );
  }

  return (
    <div className="flex h-screen justify-center items-center">
      <EntryView />
    </div>
  );
}

export default App;
