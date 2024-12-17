package br.com.grupoqualityambiental.backend.service.smtp;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.text.DecimalFormat;
import java.util.Date;
import java.util.Properties;
import java.util.Random;

public class OTPmail {

    public void sendEmail(String otp, String toEmail) {
        final String fromEmail = "ti@grupoqualityambiental.com.br"; //requires valid gmail id
        final String password = "tzG5gCNScVaQ"; // correct password for gmail id

        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.zoho.com"); //SMTP Host
        props.put("mail.smtp.socketFactory.port", "465"); //SSL Port
        props.put("mail.smtp.socketFactory.class",
                "javax.net.ssl.SSLSocketFactory"); //SSL Factory Class
        props.put("mail.smtp.auth", "true"); //Enabling SMTP Authentication
        props.put("mail.smtp.port", "465"); //SMTP Port

        Authenticator auth = new Authenticator() {
            //override the getPasswordAuthentication method
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, password);
            }
        };

        Session session = Session.getDefaultInstance(props, auth);
        try {
            MimeMessage msg = new MimeMessage(session);
            //set message headers
            msg.addHeader("Content-type", "text/HTML; charset=UTF-8");
            msg.addHeader("format", "flowed");
            msg.addHeader("Content-Transfer-Encoding", "8bit");

            msg.setFrom(new InternetAddress(fromEmail, "Suporte TI"));

            msg.setReplyTo(InternetAddress.parse(toEmail, false));
            msg.setSubject("Redefinição de Senha - Código OTP", "UTF-8");

            msg.setText(" Olá,\n" +
                    "\n" +
                    "Recebemos uma solicitação para redefinir sua senha. Para prosseguir com o processo, por favor, insira o código de verificação abaixo:\n" +
                    "\n" +
                    "Código OTP: " + otp + "\n" +
                    "\n" +
                    "Este código é válido por 5 minutos. Caso não tenha solicitado a redefinição de senha, por favor, ignore esta mensagem.\n" +
                    "\n" +
                    "Se precisar de ajuda adicional, entre em contato com o suporte.", "UTF-8");

            msg.setSentDate(new Date());

            msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail, false));
            Transport.send(msg);

        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
