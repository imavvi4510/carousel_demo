import React, {Component} from 'react';
import {Animated, FlatList, ScrollView, View} from 'react-native';

import {
  defaultScrollInterpolator,
  defaultAnimatedStyles,
} from '../utils/animation.js';

const AnimatedFlatList = FlatList
  ? Animated.createAnimatedComponent(FlatList)
  : null;
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default class Carousel extends Component {
  static defaultProps = {
    activeAnimationType: 'timing',
    activeAnimationOptions: null,
    activeSlideAlignment: 'center',
    activeSlideOffset: 20,
    apparitionDelay: 0,
    autoplay: false,
    autoplayDelay: 1000,
    autoplayInterval: 3000,
    callbackOffsetMargin: 5,
    containerCustomStyle: {},
    contentContainerCustomStyle: {},
    enableMomentum: false,
    enableSnap: true,
    firstItem: 0,
    hasParallaxImages: false,
    inactiveSlideOpacity: 0.7,
    inactiveSlideScale: 0.9,
    inactiveSlideShift: 0,
    layout: 'default',
  };

  constructor(props) {
    super(props);

    this.state = {
      hideCarousel: true,
      interpolators: [],
    };

    const initialActiveItem = this._getFirstItem(props.firstItem);
    this._activeItem = initialActiveItem;
    this._previousActiveItem = initialActiveItem;
    this._previousFirstItem = initialActiveItem;
    this._previousItemsLength = initialActiveItem;

    this._initPositionsAndInterpolators = this._initPositionsAndInterpolators.bind(
      this,
    );
    this._renderItem = this._renderItem.bind(this);
    this._onSnap = this._onSnap.bind(this);

    this._onLayout = this._onLayout.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onScrollBeginDrag = props.enableSnap
      ? this._onScrollBeginDrag.bind(this)
      : undefined;
    this._onScrollEnd =
      props.enableSnap || props.autoplay
        ? this._onScrollEnd.bind(this)
        : undefined;
    this._onScrollEndDrag = !props.enableMomentum
      ? this._onScrollEndDrag.bind(this)
      : undefined;
    this._onMomentumScrollEnd = props.enableMomentum
      ? this._onMomentumScrollEnd.bind(this)
      : undefined;
    this._onTouchStart = this._onTouchStart.bind(this);

    this._getKeyExtractor = this._getKeyExtractor.bind(this);

    this._setScrollHandler(props);
  }

  componentDidMount() {
    const apparitionCallback = () => {
      this.setState({hideCarousel: false});
    };

    this._mounted = true;
    this._initPositionsAndInterpolators();

    requestAnimationFrame(() => {
      apparitionCallback();
    });
  }

  _setScrollHandler(props) {
    const scrollEventConfig = {
      listener: this._onScroll,
      useNativeDriver: true,
    };
    this._scrollPos = new Animated.Value(0);
    const argMapping = props.vertical
      ? [{nativeEvent: {contentOffset: {y: this._scrollPos}}}]
      : [{nativeEvent: {contentOffset: {x: this._scrollPos}}}];

    this._onScrollHandler = Animated.event(argMapping, scrollEventConfig);
  }

  _needsScrollView() {}

  _needsRTLAdaptations() {}

  _canLockScroll() {}

  _enableLoop() {}

  _shouldAnimateSlides(props = this.props) {
    const {inactiveSlideOpacity} = props;
    return inactiveSlideOpacity < 1;
  }

  _shouldUseCustomAnimation() {}

  _shouldUseShiftLayout() {}

  _shouldUseStackLayout() {}

  _shouldUseTinderLayout() {}

  _getCustomData(props = this.props) {
    const {data} = props;

    let previousItems = [];
    let nextItems = [];

    return previousItems.concat(data, nextItems);
  }

  _getCustomDataLength(props = this.props) {
    const {data, loopClonesPerSide} = props;
    const dataLength = data && data.length;

    if (!dataLength) {
      return 0;
    }

    return this._enableLoop() ? dataLength + 2 * loopClonesPerSide : dataLength;
  }

  _getCustomIndex(index, props = this.props) {
    const itemsLength = this._getCustomDataLength(props);

    if (!itemsLength || (!index && index !== 0)) {
      return 0;
    }

    return this._needsRTLAdaptations() ? itemsLength - index - 1 : index;
  }

  _getDataIndex(index) {
    const {loopClonesPerSide} = this.props;

    return index - loopClonesPerSide;
  }

  _getPositionIndex(index) {
    const {loop, loopClonesPerSide} = this.props;
    return loop ? index + loopClonesPerSide : index;
  }

  _getFirstItem(index, props = this.props) {
    const {loopClonesPerSide} = props;
    const itemsLength = this._getCustomDataLength(props);

    if (!itemsLength || index > itemsLength - 1 || index < 0) {
      return 0;
    }

    return this._enableLoop() ? index + loopClonesPerSide : index;
  }

  _getWrappedRef() {
    return this._carouselRef;
  }

  _getScrollEnabled() {
    return this._scrollEnabled;
  }

  _setScrollEnabled(scrollEnabled = true) {}

  _getKeyExtractor(item, index) {
    return this._needsScrollView()
      ? `scrollview-item-${index}`
      : `flatlist-item-${index}`;
  }

  _getScrollOffset(event) {
    const {vertical} = this.props;
    return (
      (event &&
        event.nativeEvent &&
        event.nativeEvent.contentOffset &&
        event.nativeEvent.contentOffset[vertical ? 'y' : 'x']) ||
      0
    );
  }

  _getContainerInnerMargin(opposite = false) {
    const {
      sliderWidth,
      sliderHeight,
      itemWidth,
      itemHeight,
      vertical,
    } = this.props;

    return vertical
      ? (sliderHeight - itemHeight) / 2
      : (sliderWidth - itemWidth) / 2;
  }

  _getViewportOffset() {
    const {sliderWidth, sliderHeight, vertical} = this.props;

    return vertical ? sliderHeight / 2 : sliderWidth / 2;
  }

  _getCenter(offset) {
    return offset + this._getViewportOffset() - this._getContainerInnerMargin();
  }

  _getActiveItem(offset) {
    const {activeSlideOffset, swipeThreshold} = this.props;
    const center = this._getCenter(offset);
    const centerOffset = activeSlideOffset || swipeThreshold;

    for (let i = 0; i < this._positions.length; i++) {
      const {start, end} = this._positions[i];
      if (center + centerOffset >= start && center - centerOffset <= end) {
        return i;
      }
    }

    const lastIndex = this._positions.length - 1;
    if (
      this._positions[lastIndex] &&
      center - centerOffset > this._positions[lastIndex].end
    ) {
      return lastIndex;
    }

    return 0;
  }

  _initPositionsAndInterpolators(props = this.props) {
    const {data, itemWidth, itemHeight, scrollInterpolator, vertical} = props;
    const sizeRef = vertical ? itemHeight : itemWidth;

    let interpolators = [];
    this._positions = [];

    this._getCustomData(props).forEach((itemData, index) => {
      const _index = this._getCustomIndex(index, props);
      let animatedValue;

      this._positions[index] = {
        start: index * sizeRef,
        end: index * sizeRef + sizeRef,
      };

      if (!this._shouldAnimateSlides(props)) {
        animatedValue = new Animated.Value(1);
      } else {
        let interpolator;

        interpolator = defaultScrollInterpolator(_index, props);

        animatedValue = this._scrollPos.interpolate({
          ...interpolator,
        });
      }

      interpolators.push(animatedValue);
    });

    this.setState({interpolators});
  }

  _hackActiveSlideAnimation() {}

  _scrollTo(offset, animated = true) {
    const {vertical} = this.props;
    const wrappedRef = this._getWrappedRef();

    const specificOptions = this._needsScrollView()
      ? {
          x: vertical ? 0 : offset,
          y: vertical ? offset : 0,
        }
      : {
          offset,
        };
    const options = {
      ...specificOptions,
      animated,
    };

    wrappedRef.scrollToOffset(options);
  }

  _onScroll(event) {
    const scrollOffset = event
      ? this._getScrollOffset(event)
      : this._currentContentOffset;

    this._currentContentOffset = scrollOffset;
  }

  _onStartShouldSetResponderCapture(event) {
    return this._getScrollEnabled();
  }

  _onTouchStart() {}

  _onScrollBeginDrag(event) {}

  _onScrollEndDrag(event) {
    if (this._carouselRef) {
      this._onScrollEnd && this._onScrollEnd();
    }
  }

  _onMomentumScrollEnd(event) {}

  _onScrollEnd(event) {
    const {enableSnap} = this.props;

    this._scrollEndOffset = this._currentContentOffset;
    this._scrollEndActive = this._getActiveItem(this._scrollEndOffset);

    if (enableSnap) {
      this._snapScroll(this._scrollEndOffset - this._scrollStartOffset);
    }
  }

  _onLayout(event) {
    const {onLayout} = this.props;

    if (onLayout) {
      onLayout(event);
    }
  }

  _snapScroll(delta) {
    this._snapToItem(this._scrollEndActive);
  }

  _snapToItem(index, animated = true) {
    this._scrollOffsetRef =
      this._positions[index] && this._positions[index].start;
    this._onScrollTriggered = false;

    this._scrollTo(this._scrollOffsetRef, animated);
  }

  _onBeforeSnap(index) {}

  _onSnap(index) {}

  _getSlideInterpolatedStyle(index, animatedValue) {
    return defaultAnimatedStyles(index, animatedValue, this.props);
  }

  _renderItem({item, index}) {
    const {interpolators} = this.state;
    const {hasParallaxImages, renderItem, slideStyle, vertical} = this.props;

    const animatedValue = interpolators && interpolators[index];

    if (!animatedValue && animatedValue !== 0) {
      return null;
    }

    const animate = this._shouldAnimateSlides();
    const Component = animate ? Animated.View : View;
    const animatedStyle = animate
      ? this._getSlideInterpolatedStyle(index, animatedValue)
      : {};

    const parallaxProps = hasParallaxImages;

    const mainDimension = vertical;
    const specificProps = this._needsScrollView();

    return (
      <Component
        style={[mainDimension, slideStyle, animatedStyle]}
        pointerEvents={'box-none'}
        {...specificProps}>
        {renderItem({item, index}, parallaxProps)}
      </Component>
    );
  }

  _getComponentStaticProps() {
    const {hideCarousel} = this.state;
    const {
      containerCustomStyle,
      contentContainerCustomStyle,
      keyExtractor,
      sliderWidth,
      sliderHeight,
      style,
      vertical,
    } = this.props;

    const containerStyle = [
      containerCustomStyle || style || {},
      hideCarousel ? {opacity: 0} : {},
      vertical
        ? {height: sliderHeight, flexDirection: 'column'}
        : {
            width: sliderWidth,
            flexDirection: this._needsRTLAdaptations() ? 'row-reverse' : 'row',
          },
    ];
    const contentContainerStyle = [
      vertical
        ? {
            paddingTop: this._getContainerInnerMargin(),
            paddingBottom: this._getContainerInnerMargin(true),
          }
        : {
            paddingLeft: this._getContainerInnerMargin(),
            paddingRight: this._getContainerInnerMargin(true),
          },
      contentContainerCustomStyle || {},
    ];

    const specificProps = !this._needsScrollView()
      ? {
          // extraData: this.state,
          renderItem: this._renderItem,
          numColumns: 1,
          keyExtractor: keyExtractor || this._getKeyExtractor,
        }
      : {};

    return {
      ref: c => (this._carouselRef = c),
      data: this._getCustomData(),
      style: containerStyle,
      contentContainerStyle: contentContainerStyle,
      horizontal: !vertical,
      scrollEventThrottle: 1,
      onScroll: this._onScrollHandler,
      onScrollBeginDrag: this._onScrollBeginDrag,
      onScrollEndDrag: this._onScrollEndDrag,
      onMomentumScrollEnd: this._onMomentumScrollEnd,

      onStartShouldSetResponderCapture: this._onStartShouldSetResponderCapture,
      onTouchStart: this._onTouchStart,
      onTouchEnd: this._onScrollEnd,
      onLayout: this._onLayout,
      ...specificProps,
    };
  }

  render() {
    const {data, renderItem, useScrollView} = this.props;

    if (!data || !renderItem) {
      return null;
    }

    const props = {
      ...this.props,
      ...this._getComponentStaticProps(),
    };

    const ScrollViewComponent =
      typeof useScrollView === 'function' ? useScrollView : AnimatedScrollView;

    return this._needsScrollView() ? (
      <ScrollViewComponent {...props}>
        {this._getCustomData().map((item, index) => {
          return this._renderItem({item, index});
        })}
      </ScrollViewComponent>
    ) : (
      <AnimatedFlatList {...props} />
    );
  }
}
