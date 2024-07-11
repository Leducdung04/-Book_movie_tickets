import { Alert, Dimensions, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome6, FontAwesome5} from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ipv4 } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotification, updateNotification } from '../redux/action/todoAction';

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

const NotificationScreen = ({ navigation }) => {
  const  listNotification1 =  useSelector(state=>state.listTodo.ListNotifications);
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(fetchNotification());
    }, [dispatch]);

  const [ListNotification, setListNotification] = useState([]);

  const updateNotification1 = (item) => {
    item.neww=false
    dispatch(updateNotification({ _id: item._id, data: item}))
  }


  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar barStyle="dark-content" />
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 20 }}>Hộp thư</Text>
      <FlatList
        data={listNotification1}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          <TouchableOpacity onPress={() => {item.neww==true??updateNotification1(item)}}>
            <View style={{ flex: 1, width: widthScreen, height: 90, flexDirection: 'row', backgroundColor: item.neww ? "#94d0ee" : '#F5F5F5', padding: 10, alignItems: 'center' }}>
              <View style={{ marginStart: 20, alignItems: 'center', justifyContent: 'center' }}>
                {item.type == 1 ? <FontAwesome6 name="ticket" size={30} color="black" /> : item.type == 2 ? <AntDesign name="qrcode" size={30} color="black" /> : <FontAwesome5 name="newspaper" size={30} color="black" />}
              </View>
              <View style={{ marginStart: 30 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
                <Text>{item.content}</Text>
              </View>
            </View>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({});
