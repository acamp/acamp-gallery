import React, { createRef } from 'react';
import classNames from 'classnames';
import { ArrowLeft, ArrowRight } from './utils/arrows';
import PropTypes from 'prop-types';

const SWIPER_MIN_DISTANCE = 50;

class GallerySlider extends React.PureComponent {
  swipeStart = 0;
  transition = null;

  constructor(props, context) {
    super(props, context);
    this.imagesContainerRef = createRef(null);
    this.state = {
      loading: true,
      activeWidth: 500,
      activeImage: props.initialImage,
      offsetLeft: 0,
      isTransitioning: false
    };

    this.calculateOffset = this.calculateOffset.bind(this);
    this.calculateActiveWidth = this.calculateActiveWidth.bind(this);
    this.getImages = this.getImages.bind(this);
    this.getImagesStyles = this.getImagesStyles.bind(this);
    this.handleEndSwipe = this.handleEndSwipe.bind(this);
    this.handleStartSwipe = this.handleStartSwipe.bind(this);
    this.updateActiveImage = this.updateActiveImage.bind(this);
  }

  calculateActiveWidth(callback = () => {}) {
    const { columnGutter, columnWidth, sideColumns } = this.props;
    const imagesContainerWidth = this.imagesContainerRef.current.clientWidth;
    const spaceTakenBySideImages = columnWidth * (sideColumns * 2);
    const spaceTakenByMargins = columnGutter * (sideColumns * 2);
    const activeWidth = imagesContainerWidth - spaceTakenBySideImages - spaceTakenByMargins;
    this.setState({ activeWidth }, callback);
  }

  calculateOffset() {
    const { activeImage } = this.state;
    const { columnWidth, columnGutter } = this.props;
    this.setState({ offsetLeft: -(columnWidth + columnGutter) * activeImage });
  }

  updateActiveImage(index) {
    const { activeOnHover } = this.props;
    if (!activeOnHover) {
      this.setState({ activeImage: index });
      return;
    }
    const { isTransitioning } = this.state;
    if (isTransitioning) return;
    this.setState({ activeImage: index, isTransitioning: true }, () => {
      this.transition = setTimeout(() => {
        this.setState({ isTransitioning: false });
      }, 1000);
    });
  }

  componentDidMount() {
    this.setState({ loading: false });
    this.calculateActiveWidth(() => {
      this.calculateOffset();
    });
  }

  componentWillUnmount() {
    clearTimeout(this.transition);
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeImage } = this.state;
    if (prevProps !== this.props) {
      this.calculateActiveWidth(() => {
        this.calculateOffset();
      });
    } else if (prevState.activeImage != activeImage) {
      this.calculateOffset();
    }
  }

  handleStartSwipe(event) {
    event.stopPropagation();

    event.target.setPointerCapture(event.pointerId);
    this.swipeStart = event.pageX;
  }

  handleEndSwipe(event) {
    const { images } = this.props;
    const { activeImage } = this.state;
    event.stopPropagation();

    event.target.setPointerCapture(event.pointerId);
    const swipeEnd = event.pageX;

    if (swipeEnd - this.swipeStart > SWIPER_MIN_DISTANCE) {
      if (activeImage > 0) this.updateActiveImage(activeImage - 1); // Right
    } else if (swipeEnd - this.swipeStart < -SWIPER_MIN_DISTANCE) {
      if (activeImage < images.length - 1) this.updateActiveImage(activeImage + 1); // Left
    } else {
      const imageId = parseInt(event?.target?.id); // Click
      if (imageId >= 0) this.updateActiveImage(imageId);
    }

    this.swipeStart = null;
  }

  getImagesStyles({ src, isActive, bgOffset }) {
    const { columnGutter, containImage, columnWidth } = this.props;
    const { offsetLeft, activeWidth } = this.state;

    const width = isActive ? activeWidth : columnWidth;
    const style = {
      backgroundImage: `url(${src})`,
      minWidth: `${width}px`,
      maxWidth: `${width}px`,
      width: `${width}px`,
      margin: `0px ${columnGutter / 2}px`,
      transform: `translateX(${offsetLeft}px)`
    };

    if (bgOffset) style.backgroundPosition = bgOffset;
    if (containImage !== GallerySlider.CONTAIN_OFF) {
      if (containImage === GallerySlider.CONTAIN) style.backgroundSize = 'contain';
      if (containImage === GallerySlider.CONTAIN_ACTIVE_IMAGE && isActive)
        style.backgroundSize = 'contain';
    }

    return style;
  }

  getImages(image, index) {
    const { activeOnHover } = this.props;
    const { activeImage } = this.state;
    const isActive = activeImage === index;
    return (
      <div
        onMouseOver={activeOnHover ? () => this.updateActiveImage(index) : null}
        className={classNames('gallery-image')}
        style={this.getImagesStyles({
          src: image,
          isActive
        })}
        key={index}
        id={index}
      />
    );
  }

  getSideColumns(image, isFirstImage) {
    const { sideColumns } = this.props;

    const getBgOffset = (index) => {
      let offset = (50 / sideColumns) * index;
      if (!isFirstImage) offset += 50;

      return `${offset}%`;
    };

    return Array.from(Array(sideColumns), (_, index) => (
      <div
        className={classNames('gallery-image', 'disabled')}
        style={this.getImagesStyles({
          src: image,
          isActive: false,
          bgOffset: getBgOffset(index)
        })}
        key={index * sideColumns}
      />
    ));
  }

  render() {
    const { loading, activeImage } = this.state;
    const { images, loaderElement, height, columnWidth, className, navigation } = this.props;

    const swipeHandlers = {
      onPointerDown: this.handleStartSwipe,
      onPointerUp: this.handleEndSwipe,
      onTouchStart: this.handleStartSwipe,
      onTouchEnd: this.handleEndSwipe
    };

    const hasMoreThanOneImage = images.length > 1;
    const firstImage = images[0];
    const lastImage = images[images.length - 1];

    let showNavigation = navigation !== false;
    if (showNavigation && !hasMoreThanOneImage) {
      showNavigation = navigation?.showWhenOneImageOrLess;
    }

    if (images.length === 0) return null;
    return (
      <>
        <div className={classNames('gallery-slider', className)}>
          {loading && (
            <div className={'loader-container'}>
              {loaderElement ?? <div className={'loader'}>Loading...</div>}
            </div>
          )}
          <div
            className={classNames('gallery-wrapper', loading && 'hidden')}
            style={{ height: `${height}px` }}>
            {showNavigation && (
              <div
                className={classNames(
                  'navigation-btn',
                  navigation.className,
                  activeImage === 0 && 'disabled'
                )}
                onClick={() => this.updateActiveImage(activeImage - 1)}>
                <ArrowLeft width={24} height={24} />
              </div>
            )}
            <div
              className={'images-container'}
              ref={this.imagesContainerRef}
              style={{
                marginLeft: showNavigation ? 16 : null
              }}
              {...swipeHandlers}>
              {this.getSideColumns(firstImage)}
              {images.map(this.getImages)}
              <div
                className={classNames('gallery-image', 'disabled')}
                style={this.getImagesStyles({
                  src: lastImage,
                  width: columnWidth,
                  bgOffset: '75%'
                })}
              />
              {this.getSideColumns(lastImage, true)}
            </div>
            {showNavigation && (
              <div
                className={classNames(
                  'navigation-btn',
                  navigation.className,
                  activeImage === images.length - 1 && 'disabled'
                )}
                style={{ marginLeft: 16 }}
                onClick={() => this.updateActiveImage(activeImage + 1)}>
                <ArrowRight width={24} height={24} />
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

GallerySlider.defaultProps = {
  initialImage: 0,
  height: 460,
  images: [],
  columnGutter: 20,
  columnWidth: 75,
  sideColumns: 2,
  containImage: 'off',
  activeOnHover: false,
  navigation: true
};

GallerySlider.CONTAIN = 'contain';
GallerySlider.CONTAIN_ACTIVE_IMAGE = 'contain_active';
GallerySlider.CONTAIN_OFF = 'off';

GallerySlider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  height: PropTypes.number,
  initialImage: PropTypes.number,
  columnGutter: PropTypes.number,
  columnWidth: PropTypes.number,
  sideColumns: PropTypes.number,
  containImage: PropTypes.oneOf([
    GallerySlider.CONTAIN,
    GallerySlider.CONTAIN_ACTIVE_IMAGE,
    GallerySlider.CONTAIN_OFF
  ]),
  activeOnHover: PropTypes.bool,
  navigation: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      className: PropTypes.string,
      showWhenOneImageOrLess: PropTypes.bool
    })
  ])
};

export default GallerySlider;
