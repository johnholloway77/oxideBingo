package dev.jholloway.oxidebingo.services;

import static dev.jholloway.oxidebingo.services.CardGenerator.generateImage;
import static java.lang.System.out;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;
import javax.imageio.ImageIO;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class CardCacheGenerator {

  private final BlockingQueue<byte[]> imageCacheByte = new LinkedBlockingQueue<>(50);

  @EventListener(ApplicationReadyEvent.class)
  public void startCacheFiller() throws InterruptedException {

    Executors.newSingleThreadExecutor().submit(() -> {
          while (true) {
            if (imageCacheByte.remainingCapacity() > 0) {
              BufferedImage image = generateImage();

              ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

              ProcessBuilder pb = new ProcessBuilder("cwebp", "-resize",
                  "800", "1214", "-q", "60", "-quiet", "-o", "-", "--", "-");
              Process process = pb.start();

              try (OutputStream outputStream = process.getOutputStream()) {
                ImageIO.write(image, "png", outputStream);
              }

              try (InputStream inputStream = process.getInputStream()) {
                inputStream.transferTo(byteArrayOutputStream);
              }

              int exitCode = process.waitFor();
              if (exitCode != 0) {
                out.println("process didn't exit!/nThis is a temp solution!");
              }

              imageCacheByte.put(byteArrayOutputStream.toByteArray());
            } else {
              Thread.sleep(100);
            }
          }
        }
    );
  }

  public byte[] getImageByte() throws InterruptedException {
    return imageCacheByte.poll(2, TimeUnit.SECONDS);
  }

}
