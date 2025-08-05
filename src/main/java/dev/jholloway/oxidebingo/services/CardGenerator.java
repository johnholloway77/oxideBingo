package dev.jholloway.oxidebingo.services;

import static java.lang.System.out;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontFormatException;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.IOException;

public class CardGenerator {

  public static BufferedImage generateImage() {
    Color oxideGreen = Color.decode("#48d597");
    TileFetcher tileFetcher = new TileFetcher();

    try {
      BufferedImage background = ImageLoader.loadImage();
      Font font = FontFetcher.fetchFont().deriveFont(Font.PLAIN, 50);

      return generateCard(tileFetcher, background, oxideGreen, font);

    } catch (IOException | FontFormatException e) {
      System.err.println(e);
      return null;
    }

  }

  private static BufferedImage generateCard(TileFetcher tileFetcher, BufferedImage background,
      Color oxideGreen, Font font) throws IOException {
    final long startTime = System.currentTimeMillis();

    BufferedImage finalImage = new BufferedImage(background.getWidth(), background.getHeight(),
        BufferedImage.TYPE_INT_RGB);

    Graphics2D graphics2D = finalImage.createGraphics();
    graphics2D.drawImage(background, 0, 0, null);
    graphics2D.setFont(font);
    graphics2D.setColor(oxideGreen);

    int rows = 5;
    int cols = 5;

    int topMargin = (int) (background.getHeight() * 0.2263);
    int bottomMargin = (int) (background.getHeight() * 0.0);
    int leftMargin = (int) (background.getWidth() * 0.0672);
    int rightMargin = (int) (background.getWidth() * 0.022);

    int cellBottomMargin = (int) (background.getHeight() * 0.03112);
    int cellWidth = (background.getWidth() - leftMargin - rightMargin) / cols;
    int cellHeight = (background.getHeight() - topMargin - bottomMargin) / rows;

    tileFetcher.shuffle();
    int tileNo = 0;

    for (int row = 0; row < rows; row++) {
      for (int col = 0; col < cols; col++) {
        if (row == 2 && col == 2) {
          // skip this cell as it is the free square tile
        } else {
          drawMultiLineString(graphics2D, tileFetcher.fetchTiles(tileNo), leftMargin, cellWidth,
              topMargin, cellHeight, cellBottomMargin, col, row);
          tileNo++;
        }
      }
    }

    graphics2D.dispose();
    out.printf("Image took %dms to complete\n", System.currentTimeMillis() - startTime);
    return finalImage;

  }

  public static void drawMultiLineString(Graphics2D graphics2D, String text, int rightOffset,
      int cellWidth,
      int verticalOffset, int cellHeight, int cellBottomMargin, int col, int row) {

    String[] lines = text.split("\n");
    int height = lines.length * graphics2D.getFontMetrics().getHeight();
    int y = verticalOffset + row * cellHeight + ((cellHeight - height - cellBottomMargin) / 2);

    for (String line : lines) {

      int centered = (cellWidth - graphics2D.getFontMetrics().stringWidth(line)) / 2;
      int x = rightOffset + col * cellWidth + centered;

      graphics2D.drawString(line.toUpperCase(), x, y);
      y += graphics2D.getFontMetrics().getHeight();
    }

  }

}
