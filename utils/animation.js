export function getInputRangeFromIndexes(range, index, carouselProps) {
  const sizeRef = carouselProps.vertical
    ? carouselProps.itemHeight
    : carouselProps.itemWidth;
  let inputRange = [];

  for (let i = 0; i < range.length; i++) {
    inputRange.push((index - range[i]) * sizeRef);
  }

  return inputRange;
}

export function defaultScrollInterpolator(index, carouselProps) {
  const range = [1, 0, -1];
  const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
  const outputRange = [0, 1, 0];

  return {inputRange, outputRange};
}
export function defaultAnimatedStyles(index, animatedValue, carouselProps) {
  let animatedOpacity = {};
  let animatedScale = {};

  if (carouselProps.inactiveSlideOpacity < 1) {
    animatedOpacity = {
      opacity: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [carouselProps.inactiveSlideOpacity, 1],
      }),
    };
  }

  if (carouselProps.inactiveSlideScale < 1) {
    animatedScale = {
      transform: [
        {
          scale: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [carouselProps.inactiveSlideScale, 1],
          }),
        },
      ],
    };
  }

  return {
    ...animatedOpacity,
    ...animatedScale,
  };
}
