import axios from 'axios';
import { getUserIdByEmail } from '../entities/dbUsers';
import { generateToken } from '../entities/dbTokens';

export const submitRecoveryLink = async (userEmail) => {
        const userId = await getUserIdByEmail(userEmail);
        if(userId == null) return {value: false, msg: "El email ingresado es incorrecto"};

        //Token and link preparation
        let token = await generateToken(userEmail);
        let domain = document.location.toString().split("/forgotpassword.html")[0];
        let url = `${domain}/resetpassword.html?token=${token}&user=${userEmail}`;

        //Axios call to phpMailer file
        var result;
        let data = { email: userEmail, link: url };
        await axios.post('../submitResetPassLink.php', data)
                .then(res => result = res.data.toString().split(":"))
                .catch(err => result = err );

        if(result[result.length-1] == "success") return {value: true, 
                                                        msg: "Se ha enviado un enlace de recuperación a su email"}
        return {value: false, 
                msg: "Ha ocurrido un error al enviar el enlace de recuperación: "+result};

}