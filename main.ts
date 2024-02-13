import "dotenv/config";
import puppeteer, { Page } from "puppeteer";
import { YEAR, NOMBRE, NIE } from "./env";
import { exec } from "child_process";
import * as path from "path";

let loop = true;
const __dirname = path.resolve();
const NOTIFICATION = `${__dirname}/notification.wav`;
const command =
  process.platform === "win32"
    ? `start ${NOTIFICATION}`
    : `aplay ${NOTIFICATION}`;

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

async function elementExists(page: Page, selector: string): Promise<boolean> {
  let exists = true;

  try {
    const _ = await page.waitForSelector(selector, { timeout: 5_000 });
  } catch (_error) {
    return false;
  }

  return exists;
}

function playNotification() {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}

async function register() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1024 });

    await page.goto(
      "https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus"
    );

    const submit = await page.waitForSelector("#submit");
    await submit?.click();

    const _await = await page.waitForSelector("#form");
    sleep(1_000);
    await page.select("select#form", "/icpplus/citar?p=18&locale=es");
    const accept = await page.waitForSelector("#btnAceptar");
    await accept?.click();

    const _await2 = await page.waitForSelector("#sede");
    sleep(1_000);
    await page.select("#sede", "1");
    const select = await page.waitForSelector('select[name="tramiteGrupo[0]"]');
    await select?.select("4");
    const accept2 = await page.waitForSelector("#btnAceptar");
    await accept2?.click();

    const _await3 = await page.waitForSelector("#btnEntrar");
    sleep(1_000);
    const enter = await page.waitForSelector("#btnEntrar");
    await enter?.click();

    const _await4 = await page.waitForSelector("#rdbTipoDocPas");
    sleep(1_000);
    const passportRadio = await page.waitForSelector("#rdbTipoDocPas");
    await passportRadio?.click();
    await page.type("#txtIdCitado", NIE, { delay: 120 });
    const nomberInput = await page.waitForSelector("#txtDesCitado");
    await nomberInput?.type(NOMBRE, { delay: 120 });
    // await page.$eval("#txtAnnoCitado", (field) => (field.value = 1999));
    const accept3 = await page.waitForSelector("#btnEnviar");
    await accept3?.click();

    const _await5 = await page.waitForSelector("#btnEnviar");
    sleep(1_000);
    const sendRequest = await page.waitForSelector("#btnEnviar");
    await sendRequest?.click();

    if (
      !(await elementExists(
        page,
        "#mainWindow > div > div.mf-layout--main > section > div.mf-main--content.ac-custom-content > form > input[type=hidden]:nth-child(1)"
      ))
    ) {
      loop = false;
      playNotification();
    }

    await page.screenshot({
      path: `./cache/screenshot-${date()}.png`,
    });

    await browser.close();
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  while (loop) {
    await register();
    sleep(1_200_000);
  }
}

main();
