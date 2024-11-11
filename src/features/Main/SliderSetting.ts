export const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 1000,
  slidesToShow: 3, // Show 3 slides at a time (center + half of each side)
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  centerMode: true, // Enable center mode to focus on the middle card
  centerPadding: "10px", // Adjust padding to control how much of side slides are shown
  responsive: [
    { 
      breakpoint: 768, 
      settings: { slidesToShow: 1, slidesToScroll: 1, centerPadding: "0px" } 
    },
    { 
      breakpoint: 1024, 
      settings: { slidesToShow: 2, slidesToScroll: 1, centerPadding: "10px" } 
    },
  ],
};
