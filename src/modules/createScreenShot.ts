import { providerRegistry, Region, ScreenClass } from '@nut-tree/nut-js';
import Jimp from 'jimp';
import { SCREENSHOT_HEIGHT, SCREENSHOT_WIDTH } from '../constants.js';

export const createScreenShot = async (mousePositionX: number, mousePositionY: number): Promise<string> => {
  const screenInstance = new ScreenClass(providerRegistry);
  const screenShot = await (
    await screenInstance.grabRegion(
      new Region(
        mousePositionX - SCREENSHOT_WIDTH / 2,
        mousePositionY - SCREENSHOT_HEIGHT / 2,
        SCREENSHOT_WIDTH,
        SCREENSHOT_HEIGHT,
      ),
    )
  ).toRGB();
  const image = new Jimp({
    data: screenShot.data,
    width: SCREENSHOT_WIDTH,
    height: SCREENSHOT_HEIGHT,
  });
  return (await image.getBufferAsync(Jimp.MIME_PNG)).toString('base64');
};
