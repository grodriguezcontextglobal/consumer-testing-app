import { useQuery } from "@tanstack/react-query";
import { devitrackApi } from "../../devitrakApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  onAddContactInfo,
  onAddDeviceSetup,
  onAddEventData,
  onAddEventInfoDetail,
  onAddEventStaff,
  onAddSubscriptionInfo,
  onSelectCompany,
  onSelectEvent,
} from "../../store/slides/eventSlide";
import { Grid, Typography } from "@mui/material";
import Logo from "../../assets/devitrak_logo.svg";
import Devitrak from "../../assets/Layer_1.svg";
import "animate.css";
const Home = () => {
  const [existingEvent, setExistingEvent] = useState(false);
  const eventUrl = new URLSearchParams(window.location.search).get("event");
  const companyUrl = new URLSearchParams(window.location.search).get("company");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const listOfEventsQuery = useQuery({
    queryKey: ["listOfEvents"],
    queryFn: () => devitrackApi.get("/event/event-list"),
  });
  const foundEventInfo = useCallback(() => {
    const finding = listOfEventsQuery?.data?.data?.list?.find(
      (event) =>
        event.eventInfoDetail.eventName === eventUrl &&
        event.company === companyUrl
    );
    return finding;
  }, [
    listOfEventsQuery.isLoading,
    listOfEventsQuery.data,
    companyUrl,
    eventUrl,
  ]);
  foundEventInfo();
  const addEventInfoAndNavigate = () => {
    if (foundEventInfo()) {
      dispatch(onAddEventData(foundEventInfo()));
      dispatch(onAddEventInfoDetail(foundEventInfo().eventInfoDetail));
      dispatch(onAddEventStaff(foundEventInfo().staff));
      dispatch(onSelectEvent(foundEventInfo().eventInfoDetail.eventName));
      dispatch(onSelectCompany(foundEventInfo().company));
      dispatch(onAddDeviceSetup(foundEventInfo().deviceSetup));
      dispatch(onAddContactInfo(foundEventInfo().contactInfo));
      dispatch(onAddSubscriptionInfo(foundEventInfo().subscription));
      navigate("/initial-form");
      // if (foundEventInfo()?.active === false) {
      //   return setExistingEvent(true);
      // } else {
      //   dispatch(onAddEventData(foundEventInfo()));
      //   dispatch(onAddEventInfoDetail(foundEventInfo().eventInfoDetail));
      //   dispatch(onAddEventStaff(foundEventInfo().staff));
      //   dispatch(onSelectEvent(foundEventInfo().eventInfoDetail.eventName));
      //   dispatch(onSelectCompany(foundEventInfo().company));
      //   dispatch(onAddDeviceSetup(foundEventInfo().deviceSetup));
      //   dispatch(onAddContactInfo(foundEventInfo().contactInfo));
      //   dispatch(onAddSubscriptionInfo(foundEventInfo().subscription));
      //   navigate("/initial-form");
      // }
    }
  };
  useEffect(() => {
    const controller = new AbortController();
    addEventInfoAndNavigate();
    return () => {
      controller.abort();
    };
  }, [listOfEventsQuery.isLoading, listOfEventsQuery.data]);

  if (listOfEventsQuery.data) {
    return (
      <Grid
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        margin={"2rem auto"}
        container
      >
        <Grid
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          item
          xs={10}
          margin={"15rem 0"}
        >
          {" "}
          <Typography
            color={"var(--gray-900, #101828)"}
            textAlign={"center"}
            /* Display xs/Semibold */
            fontFamily={"Inter"}
            fontSize={"20px"}
            fontStyle={"normal"}
            fontWeight={600}
            lineHeight={"30px"}
            style={{
              textWrap: "balance",
            }}
          >
            Welcome to{" "}
          </Typography>
          <br />
          <div className="animate__animated animate__backInUp animate__delay-0.5s">
            <img src={Logo} alt="logo" style={{ width: "50px" }} />
            <img src={Devitrak} alt="name" style={{ width: "100px" }} />
          </div>
          <br />
          <Typography
            color={"var(--gray-900, #101828)"}
            textAlign={"center"}
            /* Display xs/Semibold */
            fontFamily={"Inter"}
            fontSize={"14px"}
            fontStyle={"normal"}
            fontWeight={500}
            lineHeight={"20px"}
            style={{
              textWrap: "balance",
            }}
          >
            Safeguard your devices
          </Typography>
        </Grid>
      </Grid>
    );
  }
};

export default Home;
