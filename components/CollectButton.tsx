import * as React from "react";
import Openfort from "@openfort/openfort-js";

export function CollectButton() {
  const [collectLoading, setCollectLoading] = React.useState(false);
  const openfort = new Openfort();

  const handleCollectButtonClick = async () => {
    console.log("openfort", openfort.getAccessToken(), openfort.isLoaded());
    if (!openfort) {
        return;
    }
    try {
      // await waitUntilAuthenticated(openfort);
      setCollectLoading(true);

      console.log(openfort.getAccessToken())

      const collectResponse = await fetch(`/api/examples/protected-collect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const collectResponseJSON = await collectResponse.json();

      if (collectResponseJSON.data?.nextAction) {
        const response = await openfort.sendSignatureTransactionIntentRequest(
          collectResponseJSON.data.id,
          collectResponseJSON.data.nextAction.payload.userOpHash
        );
        console.log("response", response);
      }

      console.log("success:", collectResponseJSON.data);
      alert("Action performed successfully");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCollectLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        disabled={collectLoading}
        onClick={handleCollectButtonClick}
      >
        {collectLoading ? "Collecting..." : "Collect item"}
      </button>
    </div>
  );
}
