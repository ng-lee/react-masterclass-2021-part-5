import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import ContentSlider from "../Components/ContentSlider";
import PageBanner from "../Components/PageBanner";
import ContentDetail from "../Components/ContentDetail";

const Wrapper = styled.div`
  background-color: black;
  height: 200vh;
`;

const Loader = styled.div`
  height: 100vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  return (
    <Wrapper>
      {isLoading || !data ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <PageBanner contentData={data.results} />
          <ContentSlider contentData={data.results} />
          <ContentDetail contentData={data.results} />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
