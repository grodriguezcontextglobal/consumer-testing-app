import { Button, Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { devitrackApi } from "../../devitrakApi";
import { useDispatch, useSelector } from "react-redux";
import { Card, Divider, Empty } from "antd";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import SingleInstructionPage from "./SingleInstructionPage";
import { useState } from "react";
import { onAddArticleInfo } from "../../store/slides/articleHandlerSlide";

const MainPage = () => {
  const { eventInfoDetail } = useSelector((state) => state.event);
  const [articleSelected, setArticleSelected] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const listOfArticlesQuery = useQuery({
    queryKey: ["articles"],
    queryFn: () => devitrackApi.get("/article/articles"),
  });

  if (listOfArticlesQuery.data) {
    const findArticlesPerEvent = () => {
      const find = listOfArticlesQuery.data.data.articles.filter(
        (article) =>
          article.event === eventInfoDetail.eventName && article.active === true
      );
      return find;
    };

    const sanitizedData = (props) => ({
      __html: DOMPurify.sanitize(props),
    });

    const articleClicked = async (props) => {
      dispatch(onAddArticleInfo(props));
      return navigate(`/instruction/${props._id}`);
    };
    return (
      <>
        <Grid margin={"3rem auto 5rem"} container>
          <Grid
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            alignSelf={"stretch"}
            justifyContent={"center"}
            item
            xs={11}
            margin={"10px auto 0px"}
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
              style={{
                textWrap: "balance",
              }}
            >
              Value information related to our devices
            </Typography>
          </Grid>
          <Grid
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            alignSelf={"stretch"}
            justifyContent={"center"}
            item
            xs={11}
            margin={"10px 0px 0px"}
          >
            <Typography
              color={"var(--gray-900, #101828)"}
              textAlign={"center"}
              /* Display xs/Semibold */
              fontFamily={"Inter"}
              fontSize={"18px"}
              fontStyle={"normal"}
              fontWeight={400}
              lineHeight={"24px"}
              style={{
                textWrap: "balance",
              }}
            >
              Select an article to display the information.
            </Typography>
          </Grid>
          <Divider />
          <Grid
            display={"flex"}
            alignItems={"center"}
            flexDirection={"column"}
            justifyContent={"center"}
            margin={"0 auto"}
            item
            xs={10}
          >
            {findArticlesPerEvent()?.length > 0 ? (
              findArticlesPerEvent()?.map((article, index) => {
                return (
                  <Card
                    key={article.title}
                    extra={
                      <Button
                        onClick={() => articleClicked(article)}
                        style={{
                          border: "solid 1px var(--gray-900, #f0f0f0)",
                        }}
                      >
                        <Typography
                          textTransform={"none"}
                          color={"var(--gray-900, #101828)"}
                          textAlign={"center"}
                          /* Display xs/Semibold */
                          fontFamily={"Inter"}
                          fontSize={"12px"}
                          fontStyle={"normal"}
                          fontWeight={500}
                          lineHeight={"18px"}
                          style={{
                            textWrap: "balance",
                          }}
                        >
                          More
                        </Typography>
                      </Button>
                    }
                    style={{
                      marginTop: 16,
                      width: "100%",
                      whiteSpace: "wrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      "-webkit-line-clamp": "3" /* number of lines to show */,
                      "-webkit-box-orient": "vertical",
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={sanitizedData(article.body)}
                    ></div>
                  </Card>
                );
              })
            ) : (
              <Empty description={"No articles created for this event."} />
            )}
          </Grid>
        </Grid>
      </>
    );
  }
};

export default MainPage;
