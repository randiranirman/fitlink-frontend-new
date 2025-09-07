import axios from "axios";
import { jwtDecodeClaims } from "./authService";
import AsyncStorage from "@react-native-async-storage/async-storage";



const  API_URL = "http://192.168.8.108:8082/api/meals"



export const getMealPlanByClientId = async ( ) => {


    const clientId = await  jwtDecodeClaims(await AsyncStorage.getItem("accessToken"))?.id;


     try  {
         const response =  await axios.get(`${API_URL}/getMealPlansById/${clientId}`)
         console.log( response.data);

         return response.data;


     }catch(error ) {
        console.log(" something went wrong " + error);
     }
}