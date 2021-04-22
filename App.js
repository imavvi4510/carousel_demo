import React from 'react';
import {View, Image, Dimensions, StyleSheet} from 'react-native';
import Carousel from './carousel/carousel';
export const SLIDER_WIDTH = Dimensions.get('window').width + 80;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const data = [
  {
    imgUrl: 'https://pbs.twimg.com/media/DsTXxaAWoAAMU0g.jpg',
  },
  {
    imgUrl:
      'https://cdnb.artstation.com/p/assets/images/images/013/548/051/large/scykiazor-p-high-elf-gbsl.jpg?1540123593',
  },
  {
    imgUrl:
      'https://animesher.com/orig/0/61/612/6129/animesher.com_girl-anime-girl-archer-612968.jpg',
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
        enableSnap={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,

    borderRadius: 10,

    paddingBottom: 0,
    shadowColor: '#000',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.29,
    // shadowRadius: 4.65,
    // elevation: 20,
  },
  image: {
    width: ITEM_WIDTH,
    height: '90%',
    borderRadius: 20,
  },
});

export default App;
