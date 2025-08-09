package dev.jholloway.oxidebingo.controllers;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class ErrorRedirectController implements ErrorController {

  @RequestMapping("/error")
  public RedirectView redirectError(RedirectAttributes redirectAttributes) {
    redirectAttributes.addAttribute("attribute", "redirectError");
    return new RedirectView("https://jholloway.dev");
    //return new RedirectView("/");
  }
}
