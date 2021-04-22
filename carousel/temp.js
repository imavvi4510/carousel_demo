// import React, {Component} from 'react';
// import {Animated, FlatList} from 'react-native';

// import {
//   defaultScrollInterpolator,
//   defaultAnimatedStyles,
// } from '../utils/animation.js';

// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
// export default class Carousel extends Component {
//   static defaultProps = {
//     enableSnap: true,
//     inactiveSlideOpacity: 0.7,
//     inactiveSlideScale: 0.9,
//     layout: 'default',
//   };

//   constructor(props) {
//     super(props);

//     this.state = {
//       hideCarousel: true,
//       interpolators: [],
//     };

//     this._renderItem = this._renderItem.bind(this);

//     this._onScroll = this._onScroll.bind(this);

//     this._onScrollEndDrag = this._onScrollEndDrag.bind(this);

//     this._getKeyExtractor = this._getKeyExtractor.bind(this);

//     this._setScrollHandler(props);
//   }

//   componentDidMount() {
//     this._initPositionsAndInterpolators();
//   }

//   _setScrollHandler() {
//     const scrollEventConfig = {
//       listener: this._onScroll,
//       useNativeDriver: true,
//     };
//     this._scrollPos = new Animated.Value(0);
//     const argMapping = [{nativeEvent: {contentOffset: {x: this._scrollPos}}}];

//     this._onScrollHandler = Animated.event(argMapping, scrollEventConfig);
//   }

//   _getCustomData(props = this.props) {
//     const {data} = props;

//     let previousItems = [];
//     let nextItems = [];
//     console.log('custom data');
//     return previousItems.concat(data, nextItems);
//   }

//   _getKeyExtractor(item, index) {
//     return `flatlist-item-${index}`;
//   }

//   _getScrollOffset(event) {
//     const {vertical} = this.props;
//     return event.nativeEvent.contentOffset[vertical ? 'y' : 'x'];
//   }

//   _getContainerInnerMargin(opposite = false) {
//     const {sliderWidth, itemWidth} = this.props;
//     return (sliderWidth - itemWidth) / 4;
//   }

//   _getViewportOffset() {
//     const {sliderWidth} = this.props;
//     return sliderWidth / 2;
//   }

//   _getCenter(offset) {
//     return offset + this._getViewportOffset() - this._getContainerInnerMargin();
//   }

//   _getActiveItem(offset) {
//     const center = this._getCenter(offset);
//     const centerOffset = 2;

//     for (let i = 0; i < this._positions.length; i++) {
//       const {start, end} = this._positions[i];
//       if (center + centerOffset >= start && center - centerOffset <= end) {
//         console.log('hii');
//         return i;
//       }
//     }

//     return 0;
//   }

//   _initPositionsAndInterpolators(props = this.props) {
//     const {itemWidth, itemHeight, vertical} = props;
//     const sizeRef = vertical ? itemHeight : itemWidth;

//     let interpolators = [];
//     this._positions = [];

//     this._getCustomData(props).forEach((itemData, index) => {
//       const _index = index;
//       let animatedValue;

//       this._positions[index] = {
//         start: index * sizeRef,
//         end: index * sizeRef + sizeRef,
//       };

//       {
//         let interpolator;

//         interpolator = defaultScrollInterpolator(_index, props);

//         animatedValue = this._scrollPos.interpolate({
//           ...interpolator,
//         });
//       }

//       interpolators.push(animatedValue);
//     });

//     this.setState({interpolators});
//   }

//   _scrollTo(offset) {
//     const wrappedRef = this._carouselRef;
//     const options = {
//       offset,
//     };

//     wrappedRef.scrollToOffset(options);
//   }

//   _onScroll(event) {
//     const scrollOffset = this._getScrollOffset(event);
//     this._currentContentOffset = scrollOffset;
//   }

//   _onScrollEndDrag(event) {
//     if (this._carouselRef) {
//       this._onScrollEnd && this._onScrollEnd();
//     }
//   }

//   _onScrollEnd(event) {
//     const {enableSnap} = this.props;

//     this._scrollEndOffset = this._currentContentOffset;
//     this._scrollEndActive = this._getActiveItem(this._scrollEndOffset);

//     if (enableSnap) {
//       console.log('in end');
//       this._snapScroll(this._scrollEndOffset - this._scrollStartOffset);
//     }
//   }

//   _snapScroll(delta) {
//     this._snapToItem(this._scrollEndActive);
//   }

//   _snapToItem(index, animated = true) {
//     this._scrollOffsetRef =
//       this._positions[index] && this._positions[index].start;
//     this._onScrollTriggered = false;

//     this._scrollTo(this._scrollOffsetRef, animated);
//   }

//   _getSlideInterpolatedStyle(index, animatedValue) {
//     return defaultAnimatedStyles(index, animatedValue, this.props);
//   }
//   _renderItem({item, index}) {
//     const {interpolators} = this.state;
//     const {hasParallaxImages, renderItem} = this.props;

//     const animatedValue = interpolators && interpolators[index];
//     if (!animatedValue && animatedValue !== 0) {
//       return null;
//     }

//     const Component = Animated.View;
//     const animatedStyle = this._getSlideInterpolatedStyle(index, animatedValue);

//     const parallaxProps = hasParallaxImages;
//     return (
//       <Component style={[animatedStyle]}>
//         {renderItem({item, index}, parallaxProps)}
//       </Component>
//     );
//   }
//   _getComponentStaticProps() {
//     const {vertical} = this.props;

//     const specificProps = {
//       renderItem: this._renderItem,
//       keyExtractor: this._getKeyExtractor,
//     };

//     return {
//       ref: c => (this._carouselRef = c),
//       data: this._getCustomData(),
//       horizontal: !vertical,
//       onScroll: this._onScrollHandler,

//       onScrollEndDrag: this._onScrollEndDrag,

//       ...specificProps,
//     };
//   }
//   render() {
//     const props = {
//       ...this._getComponentStaticProps(),
//     };

//     return <AnimatedFlatList {...props} />;
//   }
// }
