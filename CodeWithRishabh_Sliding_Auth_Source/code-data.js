const CodeData = {
  "html": "<form id=\"login\">\n  <h2>Sign In</h2>\n  <input type=\"email\" name=\"email\"\n    placeholder=\"Enter E-mail\" required>\n  <input type=\"password\" name=\"password\"\n    placeholder=\"Enter Password\" required>\n  <button>SIGN IN</button>\n</form>\n<aside class=\"overlay\">\n  <h2>Hello World</h2>\n  <p>Sign up and enjoy our site</p>\n  <button id=\"toggle\">SIGN UP</button>\n</aside>",
  "css": ".auth-card {\n  display: flex;\n  width: 580px;\n  background: #ffffff;\n  border-radius: 20px;\n  overflow: hidden;\n}\ninput {\n  width: 100%;\n  padding: 10px;\n  border: 0;\n  background: #edebee;\n  border-radius: 5px;\n}\n.overlay {\n  background: #ff0710;\n  color: #ffffff;\n}\nbutton {\n  background: #ff0710;\n  color: #ffffff;\n  border: 0;\n  border-radius: 5px;\n}\n",
  "js": "function showSignup(open) {\n  card.classList.toggle('signup', open);\n  login.hidden = open;\n  signup.hidden = !open;\n}\ntoggle.addEventListener('click', () => {\n  showSignup(\n    !card.classList.contains('signup')\n  );\n});"
};
if(typeof module!=="undefined") module.exports=CodeData;
if(typeof window!=="undefined") window.CodeData=CodeData;
