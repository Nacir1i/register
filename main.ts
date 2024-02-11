import "dotenv/config";
import puppeteer from "puppeteer";
import { YEAR, NOMBRE, NIE } from "./env";

function date(): string {
  const date = new Date();

  let day: string | number = date.getDate();
  let month: string | number = date.getMonth() + 1;
  let hour: string | number = date.getHours();
  let minute: string | number = date.getMinutes();
  let second: string | number = date.getSeconds();

  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;

  return `${hour}-${minute}-${second}`;
}

async function main() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1024 });

    await page.goto(
      "https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus"
    );

    const submit = await page.waitForSelector("#submit");
    await submit?.click();
    await page.waitForNavigation({
      waitUntil: "networkidle2",
    });

    await page.select("select#form", "Granada");
    const accept = await page.waitForSelector("#btnAceptar");
    await accept?.click();
    await page.waitForNavigation({
      waitUntil: "networkidle2",
    });

    await page.select(
      "select#sede",
      "Oficina de Extranjería en Granada, San Agapito, 2"
    );
    await page.select("select#tramiteGrupo[0]", "SOLICITUD DE AUTORIZACIONES");
    const accept2 = await page.$("#btnAceptar");
    await accept2?.click();
    await page.waitForNavigation({
      waitUntil: "networkidle2",
    });

    const enter = await page.waitForSelector("#btnEntrar");
    await enter?.click();
    await page.waitForNavigation({
      waitUntil: "networkidle2",
    });

    const passportRadio = await page.$("#rdbTipoDocPas");
    await passportRadio?.click();
    await page.type("#txtIdCitado", NIE);
    await page.type("#txtDesCitado", NOMBRE);
    await page.type("#txtAnnoCitado", YEAR);
    const accept3 = await page.waitForSelector("#btnEnviar");
    await accept3?.click();
    await page.waitForNavigation({
      waitUntil: "networkidle2",
    });

    const sendRequest = await page.waitForSelector("#btnEnviar");
    await sendRequest?.click();
    await page.waitForNavigation({
      waitUntil: "networkidle2",
    });

    const resultContainer = await page.waitForSelector(
      "#mainWindow > div > div.mf-layout--main > section > div.mf-main--content.ac-custom-content > form > input[type=hidden]:nth-child(1)"
    );

    await page.screenshot({
      path: `./cache/screenshot-${date()}.png`,
    });

    await browser.close();
  } catch (error) {
    console.error(error);
  }
}

main();
