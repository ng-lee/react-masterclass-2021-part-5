import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IMovie } from "../api";
import { makeImagePath } from "../utils";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Detail = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80%;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  overflow: hidden;
  border-radius: 15px;
`;

const DetailCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;

const DetailDescription = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  h2 {
    font-size: 28px;
    margin-bottom: 10px;
  }
`;

interface IContentDetailProps {
  contentData: IMovie[];
}

function ContentDetail({ contentData }: IContentDetailProps) {
  const { scrollY } = useViewportScroll();
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const onOverlayClicked = () => navigate("/");
  const clickedContent =
    bigMovieMatch?.params.movieId &&
    contentData.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );
  return (
    <AnimatePresence>
      {bigMovieMatch ? (
        <>
          <Overlay onClick={onOverlayClicked} />
          <Detail
            style={{ top: scrollY.get() + 50 }}
            layoutId={bigMovieMatch.params.movieId}
          >
            {clickedContent && (
              <>
                <DetailCover
                  style={{
                    backgroundImage: `url(${makeImagePath(
                      clickedContent.backdrop_path
                    )})`,
                  }}
                />
                <DetailDescription>
                  <h2>{clickedContent.title}</h2>
                  <p>{clickedContent.overview}</p>
                </DetailDescription>
              </>
            )}
          </Detail>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export default ContentDetail;
