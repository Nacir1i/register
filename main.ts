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

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      // args: ["--proxy-server=195.114.209.50:80"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1024 });

    await page.goto(
      "https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus"
    );

    const submit = await page.waitForSelector("#submit");
    await submit?.click();

    const _await = await page.waitForSelector("#form");
    await page.select("select#form", "/icpplus/citar?p=18&locale=es");
    const accept = await page.waitForSelector("#btnAceptar");
    await accept?.click();

    const _await2 = await page.waitForSelector("#sede");
    await page.select("#sede", "1");
    const select = await page.waitForSelector('select[name="tramiteGrupo[0]"]');
    await select?.select("4");
    // await page.select('select[name="tramiteGrupo[0]"]', "4");
    const accept2 = await page.waitForSelector("#btnAceptar");
    await accept2?.click();

    const _await3 = await page.waitForSelector("#btnEntrar");
    const enter = await page.waitForSelector("#btnEntrar");
    await enter?.click();

    const _await4 = await page.waitForSelector("#rdbTipoDocPas");
    const passportRadio = await page.waitForSelector("#rdbTipoDocPas");
    await passportRadio?.click();
    await page.type("#txtIdCitado", NIE, {delay: 120});
    const nomberInput = await page.waitForSelector("#txtDesCitado");
    await nomberInput?.type(NOMBRE, {delay: 120});
    await page.$eval('#txtAnnoCitado', field => field.value = 1999);
    const accept3 = await page.waitForSelector("#btnEnviar");
    await accept3?.click();

    const _await5 = await page.waitForSelector("#btnEnviar");
    const sendRequest = await page.waitForSelector("#btnEnviar");
    await sendRequest?.click();

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
