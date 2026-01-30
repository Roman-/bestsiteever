let aboutText = `
Levenstein Guess is a word game based on <a href='https://en.wikipedia.org/wiki/Levenshtein_distance' target='_blank'>Levenstein distance algorithm</a>.
<br><br>
For a given word (target), the game shows you a list words that are one letter away from the target. These words are highlighted light-green. Words that are two letters away are highlighted dark-green, and so on. Words that are more than 4 letters away are not displayed at all.
<br><br>
As you are completing the levels, the game starts with less and less obvious initial set of words. Level 5 only contain 1 word to start with, and level 6 is likely to only contain words with all the letters being different from the target. When you complete them, you shall see a congratulating gif.
<br><br>
The idea came to me when I was preparing for the coding interview and ran over the Levenstein distance dynamic programming problem. I wrote a console app in C++ and I'been playing it for days. 7th of March 2020 I have finally ported this game on JS, making a web app for everyone to play. Enjoy!
`;
