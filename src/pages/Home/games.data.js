import hangmanLogo from "../../images/logos/hangman.png";
import tictactoeLogo from "../../images/logos/tictactoe.png";
import simonsaysLogo from "../../images/logos/simonsays.png";
import whackamoleLogo from "../../images/logos/whackamole.png";
import megablocksLogo from "../../images/logos/megablocks.png";

export const games = [
  {
    title: "HANG MAN",
    description:
      "Guess the hidden word one letter at a time before you run out of chances.",
    path: "/hang-man",
    image: hangmanLogo,
  },
  {
    title: "TIC TAC TOE",
    description: "Take turns placing Xs and Os and try to get three in a row.",
    path: "/tic-tac-toe",
    image: tictactoeLogo,
  },
  {
    title: "SIMON SAYS",
    description:
      "Repeat the growing pattern of lights and sounds as long as you can.",
    path: "/simon-says",
    image: simonsaysLogo,
  },
  {
    title: "WHACK A MOLE",
    description: "Test your reflexes by hitting moles before they disappear.",
    path: "/whack-a-mole",
    image: whackamoleLogo,
  },
  {
    title: "2048",
    description: "Slide and combine tiles to reach the elusive 2048 tile.",
    path: "/2048",
    image: megablocksLogo,
  },
];
