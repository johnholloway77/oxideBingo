package dev.jholloway.oxidebingo.controllers;

import dev.jholloway.oxidebingo.services.CardCacheGenerator;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class HomeController {

  private final CardCacheGenerator cardCacheGenerator;

  @Autowired
  public HomeController(CardCacheGenerator cardCacheGenerator) {
    this.cardCacheGenerator = cardCacheGenerator;
  }

  @GetMapping("/")
  public String home() {
    return "home";
  }

  @GetMapping(value = "/bingocard", produces = "image/webp")
  public ResponseEntity<byte[]> getImage() throws IOException, InterruptedException {

    byte[] imageByte = cardCacheGenerator.getImageByte();

    return ResponseEntity
        .ok()
        .contentType(MediaType.parseMediaType("image/webp"))
        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"bingo-card.webp\"")
        .header(HttpHeaders.CACHE_CONTROL,
            "no-store, no-cache, must-revalidate")  // prevent caching
        .header("Accept-Ranges", "bytes") // allow partial loading (optional)
        .body(imageByte);

  }
}



