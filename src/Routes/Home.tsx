import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { getMovies, IGetMoviesResult } from "../api";
import { useState } from "react";

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
  overflow-y: hidden;
`;

const Slider = styled(motion.div)`
  position: relative;
`;

const SliderRow = styled(motion.div)`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  height: 130px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: window.outerWidth * -1 - 5,
  },
};

const offset = 6;

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      else {
        setLeaving(true);
        const totalMovies = data?.results.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path)}
          >
            <BannerText>
              <Title>{data?.results[0].title}</Title>
              <Overview>{data?.results[0].overview}</Overview>
            </BannerText>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <SliderRow
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      bgPhoto={makeImagePath(movie.backdrop_path, "w200")}
                      key={movie.id}
                    />
                  ))}
              </SliderRow>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
