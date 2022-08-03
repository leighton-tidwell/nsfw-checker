import Head from "next/head";
import { useEffect, useState } from "react";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Box,
  Input,
  FormControl,
  InputLabel,
  InputAdornment,
  FormGroup,
  Button,
  CardHeader,
  CircularProgress,
  Grid,
  CardMedia,
  Alert,
} from "@mui/material";
// import PieChart from "../components/Piechart";
import { AbcOutlined, Search } from "@mui/icons-material";
import { getNsfwPosts } from "../api/posts";
import { useRouter } from "next/router";

export default function Home() {
  const [profileResults, setProfileResults] = useState(null);
  const [index, setIndex] = useState(25);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { query, replace } = useRouter();

  const submitProfile = (e) => {
    e.preventDefault();
    setIndex(25);
    setError(null);

    const profileUrl = e.target[0].value;
    fetchResults(profileUrl);
  };

  const fetchResults = (user) => {
    setLoading(true);
    const URL_REGEX =
      /^(http[s]?:\/\/www.reddit.com\/)?(user\/|u\/)?([\w:]{2,21})/g;
    const username = [...user.matchAll(URL_REGEX)].map((m) => m[3])[0] ?? user;

    getNsfwPosts(username)
      .then((data) => {
        setProfileResults(data);
        replace({
          query: { ...query, user },
        });
        setLoading(false);
      })
      .catch((e) => {
        setError(e?.response?.data?.message ?? e.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (query?.user && !profileResults) fetchResults(query.user);
  }, [query, profileResults]);

  const openLink = (image, specificUrl) => {
    if (!image) return window.open(specificUrl, "_blank");
    const url =
      image?.variants?.mp4?.source.url ??
      image?.variants?.gif?.source?.url ??
      image?.source?.url;

    window.open(url, "_blank");
  };

  const loadMore = () => {
    setIndex((prevIndex) => prevIndex + 25);
  };

  const generateCard = (post) => {
    //TODO: Check if video

    // Check for embed
    if (post?.secure_media_embed?.content) {
      const embedLink =
        post.secure_media_embed.content.match(/(?<=src=")(.*?)(?=")/g)[0];

      return (
        <Card
          key={post.id}
          sx={{
            maxHeight: "500px",
            cursor: "pointer",
            aspectRatio: `${post.secure_media_embed.width} / ${post.secure_media_embed.height}`,
          }}
          onClick={() => openLink(null, embedLink)}
        >
          <CardMedia
            component="iframe"
            src={embedLink}
            autoPlay={true}
            height="100%"
            width="100%"
            scrolling="no"
            allowFullScreen
            controls
            frameBorder="no"
          />
        </Card>
      );
    }

    // Map images
    return post?.preview?.images.map((image) => {
      if (image?.variants?.mp4?.source?.url && !image?.variants?.gif) {
        return (
          <Card
            key={post.id}
            sx={{
              maxHeight: "500px",
              cursor: "pointer",
              aspectRatio: `${image?.source?.width} / ${image?.source?.height}`,
            }}
            onClick={() => openLink(image)}
          >
            <CardMedia
              component="video"
              src={image?.variants?.mp4?.source.url}
              autoPlay={true}
            />
          </Card>
        );
      } else {
        return (
          <Card
            key={post.id}
            sx={{
              maxHeight: "500px",
              cursor: "pointer",
              aspectRatio: `${image?.source?.width} / ${image?.source?.height}`,
            }}
            onClick={() => openLink(image)}
          >
            <CardMedia
              component="img"
              image={image?.variants?.gif?.source?.url ?? image?.source?.url}
              alt=""
            />
          </Card>
        );
      }
    });
  };

  return (
    <div>
      <Head>
        <title>NSFW Reddit Checker</title>
        <meta
          name="description"
          content="Check reddit profiles for NSFW content"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AbcOutlined sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              NSFW CHECKER
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="sm">
        <Card sx={{ marginTop: "1em" }} variant="outlined">
          <CardContent>
            <Box
              onSubmit={submitProfile}
              component="form"
              noValidate
              autoComplete="off"
            >
              <FormGroup sx={{ gap: "1em" }}>
                <FormControl variant="standard" required>
                  <InputLabel htmlFor="input-profile">
                    Search a reddit profile or username...
                  </InputLabel>
                  <Input
                    fullWidth
                    id="input-profile"
                    endAdornment={
                      <InputAdornment position="end">
                        <Search />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl>
                  <Button disabled={loading} type="submit" variant="outlined">
                    {loading ? <CircularProgress size={20} /> : "Search"}
                  </Button>
                </FormControl>
                {error && <Alert severity="error">{error}</Alert>}
              </FormGroup>
            </Box>
          </CardContent>
        </Card>
      </Container>
      {profileResults && (
        <Container
          maxWidth="sm"
          sx={{
            marginTop: "1em",
            display: "flex",
            gap: "1em",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card sx={{ padding: "1em" }}>
            <CardHeader title={profileResults.user} />
            <CardContent>
              <Typography variant="body1">
                has submitted <b>{profileResults.totalPosts}</b> posts.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>{profileResults.nsfwPosts.length}</b> are NSFW.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>{profileResults.sfwPosts.length}</b> are SFW.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>
                  {profileResults.totalPosts -
                    profileResults.nsfwPosts.length -
                    profileResults.sfwPosts.length}
                </b>{" "}
                were duplicates.
              </Typography>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: "1em",
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={profileResults.percentage}
                  size={100}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                  >
                    {`${Math.round(profileResults.percentage)}%`}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          {/* <Card sx={{ padding: "1em", flexGrow: "1" }}>
            <CardHeader title="Subreddit breakdown" />
            <CardContent>
              <PieChart
                width={200}
                height={200}
                data={profileResults.subredditBreakDown
                  .sort((a, b) => b.percentage - a.percentage)
                  .slice(0, 10)
                  .map((subreddit) => ({
                    name: subreddit.name,
                    value: subreddit.percentage,
                  }))}
              />
            </CardContent>
          </Card> */}
        </Container>
      )}

      {profileResults && (
        <Grid
          container
          gap={2}
          sx={{ marginTop: "1em", marginBottom: "1em" }}
          alignItems="center"
          justifyContent="center"
        >
          {profileResults.nsfwPosts
            .slice(0, index)
            .map((post) => generateCard(post))}
        </Grid>
      )}

      {profileResults && profileResults.nsfwPosts.length > index && (
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1em",
            marginBottom: "1em",
          }}
        >
          <Button onClick={loadMore}>Load more</Button>
        </Container>
      )}
    </div>
  );
}
