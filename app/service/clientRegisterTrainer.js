import axios from "axios"



const API_URL = "http://192.168.8.108:8080/api/clients"



export const searchTrainerByName  = async ( trainerName ) => {


   try {
     const response = await axios.get(`${API_URL}/searchTrainers?name=${trainerName}`);
     console.log(response.data);

      return response.data
      ;
   }catch( error ) {
     console.log( error );

   }



    

}

export const registerForTrainer =  async  (requestBody,trainerId)  => {


  try {
    const response = await axios.post(`${API_URL}/registerTrainer?trainerId=${trainerId}` , requestBody);
    console.log( response);



  }catch ( error) {
    console.log( "some thing went wrong " + error);
  }

}

