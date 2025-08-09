package dev.jholloway.oxidebingo.services;


import java.awt.Font;
import java.awt.FontFormatException;
import java.awt.GraphicsEnvironment;
import java.io.IOException;
import java.io.InputStream;

public class FontFetcher {

  public static Font fetchFont() throws IOException, FontFormatException {

    try (InputStream is = FontFetcher.class
        .getClassLoader()
        .getResourceAsStream("static/BlexMonoNerdFontPropo-Bold.ttf");
    ) {
      if (is == null) {
        throw new IOException("Font file not found");
      }
      Font font = Font.createFont(Font.TRUETYPE_FONT, is);
      GraphicsEnvironment.getLocalGraphicsEnvironment().registerFont(font);
      return font;
    } catch (FontFormatException | IOException e) {
      e.printStackTrace();
      return new Font("SansSerif", Font.PLAIN, 12); // fallback font
    }

  }
}
