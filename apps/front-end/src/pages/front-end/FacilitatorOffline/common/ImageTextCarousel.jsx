import React from "react";
import SimpleImageSlider from "react-simple-image-slider";
import image1 from "./Images/Image1.png";
import image2 from "./Images/Image2.png";
import image3 from "./Images/Image3.png";

const images = [
  {
    url: image1,
    caption_1: "Image 1 caption_1",
    caption_2: "Image 2 caption_2",
  },
  {
    url: image2,
    caption_1: "Image 1 caption_1",
    caption_2: "Image 2 caption_2",
  },
  {
    url: image3,
    caption_1: "Image 3 caption_1",
    caption_2: "Image 3 caption_2",
  },
  //   {
  //     url: "images/Image4.png",
  //     caption_1: "Image 4 caption_1",
  //     caption_2: "Image 4 caption_1",
  //   },
  //   {
  //     url: "images/Image5.png",
  //     caption_1: "Image 5 caption_1",
  //     caption_2: "Image 5 caption_1",
  //   },
  //   {
  //     url: "images/Image6.png",
  //     caption_1: "Image 6 caption_1",
  //     caption_2: "Image 6 caption_1",
  //   },
];

const ImageTextCarousel = () => {
  return (
    <div>
      <SimpleImageSlider
        alignSelf={"center"}
        width={350}
        height={350}
        images={images}
        showBullets={true}
        showNavs={true}
      >
        {images.map((image, index) => (
          <div style={{ width: "20vw" }} key={index}>
            <img src={image.url} alt={`slide-${index}`} />
            <p style={{ color: "red" }}>{image.caption_1}</p>
            <p style={{ color: "red" }}>{image.caption_2}</p>
          </div>
        ))}
      </SimpleImageSlider>
    </div>
  );
};

export default ImageTextCarousel;
