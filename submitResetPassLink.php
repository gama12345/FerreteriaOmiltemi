<?php
include "PHPMailer-master/src/PHPMailer.php";
include "PHPMailer-master/src/SMTP.php";
include "PHPMailer-master/src/Exception.php";

$data = json_decode(file_get_contents("php://input"), true);

$email_user = "proyectos.moviles.tec@gmail.com";
$email_password = "proyectostec1";
$the_subject = "Ferreteria Omiltemi - Reestablecer contraseña";
$address_to = $data["email"];
$from_name = "Soporte";
$phpmailer = new PHPMailer\PHPMailer\PHPMailer();
$phpmailer->CharSet = 'UTF-8';
$phpmailer->Encoding = 'base64';
// ---------- datos de la cuenta de Gmail -------------------------------
$phpmailer->Username = $email_user;
$phpmailer->Password = $email_password; 
//-----------------------------------------------------------------------
$phpmailer->SMTPDebug = 3;
$phpmailer->IsSMTP(); // use SMTP
$phpmailer->SMTPSecure = "tls";
$phpmailer->Host = "smtp.gmail.com"; // GMail
$phpmailer->Port = 587;
$phpmailer->SMTPAuth = true;
$phpmailer->setFrom($phpmailer->Username,$from_name);
$phpmailer->AddAddress($address_to); // recipients email
$phpmailer->Subject = $the_subject;	
$phpmailer->Body .="<h1>Hola usuario</h1>";
$phpmailer->Body .= "<p>Se ha solicitado la recuperación de tu contraseña, 
                    si no has sido tú quien ha realizado esta solicitud ignora este mensaje.
                    <br>Accede al siguiente enlace para reestablecer tu contraseña: 
                    <a href='".$data["link"]."'>".$data["link"]."</a>.</p>
                    <br><b style='color:#EC7C26;'>Ferreteria Omiltemi<b>";
$phpmailer->IsHTML(true);


if (!$phpmailer->send()) {
    $mensaje="error:".$phpmailer->ErrorInfo; 
} else {
    $mensaje="success:success";  
}
    echo $mensaje;
?>