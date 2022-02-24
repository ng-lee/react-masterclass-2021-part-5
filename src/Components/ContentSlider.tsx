import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IMovie } from "../api";
import { makeImagePath } from "../utils";

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
  height: 150px;
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
  justify-self: center;
  position: relative;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const MovieInfo = styled(motion.div)`
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  font-size: 15px;
  justify-content: center;
  align-items: center;
  text-align: center;
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

const MovieVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    zIndex: 1,
    transition: {
      delay: 0.3,
      duration: 0.3,
    },
  },
};

const MovieInfoVariants = {
  hover: {
    opacity: 1,
  },
};

const offset = 6;

interface IContentSliderProps {
  contentData: IMovie[];
}

function ContentSlider({ contentData }: IContentSliderProps) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [next, setNext] = useState(true);
  const decreaseIndex = () => {
    if (contentData) {
      if (leaving) return;
      else {
        setLeaving(true);
        if (index !== 0) {
          setIndex((prev) => prev - 1);
        }
        setNext(false);
      }
    }
  };
  const increaseIndex = () => {
    if (contentData) {
      if (leaving) return;
      else {
        setLeaving(true);
        const totalMovies = contentData.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        if (index === maxIndex) {
          setIndex(0);
        } else {
          setIndex((prev) => prev + 1);
        }
        setNext(true);
      }
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onMovieClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  return (
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
            {contentData
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Movie
                  variants={MovieVariants}
                  whileHover="hover"
                  initial="normal"
                  transition={{ type: "tween" }}
                  onClick={() => onMovieClicked(movie.id)}
                  bgPhoto={makeImagePath(movie.backdrop_path)}
                  key={movie.id}
                  layoutId={movie.id + ""}
                >
                  <MovieInfo variants={MovieInfoVariants}>
                    <span>{movie.title}</span>
                    <span>{movie.release_date}</span>
                    <span>{movie.vote_average}</span>
                  </MovieInfo>
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
  );
}

export default ContentSlider;
