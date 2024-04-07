import {handleerror} from "../utils/apierror.js"
import {handleresponse} from "../utils/apiresponse.js"
import {asynchandler} from "../utils/asynchandler.js"


const healthcheck = asynchandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
    return res.status(200).json(200,new handleresponse(200,"App working perfectly"))
})

export {
    healthcheck
    }
    