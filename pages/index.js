import {
  useClient,
  withSplitTreatments,
  SplitFactory
} from "@splitsoftware/splitio-react";

const Hooks = () => {
  const client = useClient();
  const { isReady, isTimedout } = client;
  const [timeoutCallBackCalled, setTimedout] = React.useState();

  React.useEffect(() => {
    console.log("split.io: adding client listener");
    client.once(client.Event.SDK_READY_TIMED_OUT, function() {
      setTimedout(true);
    });
  }, [client]);

  return (
    <>
      <h2>Hooks</h2>
      <pre>{JSON.stringify({ isReady, isTimedout })}</pre>
      <h2>Client</h2>
      <pre>{JSON.stringify({ "client.isTimedout": client.isTimedout })}</pre>
      <h2>Client.once</h2>
      <pre>{JSON.stringify({ timeoutCallBackCalled })}</pre>
    </>
  );
};

const Hoc = withSplitTreatments(["abc"])(({ isReady, isTimedout }) => {
  return (
    <>
      <h2>Hoc</h2>
      <pre>{JSON.stringify({ isReady, isTimedout })}</pre>
    </>
  );
});

export default function App() {
  const [apiKey, setApiKey] = React.useState("");
  const [ready, setReady] = React.useState(false);
  return (
    <>
      <input
        placeholder="paste API key here"
        onChange={e => setApiKey(e.target.value)}
        value={apiKey}
      />
      <button type="submit" onClick={() => setReady(true)}>
        Submit
      </button>
      {ready ? (
        <SplitFactory
          config={{
            core: {
              authorizationKey: apiKey,
              key: "somekey"
            },
            startup: {
              readyTimeout: 5 // 5 seconds
            }
            // updateOnSdkTimedout: true
          }}
          //updateOnSdkTimedout={true}
        >
          <Hooks />
          <Hoc />
        </SplitFactory>
      ) : (
        <p>Split Key not loaded</p>
      )}
    </>
  );
}
