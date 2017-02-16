function removeWidows(input) {
  var wordsArray = input.split(' ');
  var returnString = '';
  if(wordsArray.length > 3) {
    for(let i in wordsArray) {
      var space = '';
      if(i != 0) { space=' ';};
      if(i == (wordsArray.length - 1)) {space='<span class="u_widow" aria-hidden="true"><span class="u_widow__nbsp">&#160;</span></span>';};
      returnString += space + wordsArray[i];
    }
    return returnString;
  }
  else {
    return input;
  }

}
module.exports = removeWidows;
