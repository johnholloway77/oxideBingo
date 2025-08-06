package dev.jholloway.oxidebingo.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;

public class TileFetcher {

  private ArrayList<String> tiles = new ArrayList<>();

  public TileFetcher() throws IOException {
    setTiles();
  }

  public String fetchTiles(int tileNo) {
    return tiles.get(tileNo);
  }

  public void shuffle() {
    Collections.shuffle(tiles);
  }

  public void setTiles() throws IOException {

    ObjectMapper objectMapper = new ObjectMapper();
    InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream("./tiles.json");
    this.tiles = objectMapper.readValue(inputStream, new TypeReference<>() {
    });
  }
}
