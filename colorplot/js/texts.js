Glob.textIntro = `
<h2>What is this?</h2>
Colorplot is a program that allows to create abstract images with mathematical formulas.

<h2>How does it work?</h2>
Every pixel of the picture has its coordinates - x and y. It also has brightness - from 0 (dark) to 255 (100% bright).

Consider this:<br>
<img src='gallery/grad.png' style='width: 100%;'/>

<p>What you see is a gradient. As you move right, the brightness increases. This picture can be represented with a formula:</p>
<h3>f(x) = x</h3>
<p>Which literally means "brightness equals x-coordinate". When x equals to 0 (left side of picture), brightness also equals to zero (it is dark). When x increases (you go right), so does the brightness, until it stops at 255.</p>


<p>Playing around with trigonometric functions like sin() we can make repeating pattern:</p>

<img src='gallery/04.png' style='width: 100%;'/>

<p>Here, the formula is <strong>f(x) = sin(x) * 128 + 128</strong>. Because sin(x) gives you values from -1 to 1, but we want values from 0 to 255, we simply map it to our range.</p>

<p>To zoom in, scale <strong>x</strong> by deviding it by 10:</p>

<img src='gallery/05.png' style='width: 100%;'/>
<strong>f(x) = sin(x/10) * 128 + 128</strong>

<hr>
<p>Circle equations should be familiar to you from school: <strong>f(x,y) = ((x-150)*(x-150)+(y-150)*(y-150) - 10000)</strong></p>
<img src='gallery/19.png' style='width: 100%;'/>

`
