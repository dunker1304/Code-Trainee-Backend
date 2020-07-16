const CONSTANTS = require("../../config/custom").custom;
const axios = require("axios");

module.exports = {
  submitExercise: async function (submitData) {
    let result = {
      message: "",
      success: true,
      code: "",
    };
    try {
      //config header
      let config = {
        headers: {
          "Content-Type": "application/json",
          //"x-rapidapi-key": CONSTANTS.RAPIDAPI_KEY,
          useQueryString: true,
        },
      };

      let response = await axios.post(
        `${CONSTANTS.DOMAIN_JUDGE}/submissions`,
        submitData,
        config
      );
      let reTry = 0;
      let resultRes = {};
      if (response.data.token) {
        do {
          resultRes = await axios.get(
            `${CONSTANTS.DOMAIN_JUDGE}/submissions/${response.data.token}?fields=stdout,stdin,time,memory,stderr,token,compile_output,message,status,expected_output`,
            config
          );
          status = resultRes.data.status.id;
          reTry = reTry + 1;

          if (reTry == 6) {
            result["success"] = false;
            result["message"] = "Internal Server Error!";
            return result;
          }
        } while (
          status == CONSTANTS.STATUS_SUBMIT.IN_QUEUE ||
          status == CONSTANTS.STATUS_SUBMIT.PROCESSING
        ); //1 :inqueue 2 :processing
        result["data"] = resultRes.data;

        if (CONSTANTS.ERROR_STATUS.indexOf(status) !== -1) {
          result["success"] = false;
        }
        return result;
      }
      return response.data;
    } catch (error) {
      result.success = false;
      result.message = error.response.data;
      result.code = error.response.status;
      console.log(result, "post judge erro");

      return result;
    }
  },
};
