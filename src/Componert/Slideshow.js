import React, { useState, useEffect, useRef } from 'react';
import { View, ImageBackground, ScrollView, Dimensions, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const widthScreen =Dimensions.get('window').width
const Slideshow = ({ images, height }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const dotContainerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      scrollToNextImage();
    }, 3000); // Thay đổi số 2000 thành số thời gian bạn muốn cho mỗi lượt chuyển đổi

    return () => clearInterval(interval);
  }, [currentImageIndex]);

  const scrollToNextImage = () => {
    if (currentImageIndex === images.length - 1) {
      return; // Không làm gì nếu đã ở ảnh cuối cùng
    }
    scrollViewRef.current.scrollTo({
      x: (widthScreen-30) * (currentImageIndex + 1),
     // Dimensions.get('window').width
      animated: true,
    });
    const nextIndex = currentImageIndex + 1;
    setCurrentImageIndex(nextIndex);
    scrollToDot(nextIndex);
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const screenWidth = widthScreen-30;
    const newIndex = Math.floor(contentOffsetX / screenWidth);
    setCurrentImageIndex(newIndex);
    scrollToDot(newIndex);
  };

  const scrollToDot = (index) => {
    const dotContainerWidth = Dimensions.get('window').width;
    const dotWidth = 20;
    const offsetX = index * dotWidth - (dotContainerWidth - dotWidth) / 2;
    dotContainerRef.current.scrollTo({
      x: offsetX,
      animated: true,
    });
  };

  return (
    <View style={{height:180}}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={200}
      >
        {images.map((image, index) => (
          <View key={index}>
            <Image
              source={{ uri: image }}
              style={{width:widthScreen-30, height:150 ,borderRadius: 15 }}
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.dotContainer}>
        <ScrollView
          ref={dotContainerRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dotScrollContainer}
        >
          {images.map((_, index) => (
            <TouchableOpacity key={index} style={[styles.dot, index === currentImageIndex && styles.activeDot]} onPress={() => scrollToDot(index)} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dotContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotScrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default Slideshow;
