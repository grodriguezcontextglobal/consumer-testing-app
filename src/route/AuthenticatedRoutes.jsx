import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import NavigationBottom from "../components/navigation/NavigationBottom";
import IndicatorProgressBottom from "../components/indicatorBottom/IndicatorProgressBottom";
import UpperBanner from "../components/banner/UpperBanner";
import AuthenticationLogin from "../pages/authentication/AuthenticationLogin";
const AuthenticatedRoutes = () => {
  const ConsumerInitialForm = lazy(() =>
    import("../pages/Consumer/ConsumerInitialForm")
  );
  const DeviceSelection = lazy(() => import("../pages/device/DeviceSelection"));
  const Home = lazy(() => import("../pages/home/Home"));
  const InstructionsMainPage = lazy(() =>
    import("../pages/instructions/MainPage")
  );
  const SingleInstruction = lazy(() =>
    import("../pages/instructions/SingleInstructionPage")
  );
  const InformationMainPage = lazy(() =>
    import("../pages/information/MainPage")
  );
  const Profile = lazy(() => import("../pages/profile/Profile"));
  const DisplayQRCode = lazy(() =>
    import("../pages/display-qr-code/DisplayQRCode")
  );
  const DeviceMainPage = lazy(() =>
    import("../pages/device-options/OptionsMainPage")
  );

  const urlDetector = window.location.pathname;
  const listUrlNotAllow = [
    "/initial-form",
    "/device-selection",
    "/deposit-payment",
    "/",
  ];
  return (
    <>
      <header>
        <UpperBanner />
      </header>
      <main>
        <Suspense fallback={<p>Loading...</p>}>
          <Routes>
            <Route path="/" element={<Home />} />{" "}
            <Route path="/initial-form" element={<ConsumerInitialForm />} />{" "}
            <Route path="/device-selection" element={<DeviceSelection />} />{" "}
            {/* <Route path="/deposit-payment" element={< />} />{" "} */}
            <Route
              path="/qr-code-generation"
              element={<DisplayQRCode />}
            />{" "}
            <Route path="/instructions" element={<InstructionsMainPage />} />{" "}
            <Route path="/instruction/:id" element={<SingleInstruction />} />{" "}
            <Route path="/information" element={<InformationMainPage />} />{" "}
            <Route path="/information" element={<InformationMainPage />} />{" "}
            <Route path="/device" element={<DeviceMainPage />} />{" "}
            <Route path="/profile" element={<Profile />} />{" "}
            <Route path="/authentication" element={<AuthenticationLogin />} />{" "}
          </Routes>{" "}
        </Suspense>
      </main>

      {/* {listUrlNotAllow.includes(urlDetector) ? (
        <footer>
          <IndicatorProgressBottom />
        </footer>
      ) : (
        <footer>
          <NavigationBottom />
        </footer>
      )} */}
      <NavigationBottom />
    </>
  );
};

export default AuthenticatedRoutes;
