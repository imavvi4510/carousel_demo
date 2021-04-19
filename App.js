import React, {useRef} from 'react';
import {View, Image, Dimensions, Animated, StyleSheet} from 'react-native';
import Carousel from './carousel/carousel';
export const SLIDER_WIDTH = Dimensions.get('window').width + 80;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const data = [
  {
    imgUrl:
      'https://thumbs.dreamstime.com/b/female-muslim-archer-character-illustration-female-muslim-archer-character-194540833.jpg',
  },
  {
    imgUrl:
      'https://i.pinimg.com/originals/61/fc/d5/61fcd52ba7ed00ac7ee8e01c700c727d.png',
  },
  {
    imgUrl:
      'https://thumbs.dreamstime.com/b/female-muslim-archer-character-illustration-female-muslim-archer-character-194540833.jpg',
  },
];

const CarouselCardItem = ({item, index}) => {
  return (
    <View style={styles.container} key={index}>
      <Image source={{uri: item.imgUrl}} style={styles.image} />
    </View>
  );
};

const App = () => {
  return (
    <View style={{marginTop: 0, backgroundColor: 'green', flex: 1}}>
      <Carousel
        layout="default"
        data={data}
        renderItem={CarouselCardItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,

    borderRadius: 10,

    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 20,
  },
  image: {
    width: ITEM_WIDTH,
    height: '90%',
  },
});

export default App;
