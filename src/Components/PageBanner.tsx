import styled from "styled-components";
import { IMovie } from "../api";
import { makeImagePath } from "../utils";

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

interface IPageBannerProps {
  contentData: IMovie[];
}

function PageBanner({contentData} : IPageBannerProps) {
  return (
    <Banner bgPhoto={makeImagePath(contentData[0].backdrop_path)}>
      <BannerText>
        <BannerTitle>{contentData[0].title}</BannerTitle>
        <Overview>{contentData[0].overview}</Overview>
      </BannerText>
    </Banner>
  );
}

export default PageBanner;
