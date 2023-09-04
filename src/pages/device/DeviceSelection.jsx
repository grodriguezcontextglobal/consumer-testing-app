import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import MultipleSelection from "./MultipleSelection";
import SingleSelection from "./SinglSelection";

const DeviceSelection = () => {
  const { event } = useSelector((state) => state.event);
  return (
    <>
      <Suspense fallback={"loading..."}>
        {event.deviceSetup?.length > 1 ? <MultipleSelection /> : <SingleSelection />}
      </Suspense>
    </>
  );
};

export default DeviceSelection;
