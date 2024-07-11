import { Button, Dimensions, FlatList, Image, ImageBackground, Modal, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from '@react-navigation/native';
import { Ipv4, Uri_get_Billsbyid, Uri_get_movies_by_id, Uri_listTicketByIdBill } from '../api';
const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;
const HoaDonChiTet = ({navigation}) => {
    const route = useRoute();
    const { data } = route.params;
    const [Bill, setBill] = useState(null)
    const [anh, setanh] = useState(null)
    const [urlAnhBill, seturlAnhBill] = useState(null)
    const [ListTicket, setListTicket] = useState([])
    const [modalanh, setmodalanh] = useState(false)
    const getDataBill=async()=>{
       let response = await fetch(`${Uri_get_Billsbyid}/${data}`)
       let dl = await response.json()
       setBill(dl.data)
       let img=dl.data.img[0]
       let url=img.replace('localhost', Ipv4)
       seturlAnhBill(url)
       console.log("ảnh",urlAnhBill)
       
      
    }
    const getListTicketByidBills=async()=>{
        let response = await fetch(`${Uri_listTicketByIdBill}/${data}`)
        let dl = await response.json()
        setListTicket(dl.data)
    }
    useEffect(() => {
            getDataBill()
            getListTicketByidBills()
    }, [])
    
    const ItemTicket=({item})=>{
        const [movideTicket, setmovideTicket] = useState(null)
        const getmovieTicket =async()=>{
            try {
            const response = await fetch(`${Uri_get_movies_by_id}/${item.item.id_showtimes.id_movie}`)
            const data = await response.json()
            setmovideTicket(data)
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
                             <Text style={{color:'white',fontWeight:'bold'}}>{item.item.id_showtimes.room}</Text>
                            </View>
                           
                    </View>
                    {Bill &&<Text  style={{marginTop:10,color:'#999999',fontWeight:'bold'}}>Trạng thái :<Text style={{color:Bill.status==0?"blue": Bill.status==1?"red":Bill.status==4?"orange":"green",fontWeight:'bold'}}> {Bill.status==0? "Chờ xác nhận":Bill.status==1?"Chưa thanh toán":Bill.status==4?"Xác nhận lại":"Đã thanh toán"}</Text></Text>}
                    <Text style={{color:'#999999',fontWeight:'bold',marginVertical:5}}>{item.pay}</Text>
              </View>
              <View style={{flex:1,}}>
                     <View style={{flex:1}}>
                     </View>
                     <View style={{flex:1,flexDirection:'row',alignContent:'space-between',justifyContent:"space-around",width:(widthScreen/2)-20}}>
                          <View>
                               <Text style={{color:'#999999',marginBottom:5}}>Date</Text>
                               <Text>{item.item.id_showtimes.date}</Text>
                          </View>
                          <View style={{width:1,height:'90%',backgroundColor:'#999999',}}></View>
                          <View>
                               <Text style={{color:'#999999',marginBottom:5}}>Hour</Text>
                               <Text>{item.item.id_showtimes.time}</Text> 
                          </View>
                          <View style={{width:1,height:'90%',backgroundColor:'#999999',}}></View>
                          <View>
                               <Text style={{color:'#999999',marginBottom:5}}>Seats</Text>
                               <Text>{item.item.chair}</Text>
                          </View>
                     </View>
              </View>
            </View>
            <Image style={{width:(widthScreen/2)-30,height:10}} source={require('../img/Vector 8.png')} />
            <View style={{flex:1}}>
            <View style={{flex:1,paddingHorizontal:10,justifyContent:'center'}}>
                 <Text style={{color:'#999999',marginBottom:5}}>Booking Code</Text>
                 <Text>{item.item._id}</Text>
            </View>
            </View>
            <Image style={{width:(widthScreen/2)-40,height:50,marginBottom:20}} source={require('../img/Group 8.png')} />
           </ImageBackground>  
      
         </View>)
       }
  return (
    <View>
        <TouchableOpacity
            style={{ width: 50,marginTop:50,marginStart:20 }}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-circle" size={45} color="gray" />
          </TouchableOpacity>
        <Text style={{fontWeight:'bold',textAlign:'center',fontSize:18}}>Hóa Đơn Chi Tiết</Text>

    {Bill?<View>
        <ImageBackground  source={require('../img/background_bill.png')}
                              style={{height:200,width:widthScreen-20,margin:10}}
             >
               <Text style={{marginStart:70,marginTop:20}}>Booking id : {Bill._id}</Text>
             <View style={{marginStart:70,width:320,flexDirection:"row"}}>
               <View style={{flex:1.5}}>
              
               <Text>Time : {Bill.time} - {Bill.date}</Text>
               <Text>Số lượng vé : {Bill.Number_of_tickets}</Text>
               <Text>Tổng tiền : {Bill.payment_amount.toLocaleString()} VND</Text>
               <Text>Phương thức : {Bill.Payment_methods==1?"Thanh toán tại quầy":"Chuyển khoản"}</Text>
               <Text >Trạng thái :<Text style={{color:Bill.status==0?"blue": Bill.status==1?"red":Bill.status==4?"orange":"green",fontWeight:'bold'}}> {Bill.status==0? "Chờ xác nhận":Bill.status==1?"Chưa thanh toán":Bill.status==4?"Xác nhận lại":"Đã thanh toán"}</Text></Text>
               <Text>SDT : {Bill.id_uer.phone}</Text>
               <Text>Email : {Bill.id_uer.email}</Text>
               </View>
              
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity onPress={()=>{setmodalanh(true)}}>
                <Image source={{ uri:urlAnhBill?urlAnhBill:'https://cdn-icons-png.flaticon.com/128/4064/4064372.png'}} style={{ width: anh? 110:60, height:anh? 140:60 }} />
               
                </TouchableOpacity>
              </View>
              
               {/* (item.Payment_methods==1?<Text>Thanh toán tại quầy</Text>:<Text>Chuyển khoản</Text>) */}
               
             </View>

            </ImageBackground>
    </View>:<View><Text>Lỗi </Text></View>}
     <Text style={{margin:10,fontSize:18}}>Danh sách vé </Text>
         <FlatList data={ListTicket} 
                  horizontal={true}
                  renderItem={(item)=> <ItemTicket item={item}/>}
                  keyExtractor={(item)=> item.id}
         />
         <Modal visible={modalanh}
          animationType="slide"
                
         >
          <View style={{backgroundColor:"white"}}>
          <Image source={{ uri:urlAnhBill?urlAnhBill:'https://cdn-icons-png.flaticon.com/128/4064/4064372.png'}} style={{ width:widthScreen, height:heightScreen-80}} />
                <Button onPress={()=>{setmodalanh(false)}} title='Đóng'></Button>
          </View>
             
         </Modal>
    </View>
  )
}

export default HoaDonChiTet

const styles = StyleSheet.create({})