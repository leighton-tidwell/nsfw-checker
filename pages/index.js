import axios from "axios";
import { useState } from "react";
import {
  Button,
  Header,
  HeaderName,
  Loading,
  Content,
  Grid,
  Column,
  Row,
  TextInput,
} from "carbon-components-react";
import Head from "next/head";

const Home = () => {
  const [profileUrl, setProfileUrl] = useState("");
  const [profileResults, setProfileResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitProfile = () => {
    setLoading(true);
    const indexOfUser = profileUrl.indexOf("user") + 4;
    const username = profileUrl.slice(indexOfUser).replace(/\//g, "");

    axios
      .post("/api/user/nsfw-posts", { username })
      .then((response) => {
        const { data } = response;
        console.log(data);
        setProfileResults(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container">
      <Head>
        <title>NSFW Reddit Checker</title>
        <meta
          name="description"
          content="Check reddit profiles for NSFW content"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header aria-label="NSFW Checker">
        <HeaderName href="/" prefix="NSFW">
          Checker
        </HeaderName>
      </Header>
      <Content>
        <Grid>
          <Row>
            <Column>
              <TextInput
                type="text"
                onChange={(e) => setProfileUrl(e.target.value)}
                value={profileUrl}
              />
            </Column>
            <Column>
              <Button kind="primary" disabled={loading} onClick={submitProfile}>
                {loading ? <Loading /> : "Look up"}
              </Button>
            </Column>
          </Row>
        </Grid>
        {profileResults && (
          <>
            <div>
              This user has <b>{profileResults.totalPosts}</b> total posts, of
              those post <b>%{profileResults.percentage}</b> are NSFW.
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1em",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "1em",
                marginBottom: "1em",
                gridTemplateRows: "auto",
              }}
            >
              {profileResults.nsfwPosts.map((post) =>
                post?.preview?.images.map((image) => (
                  <a
                    style={{
                      background: "#f4f4f4",
                      minWidth: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "1em",
                      aspectRatio: `${image.source.width} / ${image.source.height}`,
                    }}
                    href={image.source.url}
                  >
                    <div
                      style={{
                        backgroundImage: `url(${image.source.url})`,
                        backgroundSize: "cover",
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </a>
                ))
              )}
            </div>
          </>
        )}
      </Content>
    </div>
  );
};

export default Home;
