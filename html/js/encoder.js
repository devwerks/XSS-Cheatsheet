function $(id){
    return document.getElementById(id);
}
    
function encode(){ 
  if(document.XSS.ascii.value != ''){ 
    var vText = document.XSS.ascii.value; 
    document.XSS.hex.value = convertToHex(vText); 
    document.XSS.hexhtml.value = convertToHexHTML(vText); 
    var vEncoded = convertToUnicode(vText); 
    document.XSS.unicode.value = vEncoded; 
    document.XSS.ascii.focus();
    document.XSS.ascii.blur();
    document.XSS.ascii.select();
    document.XSS.base64.value=encodeBase64(document.XSS.ascii.value);
    document.XSS.jsfuck.value = JSFuck.encode(vText, $("eval").checked);
  } 
} 

function convertToUnicode(source) { 
  result = ''; 
  for (i=0; i<source.length; i++) 
    result += '&#' + source.charCodeAt(i); 
  return result; 
} 

function convertToHex(num) { 
  var hex = ''; 
  for (i=0;i<num.length;i++) 
    hex += "%" + num.charCodeAt(i).toString(16).toUpperCase(); 
  return hex; 
} 

function convertToHexHTML(num) { 
  var hexhtml = ''; 
  for (i=0;i<num.length;i++) 
    hexhtml += "&#x" + num.charCodeAt(i).toString(16).toUpperCase() + ";"; 
  return hexhtml; 
} 

function convertToASCII() {
  if (document.XSS.unicode.value != '') {
    var uniText = document.XSS.unicode.value;
    var testText = uniText.substring(2,uniText.length).split("&#")
    var resultString = ""
    for (i=0;i<testText.length;i++)
      resultString += "%" + dec2hex(testText[i])
      document.XSS.ascii.value = unescape(resultString);
    }
}

function dec2hex(n){
  var hex = "0123456789ABCDEF";
  var mask = 0xf;
  var retstr = "";
  while(n != 0){
    retstr = hex.charAt(n&mask) + retstr;
    n>>>=4;
  }
  return retstr.length == 0 ? "0" : retstr;
}

var base64Chars = new Array(
    'A','B','C','D','E','F','G','H',
    'I','J','K','L','M','N','O','P',
    'Q','R','S','T','U','V','W','X',
    'Y','Z','a','b','c','d','e','f',
    'g','h','i','j','k','l','m','n',
    'o','p','q','r','s','t','u','v',
    'w','x','y','z','0','1','2','3',
    '4','5','6','7','8','9','+','/'
);

var reverseBase64Chars = new Array();
for (var i=0; i < base64Chars.length; i++){
    reverseBase64Chars[base64Chars[i]] = i;
}

var base64Str;
var base64Count;
function setBase64Str(str){
    base64Str = str;
    base64Count = 0;
}
function readBase64(){    
    if (!base64Str) return -1;
    if (base64Count >= base64Str.length) return -1;
    var c = base64Str.charCodeAt(base64Count) & 0xff;
    base64Count++;
    return c;
}
function encodeBase64(str){
    setBase64Str(str);
    var result = '';
    var inBuffer = new Array(3);
    var lineCount = 0;
    var done = false;
    while (!done && (inBuffer[0] = readBase64()) != -1){
        inBuffer[1] = readBase64();
        inBuffer[2] = readBase64();
        result += (base64Chars[ inBuffer[0] >> 2 ]);
        if (inBuffer[1] != -1){
            result += (base64Chars [(( inBuffer[0] << 4 ) & 0x30) | (inBuffer[1] >> 4) ]);
            if (inBuffer[2] != -1){
                result += (base64Chars [((inBuffer[1] << 2) & 0x3c) | (inBuffer[2] >> 6) ]);
                result += (base64Chars [inBuffer[2] & 0x3F]);
            } else {
                result += (base64Chars [((inBuffer[1] << 2) & 0x3c)]);
                result += ('=');
                done = true;
            }
        } else {
            result += (base64Chars [(( inBuffer[0] << 4 ) & 0x30)]);
            result += ('=');
            result += ('=');
            done = true;
        }
        lineCount += 4;
        if (lineCount >= 76){
            result += ('\n');
            lineCount = 0;
        }
    }
    return result;
}

function readReverseBase64(){   
    if (!base64Str) return -1;
    while (true){      
        if (base64Count >= base64Str.length) return -1;
        var nextCharacter = base64Str.charAt(base64Count);
        base64Count++;
        if (reverseBase64Chars[nextCharacter]){
            return reverseBase64Chars[nextCharacter];
        }
        if (nextCharacter == 'A') return 0;
    } 
}

function ntos(n){
    n=n.toString(16);
    if (n.length == 1) n="0"+n;
    n="%"+n;
    return unescape(n);
}

function decodeBase64(str){
    setBase64Str(str);
    var result = "";
    var inBuffer = new Array(4);
    var done = false;
    while (!done && (inBuffer[0] = readReverseBase64()) != -1
        && (inBuffer[1] = readReverseBase64()) != -1){
        inBuffer[2] = readReverseBase64();
        inBuffer[3] = readReverseBase64();
        result += ntos((((inBuffer[0] << 2) & 0xff)| inBuffer[1] >> 4));
        if (inBuffer[2] != -1){
            result +=  ntos((((inBuffer[1] << 4) & 0xff)| inBuffer[2] >> 2));
            if (inBuffer[3] != -1){
                result +=  ntos((((inBuffer[2] << 6)  & 0xff) | inBuffer[3]));
            } else {
                done = true;
            }
        } else {
            done = true;
        }
    }
    return result;
}