const { listMessages, getMessage, checkEmailsAndSaveHtml,checkEmailsForUser, prendreScreenshot} = require('../email_check/email_check_code.js');
const { lireFichierListe, choisirAleatoire, choisirAleatoireNumber, create_email } = require('../email_creation/create_email.js');
const moment = require('moment'); // Gestion des dates
const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');
const settings = require('../settings.json');
const fs = require('fs').promises;
const {google} = require('googleapis');
const { auth } = require('googleapis/build/src/apis/abusiveexperiencereport/index.js');
const { response } = require('express');
module.exports = {inscriptionUberEats, gen};
const oauth2Client = new google.auth.OAuth2(
    settings.oauth2Credentials.client_id,
    settings.oauth2Credentials.client_secret,
    settings.oauth2Credentials.redirect_uris[0]
);
oauth2Client.setCredentials(settings.tokens);
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

gen()

currentPort = 10001

async function createProxyAgent() {
  // Utiliser currentPort dans l'URL du proxy
  const proxyUrl = `http://v2vuzm1q09nkwltx415ue9i:RNW78Fm5@fast.froxy.com:${currentPort}`;
  // Alterner le port pour le prochain appel
  currentPort = currentPort === 10000 ? 10004 : 10000;
  return new HttpsProxyAgent(proxyUrl);
}

async function gen() {
    const { email, nom, prenom } = await create_email();
    let agent = await createProxyAgent();
    inscriptionUberEats(email, nom, prenom, agent);
}


async function inscriptionUberEats(EMAIL, nom, prenom, agent) {
  
/////////////////////////////////////////////////////////////////////ON RECUPERE LES INFOS DE LA SESSION///////////////////////////////////////////////////////////////
  console.log("récuperation des infos de la session...")
  let locationUrl = null 
  let dId = null
  let cookieParts = null
  let cookieString = null
  let state = null
  let setCookieString = null
  let marketingVistorId = null
  let requete_cookies = {
    "dId": null,
    "jwt_session": null,
    "uev2.id.xp": null,
    "uev2.id.session": null,
    "uev2.ts.session": null
  };
  url = 'https://www.ubereats.com/'

  let headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
    "Accept-Encoding": "gzip, deflate, br",
    "Alt-Used": "www.ubereats.com",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "TE": "trailers"
  };

  try {
    let response = await fetch(url, { method: 'GET', headers: headers, redirect: 'manual', agent: agent });
    //if (!response.ok) throw new Error(`Erreur HTTP ! status: ${response.status}`);
    setCookieString = response.headers.get('set-cookie')
    let cookiesArray = setCookieString.split(", ");
    let cookies = {};
    cookiesArray.forEach(cookieString => {
      cookieParts = cookieString.split(";")[0];
      let [name, value] = cookieParts.split("=");
      cookies[name] = value;
    });
    dId = cookies["dId"];
    let uev2IdXp = cookies["uev2.id.xp"];
    let uev2IdSession = cookies["uev2.id.session"];
    let uev2TsSession = cookies["uev2.ts.session"];
    let jwtSession = cookies["jwt-session"];
    marketingVistorId = cookies["marketing_vistor_id"];
    requete_cookies.dId = dId
    requete_cookies.jwt_session = jwtSession
    requete_cookies['uev2.id.xp'] = uev2IdXp
    requete_cookies["uev2.id.session"] = uev2IdSession
    requete_cookies["uev2.ts.session"] = uev2TsSession
    cookieString = `uev2.id.xp=${cookies["uev2.id.xp"]}; dId=${cookies["dId"]}; uev2.id.session=${cookies["uev2.id.session"]}; uev2.ts.session=${cookies["uev2.ts.session"]}; jwt-session=${cookies["jwt-session"]};`
    //console.log("dId:", dId);
    //console.log("uev2.id.xp:", uev2IdXp);
    //console.log("uev2.id.session:", uev2IdSession);
    //console.log("uev2.ts.session:", uev2TsSession);
    //console.log("jwt-session:", jwtSession);
    //console.log("marketing_vistor_id:", marketingVistorId);

  } catch (error) {
    console.error('Erreur lors de la requête:', error);
    return null; // Retourne null en cas d'erreur
  }

/////////////////////////////////////////////////////////////////////ON RECUPERE LE STATE///////////////////////////////////////////////////////////////
  console.log("récuperation du STATE...")
  URL0 = `https://www.ubereats.com/login-redirect/?campaign=signin_universal_link&redirect=/fr&guest_mode=false&app_clip=false`
  headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
    "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
    "Accept-Encoding": "gzip, deflate, br",
    "Referer": "https://www.ubereats.com/",
    "DNT": "1",
    "Alt-Used": "auth.uber.com",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Cookie": cookieString,
    "Sec-Fetch-Site": "cross-site",
    "Sec-Fetch-User": "?1",
    "Sec-GPC": "1"
  }



  try {
    let response = await fetch(URL0, { method: 'GET', headers: headers, redirect: 'manual', agent: agent, credentials: 'include' });
    if (response.status === 301 || response.status === 302 || response.status === 307 || response.status === 308) {
    locationUrl = response.headers.get('location');
    let stateMatches = locationUrl.match(/[\?&]state=([^&]*)/);
    state = stateMatches ? decodeURIComponent(stateMatches[1]).replace("%3D", "=") : null;
    }
  } catch (error) {
    console.error('Erreur lors de la requête:', error);
    return null; // Retourne null en cas d'erreur
  }



/////////////////////////////////////////////////////////////////////ON RECUPERE LES NOUVEAUX COOKIES///////////////////////////////////////////////////////////////


console.log("Récuperation des nouveaux cookies...")

  URL1 = locationUrl

  try {
    let response = await fetch(URL1, { method: 'GET', headers: headers, agent: agent, credentials: 'include' });
    setCookieString = response.headers.get('set-cookie')
  } catch (error) {
    console.error('Erreur lors de la requête:', error);
    return null; // Retourne null en cas d'erreur
  }







/////////////////////////////////////////////////////////////////////ON ENTRE L'ADRESSE MAIL///////////////////////////////////////////////////////////////





  console.log(`Création du compte UberEats pour ${EMAIL}...`)
    headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
    "Accept": "*/*",
    "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
    "Accept-Encoding": "gzip, deflate, br",
    "Referer": locationUrl,
    "Content-Type": "application/json",
    "x-uber-client-name": "usl_desktop",
    //"x-uber-request-uuid": "4a3f5798-c6c7-43a9-afdf-b1bdf759940e",
    "x-uber-did": dId,
    "Cookie": cookieString,
    //"x-uber-analytics-session-id": "28f435ba-6cc1-4aad-896a-079bd35ce514",
    //"x-uber-marketing-id": "f1668788-bbe1-43e7-a9ee-0fc708ef7169",
    //"x-uber-usl-id": "fb69921f-417f-4ffb-9613-d33f7e0ff0d1",
    "x-uber-challenge-provider": "ARKOSE_TOKEN",
    "x-csrf-token": "x"
  };

  const initialData = {
    "formContainerAnswer": {
      "inAuthSessionID": "",
      "formAnswer": {
        "flowType": "INITIAL",
        "standardFlow": true,
        "accountManagementFlow": false,
        "daffFlow": false,
        "productConstraints": {
          "uslFELibVersion": "",
          "uslMobileLibVersion": "",
          "isWhatsAppAvailable": false,
          "isRakutenAvailable": false,
          "isKakaoAvailable": false
        },
        "additionalParams": {
          "isEmailUpdatePostAuth": false
        },
        "deviceData": "",
        "nextURL": "https://www.ubereats.com/login-redirect/",
        "screenAnswers": [{
          "screenType": "PHONE_NUMBER_INITIAL",
          "eventType": "TypeInputEmail",
          "fieldAnswers": [{
            "fieldType": "EMAIL_ADDRESS",
            "emailAddress": EMAIL
          }]
        }]
      }
    }
  };

  try {
    let url2 = "https://auth.uber.com/v2/submit-form";
    let response = await fetch(url2, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(initialData),
      credentials: 'include',
      agent: agent
    });

    if (!response.ok) throw new Error(`Erreur HTTP ! status: ${response.status}`);
    let responseJson = await response.json();
    let ide = responseJson.inAuthSessionID;
    console.log("En attente du code OTP envoyé par mail...")
    await sleep(10000)
    let code = await checkEmailsAndSaveHtml(oauth2Client, EMAIL)
    if (!code.isSuccess) {
      await sleep(10000)
      code = await checkEmailsAndSaveHtml(oauth2Client, EMAIL)
    }
      console.log(`Code recu par mail :${code.code}`)






/////////////////////////////////////////////////////////////////////ON ENTRE LE CODE OTP///////////////////////////////////////////////////////////////




    let url3 = "https://cn-geo1.uber.com/rt/silk-screen/submit-form";
    let data = {
      "formContainerAnswer": {
        "inAuthSessionID": ide,
        "formAnswer": {
          "flowType": "SIGN_UP",
          "standardFlow": true,
          "accountManagementFlow": false,
          "daffFlow": false,
          "productConstraints": {
            "uslFELibVersion": "",
            "uslMobileLibVersion": "",
            "isWhatsAppAvailable": false,
            "isRakutenAvailable": false,
            "isKakaoAvailable": false
          },
          "additionalParams": {"isEmailUpdatePostAuth": false},
          "nextURL": "https://www.ubereats.com/login-redirect/",
          "screenAnswers": [{
            "screenType": "EMAIL_OTP_CODE",
            "eventType": "TypeEmailOTP",
            "fieldAnswers": [{
              "fieldType": "EMAIL_OTP_CODE",
              "emailOTPCode": code.code
            }]
          }]
        }
      }
    };

    response = await fetch(url3, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
      credentials: 'include',
      agent: agent
    });
    if (!response.ok) throw new Error(`Erreur HTTP ! status: ${response.status}`);
    responseJson = await response.json();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Pause de 3 secondes


/////////////////////////////////////////////////////////////////////SKIP NUMERO DE TELEPHONE///////////////////////////////////////////////////////////////


    // Passer l'étape de numéro de téléphone
    let url4 = "https://cn-geo1.uber.com/rt/silk-screen/submit-form";
    data = {
      "formContainerAnswer": {
        "inAuthSessionID": ide,
        "formAnswer": {
          "flowType": "PROGRESSIVE_SIGN_UP",
          "standardFlow": true,
          "accountManagementFlow": false,
          "daffFlow": false,
          "productConstraints": {
            "uslFELibVersion": "",
            "uslMobileLibVersion": "",
            "isWhatsAppAvailable": false,
            "isRakutenAvailable": false,
            "isKakaoAvailable": false
          },
          "additionalParams": {"isEmailUpdatePostAuth": false},
          "deviceData": "",
          "nextURL": "https://www.ubereats.com/login-redirect/",
          "screenAnswers": [{
            "screenType": "SKIP",
            "eventType": "TypeSkip",
            "fieldAnswers": []
          }]
        }
      }
    };

    response = await fetch(url4, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
      credentials: 'include',
      agent: agent
    });
    if (!response.ok) throw new Error(`Erreur HTTP ! status: ${response.status}`);
    responseJson = await response.json();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Pause de 3 secondes



  /////////////////////////////////////////////////////////////////////NOM ET PRENOM///////////////////////////////////////////////////////////////

    console.log(`Initialisation du nom et prenom : ${nom} ${prenom}...`)

    let url5 = "https://cn-geo1.uber.com/rt/silk-screen/submit-form";
    data = {
      "formContainerAnswer": {
        "inAuthSessionID": ide,
        "formAnswer": {
          "flowType": "PROGRESSIVE_SIGN_UP",
          "standardFlow": true,
          "accountManagementFlow": false,
          "daffFlow": false,
          "productConstraints": {
            "uslFELibVersion": "",
            "uslMobileLibVersion": "",
            "isWhatsAppAvailable": false,
            "isRakutenAvailable": false,
            "isKakaoAvailable": false
          },
          "additionalParams": {"isEmailUpdatePostAuth": false},
          "deviceData": "",
          "nextURL": "https://www.ubereats.com/login-redirect/",
          "screenAnswers": [{
            "screenType": "FULL_NAME_PROGRESSIVE",
            "eventType": "TypeInputNewUserFullName",
            "fieldAnswers": [{
              "fieldType": "FIRST_NAME",
              "firstName": nom
            }, {"fieldType": "LAST_NAME",
                "lastName": prenom
              }]
            }]
          }
        }
      };
  
      response = await fetch(url5, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
        credentials: 'include',
        agent: agent
      });
      if (!response.ok) throw new Error(`Erreur HTTP ! status: ${response.text}`);
      responseJson = await response.json();
      await new Promise(resolve => setTimeout(resolve, 2000)); // Pause de 3 secondes

 /////////////////////////////////////////////////////////////////////ACCEPTATION CONDITION LEGALE///////////////////////////////////////////////////////////////

  console.log("Finalisation du compte...")
  

      let url6 = "https://cn-geo1.uber.com/rt/silk-screen/submit-form";
      data = {
        "formContainerAnswer": {
          "inAuthSessionID": ide,
          "formAnswer": {
            "flowType": "SIGN_UP",
            "standardFlow": true,
            "accountManagementFlow": false,
            "daffFlow": false,
            "productConstraints": {
              "uslFELibVersion": "",
              "uslMobileLibVersion": "",
              "isWhatsAppAvailable": false,
              "isRakutenAvailable": false,
              "isKakaoAvailable": false
            },
            "additionalParams": {"isEmailUpdatePostAuth": false},
            "deviceData": "",
            "nextURL": "https://www.ubereats.com/login-redirect/",
            "screenAnswers": [{
              "screenType": "LEGAL",
              "eventType": "TypeSignupLegal",
              "fieldAnswers": [{
                "fieldType": "LEGAL_CONFIRMATION",
                "legalConfirmation": true
              }, {
                "fieldType": "LEGAL_CONFIRMATIONS",
                "legalConfirmations": {
                  "legalConfirmations": [{
                    //"disclosureVersionUUID": "4add5341-4682-48d0-b6fa-36acb243ea27",
                    "isAccepted": true
                  }]
                }
              }]
            }]
          }
        }
      }
      response = await fetch(url6, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
        credentials: 'include',
        agent: agent
      });
      if (!response.ok) throw new Error(`Erreur HTTP ! status: ${response.text}`);
    responseJson = await response.json();
    await new Promise(resolve => setTimeout(resolve, 3000)); // Pause de 3 secondes

    console.log("Inscription terminée avec succès !");





 /////////////////////////////////////////////////////////////////////FORMATAGE DES INFOS///////////////////////////////////////////////////////////////



     const date_creation = moment().format('MM/DD/YYYY');
     const datas = {
         email: EMAIL,
         date_creation: date_creation,
         nom: nom,
         prenom: prenom,
         date_dernier_check: date_creation,
         etat_promo: false,
         etat_vente: false,
         date_vente: false,
         nom_de_domaine: "mailsix" ,
         ban: false,
         dId: dId
     };
     console.log(datas)
     try {
         let jsonContent = [];
         try {
             const fileContent = await fs.readFile('Accounts/accounts.json', 'utf8');
             if (fileContent) {
                 jsonContent = JSON.parse(fileContent);
             }
         } catch (readError) {
             
         }
         jsonContent.push(datas);
         await fs.writeFile('Accounts/accounts.json', JSON.stringify(jsonContent, null, 2));
     } catch (writeError) {
         

         console.error('Erreur lors de l\'écriture dans le fichier:', writeError);
     }
  }catch(err){
    console.log(err)
  }
}