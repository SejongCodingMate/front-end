// 글자 스플릿하는 함수
function splitText(text) {
    return text.split("");
  }

// 한 글자씩 나타나는 텍스트 애니메이션
export function showTextSequentially(text, setText, interval, callback) {
const characters = splitText(text);
let currentIndex = 0;
let currentText = "";

function showNextCharacter() {
    if (currentIndex < characters.length) {
    currentText += characters[currentIndex];
    setText(currentText);
    currentIndex++;
    setTimeout(showNextCharacter, interval);
    } else {
    if (typeof callback === "function") {
        callback();
    }
    }
}

showNextCharacter();
}