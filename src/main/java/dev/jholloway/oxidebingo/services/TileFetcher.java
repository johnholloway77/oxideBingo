package dev.jholloway.oxidebingo.services;


import java.util.ArrayList;
import java.util.Collections;

public class TileFetcher {

  private final ArrayList<String> tiles = new ArrayList<>();

  public TileFetcher() {
    setTiles();
  }


  public String fetchTiles(int tileNo) {
    return tiles.get(tileNo);
  }

  public void shuffle() {
    Collections.shuffle(tiles);
  }

  public void setTiles() {

    tiles.add("Mocks Gen-Z\nSlang");
    tiles.add("Mentioning\nkids");
    tiles.add("Adam makes\nfun of\nBryan");
    tiles.add("Off topic\nRant");
    tiles.add("Over the\ntop\nrant");
    tiles.add("appropriate\nintensity\nrant");
    tiles.add("Bryan\nstutters\nin\nexcitement");
    tiles.add("previous\nepisode\nmentioned");
    tiles.add("bryan's joke\nfalls flat");
    tiles.add("Host\nmispronounces\nword");
    tiles.add("Celebrating\nnew tool\nor\nproduct");

    tiles.add("Simpsons");
    tiles.add("Futurama");
    tiles.add("80s TV\nshow");
    tiles.add("baseball\nmentioned");
    tiles.add("Mastadon");
    tiles.add("tool named\nafter movie\ncharacter");
    tiles.add("nerdy\noffice\nstory");
    tiles.add("weird\nexecutive\nstory");
    tiles.add("Weird\nroad trip\nstory");
    tiles.add("Weird\ncolleague\nstory");
    tiles.add("story about\nlarge\ncompany\nwith\nserver issue");
    tiles.add("historical\nanalogy\nor\nreference");
    tiles.add("blog\nreference\nor\nrecommendation");
    tiles.add("systems\nwe\nlove");

    tiles.add("Oracle hate");
    tiles.add("Sun\nMicrosystems");
    tiles.add("Joyant");
    tiles.add("IBM");
    tiles.add("AWS");
    tiles.add("linux");
    tiles.add("Microsoft");
    tiles.add("apple");
    tiles.add("google");
    tiles.add("facebook");
    tiles.add("twitter");
    tiles.add("delphix");
    tiles.add("DEC");
    tiles.add("jeff bonwick");
    tiles.add("moore's law");
    tiles.add("steve jobs");
    tiles.add("hyperscaler");
    tiles.add("\"on prem\"");

    tiles.add("ZFS");
    tiles.add("C++ Hate");
    tiles.add("C\nprogramming\nlanguage");
    tiles.add("ruby\nlanguage");
    tiles.add("crates");
    tiles.add("nodeJS");
    tiles.add("AI love");
    tiles.add("Kernel issue\nplayer\nunderstands");
    tiles.add("kernel issue\nplayer\ndoes not\nunderstand");
    tiles.add("Rust\npraise");
    tiles.add("bhyve");
    tiles.add("API");
    tiles.add("Illumos\nzones");
    tiles.add("Docker");
    tiles.add("PDP\ncomputers");
    tiles.add("unix");
    tiles.add("Solaris");
    tiles.add("hubris");
    tiles.add("helios");
    tiles.add("SPARC\nProcessor");
    tiles.add("cloud\ncomputing");
    tiles.add("BSD");

    tiles.add("Building a\nrack");
    tiles.add("book\nsuggestion");
    tiles.add("debugging\ntroubles");
    tiles.add("Contacting\nIntel");
    tiles.add("Contacting\nAMD");
    tiles.add("Gimlet\nSled");
    tiles.add("Guest is\ninterviewed");
    tiles.add("Oxide\nemployee\ninterviewed");
    tiles.add("remote\nwork");
    tiles.add("Bryan\nreferences\nvery old\nsystems");
    tiles.add("open\nsource");
    tiles.add("\"scaling\"");
    tiles.add("pitching\nto\ninvestors");
    tiles.add("\n\"when we\nstarted\nthe\ncompany\n...\"");
    tiles.add("Oxide\nValues");
    tiles.add("Request\nfor\ndiscussion");
  }
}
