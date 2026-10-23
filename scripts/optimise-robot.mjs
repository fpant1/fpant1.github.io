import sharp from "sharp";
import { stat } from "node:fs/promises";

const source = "assets/img/robotfile.gif";
const output = "assets/img/robot-thumbnail.webp";
const poster = "assets/img/robot-poster.webp";
await sharp(source, { animated: true }).resize({ width: 480 }).webp({ quality: 75, effort: 4 }).toFile(output);
await sharp(source, { page: 0 }).resize({ width: 480 }).webp({ quality: 82 }).toFile(poster);
const original = await sharp(source, { animated: true }).metadata();
const result = await sharp(output, { animated: true }).metadata();
const duration = (metadata) => metadata.delay.reduce((sum, value) => sum + value, 0);
if (original.pages !== result.pages || duration(original) !== duration(result) || original.loop !== result.loop) {
  throw new Error("Animation timing changed; review the generated asset.");
}
console.log(output + ": " + (await stat(output)).size + " bytes; " + result.pages + " frames, " + duration(result) + " ms.");
