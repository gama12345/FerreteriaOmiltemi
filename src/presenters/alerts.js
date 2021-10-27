import Swal from 'sweetalert2'
import { isValidInteger } from './dataValidation'

//Alerts
const showMsg = (titulo, msg, url = null) => {
    Swal.fire({
      title: titulo,
      text: msg,
      icon: 'info',
      confirmButtonText: 'Ok',
      heightAuto: false,
    }).then(() => {
      if(url) window.location = url
    })
  }
  
  const showError = (titulo, msg, url = null) => {
      Swal.fire({
        title: titulo,
        text: msg,
        icon: 'error',
        confirmButtonText: 'Ok'
      }).then(() => {
        if(url) window.location = url
      })
  }

  const showConfirm = async (title, msg, confirmBtnTxt) => {
    let res = false;
    await Swal.fire({
      title: title,
      text: msg,
      icon: 'question',
      confirmButtonText: confirmBtnTxt,
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      heightAuto: false
    }).then( result => { 
      res = result.isConfirmed;
    });
    return res;
  }

  const showInput = async (title, desc) => {
    let result = { isConfirmed: false };
    await Swal.fire({
      title: title,
      input: 'text',
      inputLabel: desc,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "El campo no puede ser vacío"
        }
        if(title == "Resurtir producto"){
          if(!isValidInteger(value)){
            return "Ingrese un número entero de hasta cinco digitos."
          }
        }
      }
    }).then(res => {
      result = res;
    });
    return result;
  }

  export {showMsg, showError, showConfirm, showInput}
  