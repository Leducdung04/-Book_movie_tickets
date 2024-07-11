import { StyleSheet, Text, View, ImageBackground, Dimensions, TouchableOpacity, Animated, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Slideshow from '../Componert/Slideshow';
import { Uri_get_list_movide } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos } from '../redux/action/todoAction';

const heightScreen = Dimensions.get('window').height;
const widthScreen = Dimensions.get('window').width;

const SuatChieu = ({navigation}) => {
  const  listTodo =  useSelector(state=>state.listTodo.listMovide);
   const dispatch = useDispatch();

   useEffect(() => {
       dispatch(fetchTodos());
     }, [dispatch]);

  const arr = [
    'https://i.imgur.com/JHPSlQW.jpeg',
    'https://i.imgur.com/eQ3qwad.jpeg',
    'https://i.imgur.com/dyEwy5F.jpeg',
    'https://i.imgur.com/wxiIp9Z.jpeg',
    'https://i.imgur.com/J9AnryK.jpeg',
    'https://i.imgur.com/C5r0cSF.jpeg',
    'https://i.imgur.com/7p9PQPw.jpeg',
    'https://i.imgur.com/UMGrsI5.jpeg'
  ];

  // const [ListMovide, setListMovide] = useState([
  //   // 'https://i.imgur.com/IazjEx5.jpeg',
  //   // 'https://i.imgur.com/npOxSal.jpeg',
  //   // 'https://i.imgur.com/uWvE6o3.jpeg',
  //   // 'https://i.imgur.com/EFTKfAo.jpeg',
  //   // 'https://i.imgur.com/Qe5cDMk.jpeg',
  //   // 'https://i.imgur.com/F1rtlsy.jpeg',
  //   // 'https://i.imgur.com/YuOqvGg.jpeg',
  //   // 'https://i.imgur.com/0sc5lbA.jpeg',
  //   // 'https://i.imgur.com/P80RsK0.jpeg',
  //   // 'https://i.imgur.com/AQYhfat.jpeg',
  //   // 'https://i.imgur.com/UqxRE3W.jpeg',
  //   // 'https://i.imgur.com/1UuRY6I.jpeg',
  //   // 'https://i.imgur.com/zL92lMV.jpeg',
  //   // 'https://i.imgur.com/s8bASkI.jpeg',
  //   // 'https://i.imgur.com/xOfMmAE.jpeg',
  //   // 'https://i.imgur.com/vDLWOie.jpeg',
  //   // 'https://i.imgur.com/qb4rk03.jpeg',
  //   // 'https://i.imgur.com/5ClMvGj.jpeg',
  //   // 'https://i.imgur.com/yLd9Rat.jpeg',
  //   // 'https://i.imgur.com/SA5sQ2C.jpeg'
  // ]);
  
  const [TextTab, setTextTab] = useState(1);
  const scrollX = useRef(new Animated.Value(0)).current;
  const ITEM_WIDTH = widthScreen * 0.62;
  const SPACER_ITEM_SIZE = (widthScreen - ITEM_WIDTH) / 2;

  const MovieData = [{ key: 'left-spacer' },...listTodo, { key: 'right-spacer' }];

  return (
    <View style={styles.container}>
      <ImageBackground
        style={{ flex: 1, width: widthScreen, height: heightScreen }}
        source={{ uri: 'https://static2.vieon.vn/vieplay-image/poster_v4/2023/09/13/eigw3j4k_660x946-penguinsofmadagascar3cbe24776cd97bbfa46f036ee3feea4c.png' }}>
        <Animated.ScrollView style={{backgroundColor:'rgba(0, 0, 0, 0.4)'}}>
          <View style={{ height: 150, margin: 15, marginTop: 100 }}>
            <Slideshow images={arr} />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity onPress={() => { setTextTab(1) }}>
              <Text style={TextTab == 1 ? styles.textTab1 : styles.textTab}>Đang chiếu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setTextTab(2) }}>
              <Text style={TextTab == 2 ? styles.textTab1 : styles.textTab}>Đặc biệt</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setTextTab(3) }}>
              <Text style={TextTab == 3 ? styles.textTab1 : styles.textTab}>Sắp chiếu</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Animated.FlatList
              style={{ marginTop: 30 }}
              data={MovieData}
              horizontal={true}
              pagingEnabled={true}
              scrollEventThrottle={16}
              bounces={false}
              contentContainerStyle={{ alignItems: 'center' }}
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_WIDTH}
              decelerationRate="fast"
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true }
              )}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                if (item.key && item.key === 'left-spacer' || item.key === 'right-spacer') {
                  return <View style={{ width: SPACER_ITEM_SIZE }} />;
                }
                const inputRange = [
                  (index - 2) * ITEM_WIDTH,
                  (index - 1) * ITEM_WIDTH,
                  index * ITEM_WIDTH,
                ];
                const scale = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.8, 1, 0.8],
                  extrapolate: 'clamp'
                });
                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.7, 1, 0.7],
                  extrapolate: 'clamp'
                });
                return (
                  <Animated.View style={{ width: ITEM_WIDTH, opacity, transform: [{ scale }] }}>
                      <TouchableOpacity onPress={()=>{navigation.navigate("Movide", { data: item })}}>
                        <Image source={{ uri: item.img }} style={{ width: ITEM_WIDTH, height: 380, borderRadius: 15 }} />
                      </TouchableOpacity>
                    </Animated.View>
                );
              }}
            />
          </View>
        </Animated.ScrollView>
      </ImageBackground>
    </View>
  );
};

export default SuatChieu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textTab: {
    color: 'white',
    fontSize: 20,
  },
  textTab1: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  }
});



// import { StyleSheet, Text, View, ImageBackground, Dimensions, TouchableOpacity, Animated, Image, FlatList } from 'react-native';
// import React, { useRef, useState } from 'react';
// import Slideshow from '../Componert/Slideshow';

// const heightScreen = Dimensions.get('window').height;
// const widthScreen = Dimensions.get('window').width;

// const SuatChieu = () => {
//   const arr = [
//     'https://i.imgur.com/JHPSlQW.jpeg',
//     'https://i.imgur.com/eQ3qwad.jpeg',
//     'https://i.imgur.com/dyEwy5F.jpeg',
//     'https://i.imgur.com/wxiIp9Z.jpeg',
//     'https://i.imgur.com/J9AnryK.jpeg',
//     'https://i.imgur.com/C5r0cSF.jpeg',
//     'https://i.imgur.com/7p9PQPw.jpeg',
//     'https://i.imgur.com/UMGrsI5.jpeg'
//   ];

//   const [ListMovide, setListMovide] = useState([
//     'https://i.imgur.com/IazjEx5.jpeg',
//     'https://i.imgur.com/npOxSal.jpeg',
//     'https://i.imgur.com/uWvE6o3.jpeg',
//     'https://i.imgur.com/EFTKfAo.jpeg',
//     'https://i.imgur.com/Qe5cDMk.jpeg',
//     'https://i.imgur.com/F1rtlsy.jpeg',
//     'https://i.imgur.com/YuOqvGg.jpeg',
//     'https://i.imgur.com/0sc5lbA.jpeg',
//     'https://i.imgur.com/P80RsK0.jpeg',
//     'https://i.imgur.com/AQYhfat.jpeg',
//     'https://i.imgur.com/UqxRE3W.jpeg',
//     'https://i.imgur.com/1UuRY6I.jpeg',
//     'https://i.imgur.com/zL92lMV.jpeg',
//     'https://i.imgur.com/s8bASkI.jpeg',
//     'https://i.imgur.com/xOfMmAE.jpeg',
//     'https://i.imgur.com/vDLWOie.jpeg',
//     'https://i.imgur.com/qb4rk03.jpeg',
//     'https://i.imgur.com/5ClMvGj.jpeg',
//     'https://i.imgur.com/yLd9Rat.jpeg',
//     'https://i.imgur.com/SA5sQ2C.jpeg'
//   ]);

//   const [TextTab, setTextTab] = useState(1);
//   const scrollX = useRef(new Animated.Value(0)).current;
//   const ITEM_WIDTH = widthScreen * 0.62;
//   const SPACER_ITEM_SIZE = (widthScreen - ITEM_WIDTH) / 2;

//   const MovieData = [{ key: 'left-spacer' }, ...ListMovide, { key: 'right-spacer' }];

//   return (
//     <View style={styles.container}>
//       <ImageBackground
//         style={{ flex: 1, width: widthScreen, height: heightScreen }}
//         source={{ uri: 'https://static2.vieon.vn/vieplay-image/poster_v4/2023/09/13/eigw3j4k_660x946-penguinsofmadagascar3cbe24776cd97bbfa46f036ee3feea4c.png' }}>
//         <Animated.ScrollView>
//           <View style={{ height: 150, backgroundColor: 'red', margin: 15, marginTop: 100 }}>
//             <Slideshow images={arr} />
//           </View>
//           <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
//             <TouchableOpacity onPress={() => { setTextTab(1) }}>
//               <Text style={TextTab == 1 ? styles.textTab1 : styles.textTab}>Đang chiếu</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => { setTextTab(2) }}>
//               <Text style={TextTab == 2 ? styles.textTab1 : styles.textTab}>Đặc biệt</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => { setTextTab(3) }}>
//               <Text style={TextTab == 3 ? styles.textTab1 : styles.textTab}>Sắp chiếu</Text>
//             </TouchableOpacity>
//           </View>
//           <View>
//             <Animated.FlatList
//               style={{ marginTop: 30 }}
//               data={MovieData}
//               horizontal={true}
//               pagingEnabled={true}
//               scrollEventThrottle={16}
//               bounces={false}
//               contentContainerStyle={{ alignItems: 'center' }}
//               showsHorizontalScrollIndicator={false}
//               snapToInterval={ITEM_WIDTH}
//               decelerationRate="fast"
//               onScroll={Animated.event(
//                 [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//                 { useNativeDriver: true }
//               )}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={({ item, index }) => {
//                 if (item.key && (item.key === 'left-spacer' || item.key === 'right-spacer')) {
//                   return <View style={{ width: SPACER_ITEM_SIZE }} />;
//                 }
//                 const inputRange = [
//                   (index - 2) * ITEM_WIDTH,
//                   (index - 1) * ITEM_WIDTH,
//                   index * ITEM_WIDTH,
//                 ];
//                 const translateY = scrollX.interpolate({
//                   inputRange,
//                   outputRange: [50, 0, 50],
//                   extrapolate: 'clamp'
//                 });
//                 const opacity = scrollX.interpolate({
//                   inputRange,
//                   outputRange: [0.7, 1, 0.7],
//                   extrapolate: 'clamp'
//                 });
//                 const rotateY = scrollX.interpolate({
//                   inputRange,
//                   outputRange: ['-30deg', '0deg', '30deg'],
//                   extrapolate: 'clamp'
//                 });
//                 return (
//                   <Animated.View style={{ width: ITEM_WIDTH, opacity, transform: [{ translateY }, { rotateY }] }}>
//                     <Image source={{ uri: item }} style={{ width: ITEM_WIDTH, height: 380, borderRadius: 15 }} />
//                   </Animated.View>
//                 );
//               }}
//             />
//           </View>
//         </Animated.ScrollView>
//       </ImageBackground>
//     </View>
//   );
// };

// export default SuatChieu;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   textTab: {
//     color: 'white',
//     fontSize: 20,
//   },
//   textTab1: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: 'bold'
//   }
// });


