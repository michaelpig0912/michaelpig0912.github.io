Window_Base.prototype.standardFontFace = function() {
  if ($gameSystem.isChinese()) {
    return 'Silver.ttf, SimHei, Heiti TC, sans-serif';
  } else if ($gameSystem.isKorean()) {
    return 'Dotum, AppleGothic, sans-serif';
  } else {
    return 'GameFont';
  }
};
Window_Base.prototype.standardFontSize = function() {
  return 40;
};
