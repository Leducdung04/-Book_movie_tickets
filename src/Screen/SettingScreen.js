import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityBase,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";

import { Uri_listTicketByUser,Uri_get_movies_by_id,Ipv4, Uri_BillsbyUser } from "../api/index";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;
const SettingScreen = ({ navigation }) => {
  
  const [status, setS] = useState(0);
  const [t1, sett1] = useState(0);
  const [modalThanhToan, setmodalThanhToan] = useState(false)
  const [Pay, setPay] = useState(null)
  const [ListTicket, setListTicket] = useState([]);
  const [ListFavourti, setListFavourti] = useState([])
  const [ListMovie, setListMovie] = useState([])
  const [ListBill, setListBill] = useState([])

  const [ListHienThi, setListHienThi] = useState([])
  const [TaiKhoan, setTaiKhoan] = useState(null);
   const [StatusGetData, setStatusGetData] = useState(0)

   const [IdUpdateBill, setIdUpdateBill] = useState(null)
   const [anhThanhToan, setanhThanhToan] = useState(null);
  const [ImgQR, setImgQR] = useState(null);

  const [TicketNumber, setTicketNumber] = useState(0)


  const clearAccount = async () => {
    try {
      await AsyncStorage.removeItem("Account");
      console.log("Đã xóa tất cả dữ liệu thành công");
      setTaiKhoan(null);
      navigation.navigate("Trang chủ");
    } catch (error) {
      console.error("Lỗi khi xóa dữ liệu:", error);
    }
  };
  const LoginOut = () => {
    TaiKhoan === null
      ? navigation.navigate("Login")
      : Alert.alert("Bạn có muốn đăng xuất không ?", "", [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => clearAccount(),
          },
        ]);
  };
  const chooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      setanhThanhToan(result.assets[0].uri);
      setImgQR({
        uri: result.assets[0].uri,
        type: result.assets[0].mimeType || "image/jpeg",
        name: result.assets[0].fileName || result.assets[0].uri.split("/").pop(),
      });
    }
  };
  const UpdateBill=async()=>{
    const date = new Date();
    const day = date.getDate(); // Ngày tính từ 1-31
    const month = date.getMonth() + 1; // Tháng tính từ 0-11, cần +1 để thành 1-12
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const dulieuUpdate = new FormData();
    if(ImgQR==null){
      Alert.alert("Vui lòng chọn ảnh để thanh toán")
      return false
    }
     
    dulieuUpdate.append("date", `${day}/${month}/${year}`);
    dulieuUpdate.append("time", `${hours}:${minutes}`);
    dulieuUpdate.append("id_uer","663b1b0095121af8cf26fe17");
    dulieuUpdate.append("status", 4);
    dulieuUpdate.append("img", {
      uri: ImgQR.uri,
      type: ImgQR.type,
      name: ImgQR.name,
    });

    try {
      const response = await fetch(`http://${Ipv4}:3000/api/update-bills/${IdUpdateBill}`, {
        method: "PUT",
        body: dulieuUpdate,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.ok) {
        Alert.alert("Phản hồi thành công")
        setmodalThanhToan(false)
        getListBillByAccount()
      } else {
        Alert.alert("Xảy ra lỗi vui lòng thử lại")
        console.log("Failed to add bills", response.status);
      }
    } catch (error) {
      console.log("Lỗi khi orderTicketByPay", error);
      if (error.message === "Network Error") {
        Alert.alert(
          "Lỗi mạng",
          "Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối mạng và thử lại."
        );
      } else {
        Alert.alert("Lỗi", error.message);
      }
    }
  }
  const getListBillByAccount = async () => {
    try {
      const response = await fetch(`http://${Ipv4}:3000/api/get-list-bills-by-user/${TaiKhoan._id}`);
      console.log("uri bill",`http://${Ipv4}:3000/api/get-list-bills-by-user/${TaiKhoan._id}`)
      const data = await response.json();
      setListBill(data.data);
      console.log("Lấy dữ liệu Bills thành công" + JSON.stringify(data.data));
    } catch (error) {
      console.log('Lỗi khi gọi API get Bill:', error);
      // Xử lý lỗi ở đây, có thể đặt trạng thái hoặc hiển thị thông báo lỗi
    }
  };

  const getListTicketByAccount = async () => {
    try {
      const response = await fetch(`${Uri_listTicketByUser}/${TaiKhoan._id}`);
      if (!response.ok) {
        throw new Error('Lỗi khi gọi API');
      }
      const data = await response.json();
      setListTicket(data.data);
      console.log("Lấy dữ liệu listTicket thành công" + JSON.stringify(data.data));
      setTicketNumber(ListTicket.length)
    } catch (error) {
      console.log('Lỗi khi gọi API:', error.message);
      // Xử lý lỗi ở đây, có thể đặt trạng thái hoặc hiển thị thông báo lỗi
    }
  };

 const ItemTicket=({item})=>{
  const [movideTicket, setmovideTicket] = useState(null)
  const getmovieTicket =async()=>{
    try {
    const response = await fetch(`${Uri_get_movies_by_id}/${item.id_showtimes.id_movie}`)
    const data = await response.json()
    setmovideTicket(data)
    console.log('JJJ '+movideTicket)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
      getmovieTicket()
  }, [])
  
  return  (<View style={{flex:1,marginTop:10,width:(widthScreen/2),height:(widthScreen/2)*1.8,alignItems:'center'}}>
    <ImageBackground style={{flex:1,width:(widthScreen/2)-5,height:(widthScreen/2)*1.8,alignItems:'center'}} source={require('../img/Subtract.png')}>
      <View style={{flex:2.8}}>
        <View style={{flex:1,marginHorizontal:5}}>
              <Text style={{textAlign:'center',marginTop:10,color:'#999999',fontWeight:'bold'}}>Vé Phim</Text>
              <Image style={{width:45,height:45,position:'absolute',end:0,top:0}} source={require('../img/logo.png')}/>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:20}}>
                   <Text style={{marginTop:10,color:'#999999',fontWeight:'bold'}}>{movideTicket&&movideTicket.name? movideTicket.name:'Tên phim'}</Text>
                   
                      <View style={{width:40,height:25,borderRadius:10,backgroundColor:'#94d0ee',marginTop:10,alignItems:'center',justifyContent:'center'}}>
                       <Text style={{color:'white',fontWeight:'bold'}}>{item.id_showtimes.room}</Text>
                      </View>
                     
              </View>
              {item.status==1?(<Text style={{color:'red',fontWeight:'bold',marginVertical:5}}>Chưa thanh toán</Text>):(<Text style={{marginVertical:5,color:'#999999',fontWeight:'bold'}}>Đã thanh toán</Text>)}
              
              <Text style={{color:'#999999',fontWeight:'bold',marginVertical:5}}>{item.pay}</Text>
              
        </View>
        <View style={{flex:1,}}>
               <View style={{flex:1}}>
                
               </View>
               <View style={{flex:1,flexDirection:'row',alignContent:'space-between',justifyContent:"space-around",width:(widthScreen/2)-20}}>
                    <View>
                         <Text style={{color:'#999999',marginBottom:5}}>Date</Text>
                         <Text>{item.id_showtimes.date.substring(0,5)}</Text>
                    </View>
                    <View style={{width:1,height:'90%',backgroundColor:'#999999',}}></View>
                    <View>
                         <Text style={{color:'#999999',marginBottom:5}}>Hour</Text>
                         <Text>{item.id_showtimes.time}</Text>
                    </View>
                    <View style={{width:1,height:'90%',backgroundColor:'#999999',}}></View>
                    <View>
                         <Text style={{color:'#999999',marginBottom:5}}>Seats</Text>
                         <Text>{item.chair}</Text>
                    </View>
               </View>
        </View>
      </View>
      <Image style={{width:(widthScreen/2)-30,height:10}} source={require('../img/Vector 8.png')} />
      <View style={{flex:1}}>
      <View style={{flex:1,paddingHorizontal:10,justifyContent:'center'}}>
           <Text style={{color:'#999999',marginBottom:5}}>Booking Code</Text>
           <Text>{item._id}</Text>
      </View>
      </View>
      <Image style={{width:(widthScreen/2)-40,height:50,marginBottom:20}} source={require('../img/Group 8.png')} />
     </ImageBackground>  

   </View>)
 }

 const ItemMovie=({item})=>{
  const [Phim, setPhim] = useState(null)
  const getmovie =async()=>{
    try {
    const response = await fetch(`${Uri_get_movies_by_id}/${item.id_showtimes.id_movie}`)
    const data = await response.json()
    setPhim(data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
      getmovie()
  }, [])
  
     return(<View style={{flex:1,height:150,borderRadius:10,backgroundColor:'white',margin:10,alignItems:'center',paddingHorizontal:20,flexDirection:'row'}}>
              <Image source={{uri:Phim&&Phim.img? Phim.img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlLkt9BmpUMbRD0A6P4Cjdbshfb4FTDMQoew&s'}} style={{width:100,height:120,borderRadius:5}}/>
              <View style={{flex:1,height:'80%',margin:20,justifyContent:'space-around'}}><Text style={{marginStart:20,color:'#999999',fontWeight:'bold'}}>{Phim&&Phim.name? Phim.name:'Tên phim'}</Text>
              <Text style={{marginStart:20}} numberOfLines={3}>{Phim&&Phim.content? Phim.content:'content'}</Text>
              <Text style={{marginStart:20}} numberOfLines={2}>Diễn viên : {Phim&&Phim.performer? Phim.performer:'diễn viên'}</Text>
              <Text style={{marginStart:20}} numberOfLines={2}>Đạo diễn : {Phim&&Phim.director? Phim.director:'Đạo diễn'}</Text>
              </View>
              
     </View>)
 }
 const ItemBills=({item})=>{
   const url = item.img[0]? item.img[0].replace('localhost', Ipv4) : null;
  console.log("ảnh đây ",item.img[0])
      return(
      <TouchableOpacity onPress={()=>{navigation.navigate("HoaDonChiTet",{data:item._id})}}>
      <ImageBackground  source={require('../img/background_bill.png')}
                              style={{height:200,width:widthScreen-20,margin:10}}
             >
               <Text style={{marginStart:70,marginTop:20}}>Booking id : {item._id}</Text>
             <View style={{marginStart:70,width:320,flexDirection:"row"}}>
               <View style={{flex:1.5}}>
              
               <Text>Time : {item.time} - {item.date}</Text>
               <Text>Số lượng vé : {item.Number_of_tickets}</Text>
               <Text>Tổng tiền : {item.payment_amount.toLocaleString()} VND</Text>
               <Text>Phương thức : {item.Payment_methods==1?"Thanh toán tại quầy":"Chuyển khoản"}</Text>
               <Text >Trạng thái :<Text style={{color:item.status==0?"blue": item.status==1?"red":item.status==4?"orange":"green",fontWeight:'bold'}}> {item.status==0? "Chờ xác nhận":item.status==1?"Chưa thanh toán":item.status==4?"Xác nhận lại":"Đã thanh toán"}</Text></Text>
               {item.status===1 &&
                    <TouchableOpacity  onPress={()=>{setmodalThanhToan(true);setIdUpdateBill(item._id);setPay({ngay:`${item.time} - ${item.date}`,sl:item.Number_of_tickets,gia:item.payment_amount})}}
                    style={{marginTop:10,height:40,backgroundColor:'blue',justifyContent:'center',alignItems:"center",borderRadius:15}}>
                          <Text style={{color:'white',fontWeight:'bold'}}>Thanh toán ngay</Text>
                    </TouchableOpacity>
                }
               </View>
              
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
               <Image source={{ uri:url?url:'https://cdn-icons-png.flaticon.com/128/4064/4064372.png'}} style={{ width: url? 110:60, height:url? 140:60 }} />
               </View>
              
               {/* (item.Payment_methods==1?<Text>Thanh toán tại quầy</Text>:<Text>Chuyển khoản</Text>) */}
               
             </View>

            </ImageBackground></TouchableOpacity>)
 }
 const ItemList=({item})=>{
        switch(t1){
           case 0: return <ItemBills item={item}/>
           case 1: return  <ItemTicket item={item}/>
           case 2: return  <ItemMovie item={item}/>
          //  case 3: return (<View style={{width:100,height:100,backgroundColor:'blue'}}></View>);
           default : return false
        }
 }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        const accountDataString = await AsyncStorage.getItem("Account");
        setTaiKhoan(await JSON.parse(accountDataString));
        setStatusGetData(1)
        console.log("data Acount  " + TaiKhoan);
      } catch (error){
        console.log(error);
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if(StatusGetData===1){
      getListBillByAccount()
      getListTicketByAccount();
      
    }
  },[StatusGetData])
  
  const BodyList=()=>{
    switch(t1){
      case 0: return (<FlatList
        style={{ flex: 1,backgroundColor:'#eeeeee'}}
        data={ListHienThi}
        renderItem={({item})=><ItemList item={item}/>}
      />);
      case 1: return (<FlatList
        style={{ flex: 1,backgroundColor:'#eeeeee'}}
        data={ListHienThi}
        renderItem={({item})=><ItemList item={item}/>}
        numColumns={2}
      />);
      case 2: return (<FlatList
        style={{ flex: 1,backgroundColor:'#eeeeee'}}
        data={ListHienThi}
        renderItem={({item})=><ItemList item={item}/>}
      />);
      // case 3: return (<View style={{width:100,height:100,backgroundColor:'blue'}}></View>);
      default : return false
   }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar barStyle={"default"} />
      <View style={{ flex: 1.1}}>
        <Text style={{ textAlign: "center", fontSize: 18, marginTop: 10 }}>
          {TaiKhoan && TaiKhoan.name ? TaiKhoan.name : "Name Account"}
        </Text>
        <MaterialIcons
          style={{ textAlign: "center", marginTop: 10 }}
          name="account-circle"
          size={80}
          color="#999999"
        />
        <TouchableOpacity style={{ position: "absolute", end: 10, top: -5 }}>
          <Image
            source={require("../img/logo.png")}
            style={{ width: 50, height: 50 }}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ width: 120, height: 50, justifyContent: "center" }}>
            <Text
              style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}
            >
              {TicketNumber}
            </Text>
            <Text style={{ textAlign: "center", fontSize: 14 }}>Vé đặt</Text>
          </View>
          <View
            style={{
              width: 1,
              height: 30,
              justifyContent: "center",
              backgroundColor: "gray",
            }}
          ></View>
          <View style={{ width: 120, height: 50, justifyContent: "center" }}>
            <Text
              style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}
            >
              12
            </Text>
            <Text style={{ textAlign: "center", fontSize: 14 }}>Thích</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <TouchableOpacity>
            <View
              style={{
                width: 120,
                height: 50,
                backgroundColor: "#eeeeee",
                margin: 5,
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              <Text style={{ textAlign: "center", fontSize: 16 }}>
                Sửa hồ sơ
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => LoginOut()}>
            <View
              style={{
                width: 120,
                height: 50,
                backgroundColor: "#eeeeee",
                margin: 5,
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              {TaiKhoan === null ? (
                <Text style={{ textAlign: "center", fontSize: 16 }}>
                  Đăng nhập
                </Text>
              ) : (
                <Text style={{ textAlign: "center", fontSize: 16 }}>
                  Đăng xuất
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 2 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {t1 === 0 ? (
            <TouchableOpacity>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    marginHorizontal: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="qrcode" size={24} color="black" />
                </View>
                <View
                  style={{ height: 2, width: 50, backgroundColor: "black" }}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() =>{ sett1(0);getListBillByAccount();setListHienThi(ListBill)}} >
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    marginHorizontal: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="qrcode" size={24} color="#999999" />
                </View>
              </View>
            </TouchableOpacity>
          )}

          {t1 === 1 ? (
            <TouchableOpacity onPress={()=>{
              sett1(1)
              getListTicketByAccount();
             // setListHienThi(ListTicket)
            }}>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    marginHorizontal: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="ticket-outline" size={28} color="black" />
                </View>
                <View
                  style={{ height: 2, width: 50, backgroundColor: "black" }}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() =>{ sett1(1);setListHienThi(ListTicket)}}>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    marginHorizontal: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="ticket-outline" size={28} color="#999999" />
                </View>
              </View>
            </TouchableOpacity>
          )}
          {t1 === 2 ? (
            <TouchableOpacity

            >
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    marginHorizontal: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="movie-open-play-outline"
                    size={28}
                    color="black"
                  />
                </View>
                <View
                  style={{ height: 2, width: 50, backgroundColor: "black" }}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                sett1(2);
                let newList=[]
                let id_movie_kt=new Set()
                ListTicket.forEach(item=>{
                     if(!id_movie_kt.has(item.id_showtimes._id)){
                      id_movie_kt.add(item.id_showtimes._id)
                      newList.push(item)
                     }
                })
                setListHienThi(newList)
              }}
            >
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    marginHorizontal: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="movie-open-play-outline"
                    size={28}
                    color="#999999"
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
          {/* {t1 === 3 ? (
            <TouchableOpacity>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    marginHorizontal: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="hearto" size={24} color="black" />
                </View>
                <View
                  style={{ height: 2, width: 50, backgroundColor: "black" }}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => {sett1(3);setListHienThi(ListFavourti)}}>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    marginHorizontal: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="hearto" size={24} color="#888888" />
                </View>
              </View>
            </TouchableOpacity>
          )} */}
        </View>
        {TaiKhoan === null ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator style={{ marginBottom: 20 }}></ActivityIndicator>
            <Text>Vui lòng đăng nhập</Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
              <BodyList/>
          </View>
        )}
      </View>


         {/* modalThanhToan */}

         <Modal
        visible={modalThanhToan}
        animationType="slide"
        transparent={true}
      >
        <View
          style={styles.modalContainer}>
          <View style={styles.modalContent}>
            
            <View style={{ flex: 4 }}>
              <Text style={{ textAlign: "center", marginTop: 20, fontSize: 20 }}> Thanh toán lại </Text>
              <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                <Text>Thời gian thanh toán trước : {Pay?Pay.ngay:''}</Text>
                <Text style={{ marginTop: 5 }}>Vé đặt : {Pay?Pay.sl:''}</Text>
                <Text style={styles.textPrice}>{Pay?Pay.gia.toLocaleString():''} vnd</Text>
                <Text>Thông tin tài khoản</Text>
                <View style={styles.containerImgQR}>
                  <Image
                    source={require("../img/imgQr.png")}
                    style={styles.imgQR}/>
                  <TouchableOpacity
                    onPress={() => {chooseImage()}}>
                    <Image
                      source={{
                        uri:
                          anhThanhToan == null
                            ? "https://cdn-icons-png.flaticon.com/128/401/401061.png"
                            : anhThanhToan,
                      }}
                      style={{
                        width: 100,
                        height: 140,
                        margin: 10,
                        borderRadius: 10,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <Text>Lưu ý:</Text>
                <Text> +Kiểm tra thông tin tài khoản trước khi giao dịch</Text>
                <Text> +Nôi dung chuyển khoản số điện thoại của bạn</Text>
                <Text> +Gửi ảnh rõ nét nội dung giao dịch</Text>
              </View>
            </View>

            <View
              style={styles.containerButton}>
              <TouchableOpacity
                onPress={() => {setmodalThanhToan(false);setPay(null)}}>
                <View style={styles.Button}>
                  <Text style={styles.textButton}>Hủy</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {UpdateBill()}}>
                <View style={styles.Button}>
                  <Text style={styles.textButton}>Xác nhận</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  modalContainer:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center" 
  },
  modalContent:{
     width: "90%",
     height: "60%",
     backgroundColor: "white",
     borderRadius: 20,
     shadowColor: "#000",
     shadowOffset: { width: 1, height: 2 },
     shadowOpacity: 0.3,
     shadowRadius: 3.84,
  },
  modalImgMovie:{
    width: 100,
    height: 150,
    borderRadius: 10 
  },
  containerButton:{
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  textPrice:{
    color: "#ff4500",
    fontSize: 20,
    fontWeight: "bold",
    margin: 15,
  },
  textPay: {
    fontSize: 18,
  },
  containerImgQR:{
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  imgQR:{
  width: 120, height: 130, margin: 10
  }
,  pay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 55,
    backgroundColor: "#EEEEEE",
    borderRadius: 10,
    marginBottom: 15,
  },
  textButton: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
  },
  Button: {
    width: 120,
    height: 53,
    backgroundColor: "blue",
    borderRadius: 25,
    justifyContent: "center",
  },
});
