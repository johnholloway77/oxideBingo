package dev.jholloway.oxidebingo.services;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import javax.imageio.ImageIO;

public class ImageLoader {

  public static BufferedImage loadImage() throws IOException {
    InputStream inputStream = ImageLoader.class.getResourceAsStream("/static/card-WORKING-2.png");
    if (inputStream == null) {
      throw new IOException("Image not found");
    }
    return ImageIO.read(inputStream);
  }
}
