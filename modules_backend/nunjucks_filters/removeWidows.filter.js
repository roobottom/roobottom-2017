function removeWidows(input) {
  var wordsArray = input.split(' ');
  var returnString = '';
  for(let i in wordsArray) {
    var space = '';
    if(i != 0) { space=' ';};
    if(i == (wordsArray.length - 1)) {space='&#160;';};
    returnString += space + wordsArray[i];
  }
  return returnString;
}
module.exports = removeWidows;
