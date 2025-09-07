
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecodeClaims } from "./authService";

 const API_URL = "http://192.168.8.108:8080/api/trainer/getClientDetails"



  export const getClientDetailsByTrainerId = async  () => {

     const trainerId= jwtDecodeClaims(await AsyncStorage.getItem("accessToken"))?.id;


      try  {
        const response = await axios.get(`${API_URL}/${trainerId}`);

        console.log(response.data);

         return response.data;
      }catch (error) {

        console.log( error);
      }
  }