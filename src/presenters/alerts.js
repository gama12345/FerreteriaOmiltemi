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
      html: msg,
      title: title,
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

  const showInput = async (title, desc, productExistences = null) => {
    let result = { isConfirmed: false };
    let type = 'text';
    if(title == "Cancelar venta") type = 'password'
    await Swal.fire({
      title: title,
      input: type,
      inputLabel: desc,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "El campo no puede ser vacío"
        if(title == "Resurtir producto" || title == "Agregar producto"){
          if(!isValidInteger(value)) return "Ingrese un número entero de hasta cinco digitos."          
          if(productExistences != null){
            const quantity = parseInt(value);
            if(quantity > productExistences) return `El número de existencias del producto es ${productExistences}`
          }
        }      
      }
    }).then(res => {
      result = res;
    });
    return result;
  }

  export {showMsg, showError, showConfirm, showInput}
  