# Oxide Bingo

## Purpose

Oxide Bingo is a simple little web app for generating and displaying a collection of randomized
bingo cards for players who listen to the *Oxide and Friends* podcast from Oxide Computers.

This is a silly little thing, not to be taken seriously. It is not made by, supported, nor endorsed
by Oxide Computers. It in no way speaks for Oxide Computer Company.

To reduce latency for users of the web app, the Java application generates an image cache in the
form of a byte array of 50 webp files that can be sent to users. The cache will refill automatically
in a background thread.

Future versions of this silly game will hopefully be a realtime, multiplayer bingo game that can be
played by multiple players during an Oxide and Friends recording. At the moment, it simply generates
a card for the viewer.

Game can be viewed at [https://jholloway.dev/oxidebingo/](https://jholloway.dev/oxidebingo/).
