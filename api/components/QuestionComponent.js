const CONSTANTS = require('../../config/custom').custom;

module.exports.QuestionComponent = {
    submitQuestion : async function(data){

        try {
              //config header
       let config = { headers : {
        'Content-Type' : 'application/json',
        'x-rapidapi-key': CUSTOM.RAPIDAPI_KEY,
        'useQueryString' : true
        }
     }

       let response = await axios.post(`${CUSTOM.DOMAIN_JUDGE}/submissions`,submitData,config)
       let reTry = 0;
       let result = {
           message : '',
           success : true
       }
       if(response.data.token) {

        do {
            result = await axios.get(`${CUSTOM.DOMAIN_JUDGE}/submissions/${response.data.token}`,config)
            status = result.data.status.id
            reTry = reTry + 1;

            if(reTry == 6) {
              result['success'] = false;
              result['message'] = 'Đã có lỗi xảy ra!'
              break;
            }

          }
         while( status == CONSTANTS.STATUS_SUBMIT.IN_QUEUE || status == CONSTANTS.STATUS_SUBMIT.PROCESSING) //1 :inqueue 2 :processing
          return result.data;

       }
            return response.data
        } catch (error) {
            result['success'] = false;
            result['message'] = error.getMessage()
            return result;
        }

      
 }
}