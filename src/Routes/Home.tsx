import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult, IMovie } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 100vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const BannerText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 20px;
  width: 40%;
  height: 100px;
  overflow: hidden;
  border-bottom: solid 1.5em rgba(#000, 0.2);
`;

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const bannerMovie =
    data?.results[Math.floor(Math.random() * (data?.total_results || 0))];
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(bannerMovie?.backdrop_path)}>
            <BannerText>
              <Title>{bannerMovie?.title}</Title>
              <Overview>{bannerMovie?.overview}</Overview>
            </BannerText>
          </Banner>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
