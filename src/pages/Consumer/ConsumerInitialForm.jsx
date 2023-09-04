// import { useSelector } from "react-redux";
import {
  Button,
  InputLabel,
  OutlinedInput,
  Typography,
  Grid,
} from "@mui/material";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import "./ConsumerInitialForm.css";
import { useRef, useState } from "react";
import { devitrackApi } from "../../devitrakApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { onAddConsumerInfo } from "../../store/slides/consumerSlide";

const schema = yup
  .object({
    firstName: yup.string().required("first name is required"),
    lastName: yup.string().required("last name is required"),
    email: yup
      .string()
      .email("email has an invalid format")
      .required("email is required"),
  })
  .required();
const ConsumerInitialForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    // setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [contactPhoneNumber, setContactPhoneNumber] = useState("");
  const [groupName, setGroupName] = useState("");
  const { choice, company, contactInfo } = useSelector((state) => state.event);
  const emailSentRef = useRef(false);
  console.log("🚀 ~ file: ConsumerInitialForm.jsx:47 ~ ConsumerInitialForm ~ emailSentRef:", emailSentRef)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const listOfConsumersQuery = useQuery({
    queryKey: ["listOfConsumers"],
    queryFn: () => devitrackApi.get("/auth/users"),
  });

  const newConsumerMutation = useMutation({
    mutationFn: (newConsumerProfile) =>
      devitrackApi.post("/auth/new", newConsumerProfile),
  });

  if (listOfConsumersQuery.data) {
    const checkIfConsumerExists = () => {
      const check = listOfConsumersQuery.data.data.users.find(
        (consumer) => consumer.email === watch("email")
      );
      return check;
    };
    checkIfConsumerExists();
    const submitEmailToLoginForExistingConsumer = async () => {
      //!parameters needed:
      //!consumer.name
      //!consumer.lastName
      //!link to contain all consumer info to log in
      //!contact info.email
      const parametersNeededToLoginLink = {
        consumer: checkIfConsumerExists(),
        link: `http://localhost:3791/authentication?event=${choice.replace(
          /%20/g,
          " "
        )}&company=${company.replace(/%20/g, " ")}&uid=${
          checkIfConsumerExists().id
        }`,
        contactInfo: contactInfo.email,
      };
      const respo = await devitrackApi.post(
        "/nodemailer/login-existing-consumer",
        parametersNeededToLoginLink
      );
      if (respo) {
        return (emailSentRef.current = true);
      }
    };

    const submitNewConsumerInfo = (data) => {
      const newConsumerProfile = {
        name: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: contactPhoneNumber,
        privacyPolicy: true,
        category: "Regular",
        provider: [company],
        eventSelected: [choice],
        group: groupName,
      };
      // newConsumerMutation.mutate(newConsumerProfile);
      dispatch(onAddConsumerInfo(newConsumerProfile));
      navigate("/device-selection");
      // if((newConsumerMutation.isIdle || newConsumerMutation.isSuccess) && !newConsumerMutation.isError){
      //   dispatch(onAddConsumerInfo(newConsumerProfile))
      //   navigate('/device-selection')
      // }
    };
    return (
      <>
        <Grid
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          margin={'0 0 2rem'}
          gap={2}
          container
        >
          <Grid
            display={"flex"}
            justifyContent={"center"}
            alignSelf={"stretch"}
            gap={2}
            container
          >
            <Grid display={"flex"} justifyContent={"center"} item xs={10}>
              <form
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  // textAlign: "left",
                }}
                onSubmit={handleSubmit(submitNewConsumerInfo)}
                className="form"
              >
                <Grid
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  alignSelf={"stretch"}
                  justifyContent={"center"}
                  item
                  xs={12}
                  margin={"1rem 0"}
                >
                  <Typography
                    color={"var(--gray-900, #101828)"}
                    textAlign={"center"}
                    /* Display xs/Semibold */
                    fontFamily={"Inter"}
                    fontSize={"24px"}
                    fontStyle={"normal"}
                    fontWeight={600}
                    lineHeight={"32px"}
                  >
                    Request devices
                  </Typography>
                </Grid>
                <Grid
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  alignSelf={"stretch"}
                  justifyContent={"center"}
                  item
                  xs={12}
                  margin={"1rem 0"}
                >
                  <Typography
                    color={"var(--gray-600, #475467"}
                    textAlign={"center"}
                    /* Display xs/Semibold */
                    fontFamily={"Inter"}
                    fontSize={"16px"}
                    fontStyle={"normal"}
                    fontWeight={500}
                    lineHeight={"24px"}
                  >
                    Fill out the form to request devices.
                  </Typography>
                </Grid>
                <Grid
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  item
                  xs={12}
                  margin={"1rem 0"}
                >
                  <InputLabel style={{ marginBottom: "3px", width: "100%" }}>
                    <Typography
                      textTransform={"none"}
                      textAlign={"left"}
                      fontFamily={"Inter"}
                      fontSize={"14px"}
                      fontStyle={"normal"}
                      fontWeight={500}
                      lineHeight={"20px"}
                      color={"var(--gray-700, #344054)"}
                    >
                      Email
                    </Typography>
                  </InputLabel>
                  <OutlinedInput
                    {...register("email")}
                    aria-invalid={errors.email ? true : false}
                    style={{
                      borderRadius: "12px",
                      border: `${errors.email && "solid 1px #004EEB"}`,
                      margin: "0.1rem auto 1rem",
                    }}
                    placeholder="Enter your email"
                    fullWidth
                  />
                  {errors?.email?.message}
                </Grid>
                {checkIfConsumerExists() && (
                  <Typography
                    color={"var(--gray-600, #475467)"}
                    /* Text sm/Regular */
                    fontFamily={"Inter"}
                    fontSize={"14px"}
                    fontStyle={"normal"}
                    fontWeight={400}
                    lineHeight={"20px"}
                  >
                    Welcome back, {checkIfConsumerExists().name}! Your email is
                    already in the system. Continue by sending an email to your
                    inbox that contains a link for you to log in.
                  </Typography>
                )}
                {checkIfConsumerExists() && (
                  <Grid item xs={12} margin={"1rem 0"}>
                    <Button
                      onClick={() => submitEmailToLoginForExistingConsumer()}
                      style={{
                        display: "flex",
                        padding: "12px 20px",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        alignSelf: "stretch",
                        borderRadius: "8px",
                        border: `${
                          emailSentRef.current === true
                            ? "1px solid var(--gray-300, #D0D5DD)"
                            : "1px solid var(--blue-dark-600, #155EEF)"
                        }`,
                        background: `${
                          emailSentRef.current === true
                            ? "var(--base-white, #FFF)"
                            : "var(--blue-dark-600, #155EEF)"
                        }`,
                        boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                        width: "100%",
                      }}
                    >
                      <Typography
                        textTransform={"none"}
                        fontFamily={"Inter"}
                        fontSize={"16px"}
                        fontStyle={"normal"}
                        fontWeight={600}
                        lineHeight={"24px"}
                        color={`${
                          emailSentRef.current === true
                            ? "var(--gray-700, #344054)"
                            : "var(--base-white, #FFF)"
                        }`}
                      >
                        {emailSentRef.current === true
                          ? "Send email again"
                          : "Send login email"}
                      </Typography>
                    </Button>
                  </Grid>
                )}

                {!checkIfConsumerExists() && (
                  <>
                    <Grid
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      item
                      xs={12}
                      margin={"1rem 0"}
                    >
                      <InputLabel
                        style={{ marginBottom: "3px", width: "100%" }}
                      >
                        <Typography
                          textTransform={"none"}
                          textAlign={"left"}
                          fontFamily={"Inter"}
                          fontSize={"14px"}
                          fontStyle={"normal"}
                          fontWeight={500}
                          lineHeight={"20px"}
                          color={"var(--gray-700, #344054)"}
                        >
                          First name
                        </Typography>
                      </InputLabel>
                      <OutlinedInput
                        {...register("firstName")}
                        aria-invalid={errors.firstName ? true : false}
                        style={{
                          borderRadius: "12px",
                          border: `${errors.firstName && "solid 1px #004EEB"}`,
                          margin: "0.1rem auto 1rem",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                        placeholder="Enter your first name"
                        fullWidth
                      />
                      <Typography
                        textTransform={"none"}
                        textAlign={"left"}
                        fontFamily={"Inter"}
                        fontSize={"14px"}
                        fontStyle={"normal"}
                        fontWeight={500}
                        lineHeight={"20px"}
                        color={"var(--gray-700, #344054)"}
                      >
                        {errors?.firstName?.message}
                      </Typography>
                    </Grid>
                    <Grid
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      item
                      xs={12}
                      margin={"1rem 0"}
                    >
                      <InputLabel
                        style={{ marginBottom: "3px", width: "100%" }}
                      >
                        <Typography
                          textTransform={"none"}
                          textAlign={"left"}
                          fontFamily={"Inter"}
                          fontSize={"14px"}
                          fontStyle={"normal"}
                          fontWeight={500}
                          lineHeight={"20px"}
                          color={"var(--gray-700, #344054)"}
                        >
                          Last name
                        </Typography>
                      </InputLabel>
                      <OutlinedInput
                        {...register("lastName")}
                        aria-invalid={errors.lastName ? true : false}
                        style={{
                          borderRadius: "12px",
                          border: `${errors.lastName && "solid 1px #004EEB"}`,
                          margin: "0.1rem auto 1rem",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                        placeholder="Enter your last name"
                        fullWidth
                      />
                      {errors?.lastName?.message}
                    </Grid>
                    <Grid
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      item
                      xs={11}
                    >
                      <InputLabel
                        style={{ marginBottom: "3px", width: "100%" }}
                      >
                        <Typography
                          textTransform={"none"}
                          textAlign={"left"}
                          fontFamily={"Inter"}
                          fontSize={"14px"}
                          fontStyle={"normal"}
                          fontWeight={500}
                          lineHeight={"20px"}
                          color={"var(--gray-700, #344054)"}
                        >
                          Phone number
                        </Typography>
                      </InputLabel>

                      <PhoneInput
                        style={{
                          border: "solid 1px rgba(0, 0, 0, 0.23)",
                          borderRadius: "12px",
                          padding: "13px 14px",
                          margin: "0.1rem auto 1rem",
                          display: "flex",
                          justifyContent: "flex-start",
                          width: "100%",
                        }}
                        countrySelectProps={{ unicodeFlags: true }}
                        defaultCountry="US"
                        placeholder="Enter your phone number"
                        value={contactPhoneNumber}
                        onChange={setContactPhoneNumber}
                      />
                    </Grid>
                    <Grid
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      item
                      xs={12}
                      margin={"1rem 0"}
                    >
                      <InputLabel
                        style={{ marginBottom: "3px", width: "100%" }}
                      >
                        <Typography
                          textTransform={"none"}
                          textAlign={"left"}
                          fontFamily={"Inter"}
                          fontSize={"14px"}
                          fontStyle={"normal"}
                          fontWeight={500}
                          lineHeight={"20px"}
                          color={"var(--gray-700, #344054)"}
                        >
                          Group name
                        </Typography>
                      </InputLabel>
                      <OutlinedInput
                        value={groupName}
                        name="groupName"
                        onChange={(e) => setGroupName(e.target.value)}
                        style={{
                          borderRadius: "12px",
                          margin: "0.1rem auto 1rem",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                        placeholder="Enter your group name"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} margin={"1rem 0"}>
                      <Button
                        type="submit"
                        style={{
                          display: "flex",
                          padding: "12px 20px",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "8px",
                          alignSelf: "stretch",
                          borderRadius: "8px",
                          border: "1px solid var(--blue-dark-600, #155EEF)",
                          background: "var(--blue-dark-600, #155EEF)",
                          boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                          width: "100%",
                        }}
                      >
                        <Typography
                          textTransform={"none"}
                          fontFamily={"Inter"}
                          fontSize={"16px"}
                          fontStyle={"normal"}
                          fontWeight={600}
                          lineHeight={"24px"}
                          color={"var(--base-white, #FFF)"}
                        >
                          Continue
                        </Typography>
                      </Button>
                    </Grid>{" "}
                  </>
                )}
              </form>
            </Grid>{" "}
          </Grid>
        </Grid>
        {/* <Grid
          style={{
            position: "absolute",
            top: "95dvh",
            bottom: "0",
            left: "0",
            right: "0",
          }}
          container
        >
          <Grid
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            item
            xs={12}
          >
            <IndicatorProgressBottom current={50} />
          </Grid>
        </Grid> */}
      </>
    );
  }
};

export default ConsumerInitialForm;
