
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendNewPostNotification = async (userEmail, username, postTitle) => {
  const msg = {
    to: userEmail,
    from: 'vladislavabrinza@gmail.com', 
    subject: `Nuovo post: ${postTitle}`,
    text: `Ciao ${username},\n\nHai creato un nuovo post intitolato "${postTitle}"!`,
    html: `<p>Ciao ${username},</p><p>Hai creato un nuovo post intitolato "<strong>${postTitle}</strong>"!</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log('Notifica inviata a:', userEmail);
  } catch (error) {
    console.error('Errore nell\'invio della notifica:', error);
  }
};

export const sendWelcomeEmail = async (userEmail, username) => {
  const msg = {
    to: userEmail,
    from: 'vladislavabrinza@gmail.com', 
    subject: 'Benvenuto!',
    text: `Ciao ${username},\n\nGrazie per esserti registrato sulla nostra piattaforma!`,
    html: `<p>Ciao ${username},</p><p>Grazie per esserti registrato sulla nostra piattaforma!</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log('Email di benvenuto inviata a:', userEmail);
  } catch (error) {
    console.error('Errore nell\'invio dell\'email:', error);
  }
};
