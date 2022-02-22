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
  margin-bottom: 30px;
`;

const BannerText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const BannerTitle = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 20px;
  width: 40%;
  height: 100px;
  overflow-y: hidden;
`;

const Article = styled.article`
  margin-bottom: 30px;
`;

const SliderTitle = styled.h2`
  padding-left: 60px;
  font-size: 32px;
  margin-bottom: 20px;
  font-weight: 600;
`;

const Slider = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  position: relative;
`;

const SliderRow = styled(motion.div)`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  padding: 0 45px;
`;

const SliderBtn = styled.div`
  width: 40px;
  height: 130px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  svg {
    fill: white;
    width: 20px;
  }
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const Movie = styled(motion.div)<{ bgPhoto: string }>`
  width: 230px;
  height: 150px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  font-size: 20px;
  font-weight: 600;
  padding: 5px;
  text-shadow: #111 1px 0 5px;
  justify-self: center;
`;

const rowVariants = {
  hidden: (next: boolean) => ({
    x: next ? window.outerWidth + 5 : window.outerWidth * -1 - 5,
  }),
  visible: {
    x: 0,
  },
  exit: (next: boolean) => ({
    x: next ? window.outerWidth * -1 - 5 : window.outerWidth + 5,
  }),
};

const offset = 6;

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [prevExist, setPrevExist] = useState(false);
  const [nextExist, setNextExist] = useState(true);
  const [next, setNext] = useState(true);
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      else {
        setLeaving(true);
        if (index === 0) {
          setPrevExist(false);
        } else {
          setIndex((prev) => prev - 1);
        }
        setNext(false);
      }
    }
  };
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      else {
        setLeaving(true);
        const totalMovies = data?.results.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        if (index === maxIndex) {
          setNextExist(false);
          setIndex(0);
        } else {
          setIndex((prev) => prev + 1);
        }
        setNext(true);
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
              <BannerTitle>{data?.results[0].title}</BannerTitle>
              <Overview>{data?.results[0].overview}</Overview>
            </BannerText>
          </Banner>
          <Article>
            <SliderTitle>Now Playing</SliderTitle>
            <Slider>
              <SliderBtn onClick={decreaseIndex}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z" />
                </svg>
              </SliderBtn>
              <AnimatePresence
                custom={next}
                initial={false}
                onExitComplete={toggleLeaving}
              >
                <SliderRow
                  custom={next}
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
                      <Movie
                        bgPhoto={makeImagePath(movie.backdrop_path)}
                        key={movie.id}
                      >
                        {movie.title}
                      </Movie>
                    ))}
                </SliderRow>
              </AnimatePresence>
              <SliderBtn onClick={increaseIndex}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" />
                </svg>
              </SliderBtn>
            </Slider>
          </Article>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
