import { Button, mouse, straightTo } from '@nut-tree/nut-js';

export const createCircle = async (radius: number) => {
  const { x: startX, y: startY } = await mouse.getPosition();
  const [circleCenterX, circleCenterY] = [startX + radius, startY];
  await mouse.pressButton(Button.LEFT);
  for (let i = 0; i <= 360; i++) {
    const Y = radius * Math.sin((i * Math.PI) / 180);
    const X = radius * Math.cos((i * Math.PI) / 180);
    await mouse.move(straightTo({ x: circleCenterX - X, y: circleCenterY - Y }));
  }
  await mouse.releaseButton(Button.LEFT);
};
